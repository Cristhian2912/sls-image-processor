export interface UploadImageUseCase {
    upload(filename: string, content: Buffer, mimeType: string): Promise<void>;
}