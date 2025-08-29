import { S3Event, S3Handler } from 'aws-lambda';
// import { S3 } from "aws-sdk";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
// import { minify } from "terser";

const s3 = new S3Client();

export const handler = async (event: S3Event) => {
    // const targetBucket = process.env.TARGET_BUCKET as string;
    // console.log(event);
    try {
        for (const record of event.Records) {
            const bucket = record.s3.bucket.name;
            const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

            console.log(`Procesando imagen: ${bucket}/${key}`);

            // Descargar la imagen original desde S3
            // const originalImage = await s3.getObject({
            //     Bucket: bucket,
            //     Key: key,
            // }).promise();
            const originalImage = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

            if (!originalImage.Body) {
                console.error("No se pudo obtener la imagen");
                return;
            }

            // Comprimir la imagen (calidad 70%)
            const buffer = Buffer.from(await originalImage.Body.transformToByteArray());
            const compressedImage = await sharp(buffer)
            .jpeg({ quality: 70 }) // también puedes usar .png() o .webp()
            .toBuffer();

            // Subir la imagen comprimida a otro bucket o carpeta
            // await s3.putObject({
            //     Bucket: process.env.COMPRESSED_BUCKET!, // bucket destino
            //     Key: `compressed/${key}`,               // ruta dentro del bucket
            //     Body: compressedImage,
            //     ContentType: "image/jpeg",
            // }).promise();
            await s3.send(
                new PutObjectCommand({
                    Bucket: process.env.COMPRESSED_BUCKET!,
                    Key: `compressed/${key}`,
                    Body: compressedImage,
                    ContentType: "image/jpeg",
                })
            );
        }

        // return { status: "success" };
    } catch (error) {
        console.error("Error procesando archivos:", error);
        // return { status: "error", message: (error as Error).message };
    }


    // return {
    //     statusCode: 200,
    //     body: JSON.stringify({ message: 'Se subió la imagen correctamente as' }),
    // };
};
