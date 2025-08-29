import { APIGatewayEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';
// import { S3 } from "aws-sdk";
// const s3 = new S3();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No se envió imagen" }),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Imagen subida correctamente",
            }),
        };
        /*const imageBuffer = Buffer.from(event.body, "base64");

        const fileName = `original-${Date.now()}.jpg`;
        await s3
        .putObject({
            Bucket: process.env.BUCKET_NAME!,
            Key: fileName,
            Body: imageBuffer,
            ContentType: "image/jpeg",
        })
        .promise();

        console.log('BUCKET_NAME', process.env.BUCKET_NAME!);
        console.log(fileName);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Imagen subida correctamente",
                fileUrl: `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
            }),
        };*/
    } catch (error) {
        console.error(error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Error subiendo la imagen" }),
        };
    }
};
