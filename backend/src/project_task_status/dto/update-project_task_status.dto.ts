import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectTaskStatusDto } from './create-project_task_status.dto';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { Project } from 'src/project/entities/project.entity';

export class UpdateProjectTaskStatusDto extends PartialType(CreateProjectTaskStatusDto) {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 1, description: "ID of the project" })
    project_id: Project;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Pending", description: "Status of the project task" })
    status: string
}
