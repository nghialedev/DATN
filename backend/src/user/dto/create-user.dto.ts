import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { UserGender } from "../entities/user.entity";
import { Department } from "src/departments/entities/department.entity";

export class CreateUserDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({example: 1, description: "department_id" })
    department_id: Department;
        
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "John Doe", description: "username" })
    username: string;
        
    
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: "john.doe@example.com", description: "email" })
    email: string;
        
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: "123456", description: "user password" })
    password: string;
        
    @IsEnum(UserGender)
    @ApiProperty({ enum: UserGender, example: UserGender.Male, description: "gender" })
    gender: UserGender;
    
    @IsOptional()
    @IsDateString()
    @ApiProperty({ example: "1995-01-01", description: "birth_date" })
    birth_date: Date;
    
    @IsOptional()
    @IsString()
    @ApiProperty({ example: "image.png", description: "profile_image" })
    profile?: string;
    
    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: 5, description: "rate" })
    rate?: number;
}
