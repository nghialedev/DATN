import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserTaskDto } from './create-user-task.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateUserTaskDto extends PartialType(CreateUserTaskDto) {
    @ApiProperty({ example: 1, description: 'User ID', required: false })
  @IsNumber()
  @IsOptional()
  user_id?: number;

  @ApiProperty({ example: 2, description: 'Task ID', required: false })
  @IsNumber()
  @IsOptional()
  task_id?: number;

  @ApiProperty({ example: 1, description: 'Project Task Status ID', required: false })
  @IsNumber()
  @IsOptional()
  project_task_status_id?: number;

  @ApiProperty({ example: 1709836800, description: 'Start date (timestamp)', required: false })
  @IsNumber()
  @IsOptional()
  start_date?: number;

  @ApiProperty({ example: 1709923200, description: 'End date (timestamp)', required: false })
  @IsNumber()
  @IsOptional()
  end_date?: number;

  @ApiProperty({ example: 8, description: 'Actual working time in hours', required: false })
  @IsNumber()
  @IsOptional()
  actual_working_time?: number;
}
