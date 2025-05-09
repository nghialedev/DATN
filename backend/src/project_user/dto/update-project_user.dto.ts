import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';

export class UpdateProjectUserDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, description: 'Updated project_id' })
  project_id: Project;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, description: 'Updated user_id' })
  user_id?: User;
}
