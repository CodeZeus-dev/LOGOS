import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class UploadDocumentDto {
    @IsOptional()
    @IsNotEmpty()
    filename?: string;
}