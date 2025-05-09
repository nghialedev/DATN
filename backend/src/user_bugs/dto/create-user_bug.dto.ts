import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateUserBugDto {
  @ApiProperty({ example: 1, description: 'User Task ID' })
  @IsNumber()
  @IsNotEmpty()
  user_task_id: number;

  @ApiProperty({ example: 3, description: 'Story points of the bug' })
  @IsNumber()
  story_point: number;

  @ApiProperty({ example: 5, description: 'Estimated working hours' })
  @IsNumber()
  working_hours: number;

  @ApiProperty({ example: 2, description: 'Bug priority level' })
  @IsNumber()
  priority: number;

  @ApiProperty({ example: 'Login Button Issue', description: 'Title of the bug' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'This bug happens randomly', description: 'Additional comments' })
  @IsString()
  comment: string;

  @ApiProperty({ example: 'The login button is not responsive on mobile devices', description: 'Detailed bug description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1, description: 'Current bug status' })
  @IsNumber()
  @IsNotEmpty()
  bug_status: number;
}
