import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Department } from 'src/departments/entities/department.entity';
import { Project } from 'src/project/entities/project.entity';

export class CreateProjectDepartmentDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1, description: 'department_id' })
  department_id: Department;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1, description: 'project_id' })
  project_id: Project;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  created_at?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updated_at?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deleted_at?: Date;
}
