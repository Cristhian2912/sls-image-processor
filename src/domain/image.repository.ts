import { Image } from "./image";

export interface ImageRepository {
    upload(fileName: string, content: Buffer, mimeType: string): Promise<void>;
    getBuffer(filePath: string): Promise<Buffer>;
    get(filePath: string): Promise<Image|void>;
}