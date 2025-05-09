import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString,isNumber } from 'class-validator';
import { Priority } from 'src/tasks/entities/task.entity';

export class CreateStoryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "title ex", description: "title" })
    title: string;  

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: " user story description ", description: "description" })
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: " user story  points  ", description: "  story_point" })
    story_point: number;
        
    @IsOptional()
    @IsEnum(Priority)
    @ApiProperty({
      enum: Priority,
      example: Priority.low,
      description: 'priority',
    })
    priority: Priority;
}
