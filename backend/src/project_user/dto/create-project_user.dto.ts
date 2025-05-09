import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateProjectUserDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1, description: 'project_id' })
  project_id: Project;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'user_id' })
  user_id: User;
}
