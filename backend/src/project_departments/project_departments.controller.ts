import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectDepartmentsService } from './project_departments.service';
import { CreateProjectDepartmentDto } from './dto/create-project_department.dto';
import { UpdateProjectDepartmentDto } from './dto/update-project_department.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Role } from 'src/auth/decorator/roles.decorator';

@Controller('project-departments')
@UseGuards(JwtAuthGuard)
export class ProjectDepartmentsController {
  constructor(
    private readonly projectDepartmentsService: ProjectDepartmentsService,
  ) {}

  @Role('manager')
  @Post()
  create(@Body() createProjectDepartmentDto: CreateProjectDepartmentDto) {
    return this.projectDepartmentsService.create(createProjectDepartmentDto);
  }

  @Role('user')
  @Get()
  findAll() {
    return this.projectDepartmentsService.findAll();
  }

  @Role('user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectDepartmentsService.findOne(+id);
  }

  @Role('manager')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDepartmentDto: UpdateProjectDepartmentDto,
  ) {
    return this.projectDepartmentsService.update(
      +id,
      updateProjectDepartmentDto,
    );
  }

  @Role('manager')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectDepartmentsService.remove(+id);
  }
}
