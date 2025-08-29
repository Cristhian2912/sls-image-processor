import { S3Event, S3Handler } from 'aws-lambda';
import { S3ImageRepository } from '@infra/s3/S3ImageRepository';
import { ProcessImageService } from '@app/process-image/process-image.service';

const s3Repo = new S3ImageRepository(process.env.BUCKET_NAME??'', process.env.AWS_REGION??'');
const processService = new ProcessImageService(s3Repo);

export const handler = async (event: S3Event) => {
    try {
        for (const record of event.Records) {
            // const bucket = record.s3.bucket.name;
            const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
            await processService.process(key);
        }
    } catch (error) {
        console.error("Error procesando archivos:", error);
    }
};
