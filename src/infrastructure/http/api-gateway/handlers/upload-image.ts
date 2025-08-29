import { UploadImageService } from '@app/upload/upload-image.service';
import { S3ImageRepository } from '@infra/s3/S3ImageRepository';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';

const s3Repo = new S3ImageRepository(process.env.BUCKET_NAME??'', process.env.AWS_REGION??'');
const uploadService = new UploadImageService(s3Repo);

const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
};

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No se envió imagen" }),
            };
        }
        let contentType = event.headers["content-type"] || event.headers["Content-Type"];
        if (!contentType) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Se debe enviar un content-type válido" }),
            };
        }
        const isBase64 = event.isBase64Encoded;
        const buffer = Buffer.from(event.body, isBase64 ? "base64" : "utf8");
        const ext = mimeToExt[contentType] ?? '';
        const fileName = `img-${Date.now()}.${ext}`;

        await uploadService.upload(fileName, buffer, contentType);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Imagen subida correctamente",
            }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Error subiendo la imagen" }),
        };
    }
};
