import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Priority } from '../entities/task.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Story } from 'src/story/entities/story.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1, description: 'department_id' })
  department_id: Department;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1, description: 'userStory_id' })
  userStory_id: Story;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 3, description: 'story_point' })
  story_point?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 2, description: 'working_hours' })
  working_hours?: number;

  @IsOptional()
  @IsEnum(Priority)
  @ApiProperty({
    enum: Priority,
    example: Priority.low,
    description: 'priority',
  })
  priority: Priority;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'description data', description: 'description' })
  description: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'task 1', description: 'title' })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'comment 1', description: 'comment' })
  comment?: string;
}
