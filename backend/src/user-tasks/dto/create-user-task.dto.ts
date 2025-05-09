import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserTaskDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ example: 2, description: 'Task ID' })
  @IsNumber()
  @IsNotEmpty()
  task_id: number;

  @ApiProperty({ example: 1, description: 'Project Task Status ID' })
  @IsNumber()
  @IsNotEmpty()
  project_task_status_id: number;

  @ApiProperty({ example: 1709836800, description: 'Start date (timestamp)' })
  @IsNumber()
  @IsNotEmpty()
  start_date: number;

  @ApiProperty({ example: 1709923200, description: 'End date (timestamp)' })
  @IsNumber()
  @IsNotEmpty()
  end_date: number;

  @ApiProperty({ example: 8, description: 'Actual working time in hours' })
  @IsNumber()
  @IsNotEmpty()
  actual_working_time: number;
}
