import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Project } from "src/project/entities/project.entity";

export class CreateProjectTaskStatusDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 1, description: "ID of the project" })
    project_id: Project;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Pending", description: "Status of the project task" })
    status: string;
}
