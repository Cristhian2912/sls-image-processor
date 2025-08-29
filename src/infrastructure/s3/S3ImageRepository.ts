import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { Image } from "@domain/image";
import { ImageRepository } from "@domain/image.repository";

export class S3ImageRepository implements ImageRepository {
    private s3: S3Client;

    constructor(
        private readonly bucketName: string,
        region: string
    ) {
        this.s3 = new S3Client({ region });
    }

    async upload(fileName: string, content: Buffer, mimeType: string): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            Body: content,
            ContentType: mimeType,
        });

        await this.s3.send(command);
    }

    async getBuffer(filePath: string): Promise<Buffer> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: filePath,
        });
        let image = await this.s3.send(command);
        if (!image.Body) {
            throw new Error("No se pudo obtener la imagen");
        }
        const buffer = Buffer.from(await image.Body.transformToByteArray());
        return buffer;
    }

    async get(filePath: string): Promise<Image|void> {
        const command = new HeadObjectCommand({
            Bucket: this.bucketName,
            Key: filePath,
        });
        const response = await this.s3.send(command);
        let fileParts = filePath.split('/');
        return new Image({
            id: filePath,
            name: fileParts[fileParts.length-1],
            mimeType: response.ContentType??'',
            size: response.ContentLength??0,
            filePath: filePath,
            createdAt: response.LastModified
        });
    }
}