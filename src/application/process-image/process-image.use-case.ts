export interface ProcessImageUseCase {
    process(filePath: string, fileName: string, mimeType: string): Promise<void>;
}
