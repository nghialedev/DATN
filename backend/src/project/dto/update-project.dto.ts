import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
            @IsNotEmpty()
            @IsString()
            @ApiProperty({example: 'Project1', description: "Project Name" })
            name: string;
                
            @IsNotEmpty()
            @IsDateString()
            @ApiProperty({ example: "2024-01-30", description: "Project Start Date" })
            start_date: Date;
    
            @IsOptional()
            @IsDateString()
            @ApiProperty({ example: "2024-01-30", description: "Project End Date" })
            end_date: Date;
            
            @IsNumber()
            @IsNotEmpty()
            @ApiProperty({ example: 3, description: "Client ID" })
            client_id: number;
}
