import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  //   @IsOptional()
  //   @IsInt()
  //   department_id?: number;
  //
  //   @IsOptional()
  //   @IsInt()
  //   userStory_id?: number;
  //
  //   @IsOptional()
  //   @IsInt()
  //   story_point?: number;
  //
  //   @IsOptional()
  //   @IsInt()
  //   working_hours?: number;
  //
  //   @IsOptional()
  //   @IsEnum(Priority)
  //   priority?: Priority;
  //
  //   @IsOptional()
  //   @IsString()
  //   @MaxLength(100)
  //   description?: string;
  //
  //   @IsOptional()
  //   @IsString()
  //   @MaxLength(100)
  //   title?: string;
  //
  //   @IsOptional()
  //   @IsString()
  //   @MaxLength(100)
  //   comment?: string;
}
