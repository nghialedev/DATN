import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectTaskStatusService } from './project_task_status.service';
import { CreateProjectTaskStatusDto } from './dto/create-project_task_status.dto';
import { UpdateProjectTaskStatusDto } from './dto/update-project_task_status.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Role } from 'src/auth/decorator/roles.decorator';

@Controller('project-task-status')
@UseGuards(JwtAuthGuard)
export class ProjectTaskStatusController {
  constructor(private readonly projectTaskStatusService: ProjectTaskStatusService) {}

  @Post()
  @Role('manager')
  create(@Body() createProjectTaskStatusDto: CreateProjectTaskStatusDto) {
    return this.projectTaskStatusService.create(createProjectTaskStatusDto);
  }

  @Get()
  findAll() {
    return this.projectTaskStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectTaskStatusService.findOne(+id);
  }

  @Patch(':id')
  @Role('manager')
  update(@Param('id') id: string, @Body() updateProjectTaskStatusDto: UpdateProjectTaskStatusDto) {
    return this.projectTaskStatusService.update(+id, updateProjectTaskStatusDto);
  }

  @Delete(':id')
  @Role('manager')
  remove(@Param('id') id: string) {
    return this.projectTaskStatusService.remove(+id);
  }
}
