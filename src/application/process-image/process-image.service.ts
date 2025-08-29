import { ImageRepository } from "@domain/image.repository";
import { ProcessImageUseCase } from "./process-image.use-case";
import sharp from "sharp";

export class ProcessImageService implements ProcessImageUseCase {
    private readonly prefix: string;
    
    constructor(
        private readonly imageRepository: ImageRepository,
    ) {
        this.prefix = "optimized";
    }

    async process(filePath: string): Promise<void> {
        let image = await this.imageRepository.get(filePath);
        if (!image) {
            throw new Error("La imagen no existe");
        }
        let content = await this.imageRepository.getBuffer(filePath);

        let webp = await sharp(content).webp({ quality: 80 }).toBuffer();
        await this.imageRepository.upload(`${this.prefix}/webp/${image.getName()}`, webp, "image/webp");
        webp = Buffer.alloc(0);
        console.log(`imagen webp cargada ${this.prefix}/webp/${image.getName()}`);

        let avif = await sharp(content).avif({ quality: 50, effort: 2 }).toBuffer();
        await this.imageRepository.upload(`${this.prefix}/avif/${image.getName()}`, avif, "image/avif");
        avif = Buffer.alloc(0);
        console.log(`imagen avif cargada ${this.prefix}/avif/${image.getName()}`);

        let png = await sharp(content).png({ compressionLevel: 6 }).toBuffer();
        await this.imageRepository.upload(`${this.prefix}/png/${image.getName()}`, png, "image/png");
        png = Buffer.alloc(0);
        content = Buffer.alloc(0);
        console.log(`imagen png cargada ${this.prefix}/png/${image.getName()}`);
    }
}
