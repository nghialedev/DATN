import { ApiProperty } from "@nestjs/swagger";
import {  IsEnum, IsNotEmpty,IsNumber,IsOptional, IsString,MaxLength,} from "class-validator";
import { User } from "src/user/entities/user.entity";

export class CreateUserAttachDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: "Attachment ID" })
  id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: User

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "cv.pdf", description: "File name" })
  file_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "/uploads/user123/cv.pdf", description: "File path" })
  file_path: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 204800, description: "File size in bytes" })
  file_size: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "application/pdf", description: "MIME type of the file" })
  mime_type: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: "/uploads/birth-cert.pdf", required: false })
  birth_certificate?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: "/uploads/military-cert.pdf", required: false })
  military_certificate?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 29876543210987, required: false })
  national_id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: "DE89370400440532013000", required: false })
  bank_account?: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  @ApiProperty({ example: "123 Street Name, City, Country", required: false })
  address?: string;
}
