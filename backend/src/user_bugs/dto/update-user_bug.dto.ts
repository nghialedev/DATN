import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserBugDto } from './create-user_bug.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserBugDto extends PartialType(CreateUserBugDto) {
@ApiProperty({ example: 1, description: 'User Task ID', required: false })
  @IsNumber()
  @IsOptional()
  userTask_id?: number;

  @ApiProperty({ example: 1, description: 'Project Task Status ID', required: false })
  @IsNumber()
  @IsOptional()
  project_task_status_id?: number;

  @ApiProperty({ example: 3, description: 'Story points of the bug'})
  @IsNumber()
  @IsOptional()
  story_point?: number;

  @ApiProperty({ example: 5, description: 'Estimated working hours' })
  @IsNumber()
  @IsOptional()
  working_hours?: number;

  @ApiProperty({ example: 2, description: 'Bug priority level' })
  @IsNumber()
  @IsOptional()
  priority?: number;

  @ApiProperty({ example: 'Login Button Issue', description: 'Title of the bug'})
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'This bug happens randomly', description: 'Additional comments' })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ example: 'The login button is not responsive on mobile devices', description: 'Detailed bug description'})
  @IsString()
  @IsOptional()
  description?: string;
}
