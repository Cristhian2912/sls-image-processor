export class Image {
    private readonly id: string;
    private readonly name: string;
    private readonly mimeType: string;
    private readonly size: number;
    private readonly filePath: string;
    private readonly createdAt: Date;

    private static readonly ALLOWED_MIME_TYPES = ["image/png", "image/jpeg"];
    private static readonly MAX_SIZE = 1024 * 1024;

    constructor(props: {
        id: string;
        name: string;
        mimeType: string;
        size: number;
        filePath: string;
        createdAt?: Date;
    }) {
        if (!props.id) throw new Error("Image id is required");
        if (!props.name) throw new Error("Image name is required");
        if (!props.mimeType) throw new Error("Image mimeType is required");
        if (props.size <= 0) throw new Error("Image size must be positive");
        if (!props.filePath) throw new Error("Image filePath is required");

        if (!Image.ALLOWED_MIME_TYPES.includes(props.mimeType)) {
            throw new Error(`Mime type ${props.mimeType} not allowed`);
        }

        if (props.size <= 0 || props.size > Image.MAX_SIZE) {
            throw new Error("Invalid image size");
        }

        this.id = props.id;
        this.name = props.name;
        this.mimeType = props.mimeType;
        this.size = props.size;
        this.filePath = props.filePath;
        this.createdAt = props.createdAt ?? new Date();
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getMimeType(): string {
        return this.mimeType;
    }

    getSize(): number {
        return this.size;
    }

    getFilePath(): string {
        return this.filePath;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    isImageTooLarge(): boolean {
        return this.size > Image.MAX_SIZE;
    }

    hasValidMimeType(allowed: string[]): boolean {
        return allowed.includes(this.mimeType);
    }
}
