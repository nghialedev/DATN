import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({example: "john.doe@example.com", description: "user email", required: true})
    email: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: "123456", description: "user password", required: true})
    password: string
}