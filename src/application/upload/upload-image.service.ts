import { Image } from "@domain/image";
import { ImageRepository } from "@domain/image.repository";
import { buffer } from "stream/consumers";
import { UploadImageUseCase } from "./upload-image.use-case";

export class UploadImageService implements UploadImageUseCase {
    private readonly prefix: string;
    constructor(
        private readonly imageRepository: ImageRepository,
    ) {
        this.prefix = "images";
    }

    async upload(filename: string, content: Buffer, mimeType: string): Promise<void> {
        let image = new Image({
            id: `${this.prefix}/${filename}`,
            name: filename,
            mimeType,
            size: buffer.length,
            filePath: `${this.prefix}/${filename}`,
        });
        await this.imageRepository.upload(image.getFilePath(), content, mimeType);
    }
}
