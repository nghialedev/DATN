import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectDepartmentDto } from './create-project_department.dto';
import { IsDate, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Department } from 'src/departments/entities/department.entity';
import { Project } from 'src/project/entities/project.entity';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { Type } from 'class-transformer';

export class UpdateProjectDepartmentDto extends PartialType(
  CreateProjectDepartmentDto,
) {
  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  @ApiProperty({ example: 1, description: 'department_id' })
  department_id: Department;

  @IsNotEmpty()
  @IsOptional()
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
