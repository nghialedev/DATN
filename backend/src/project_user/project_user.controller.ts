import { 
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards 
} from '@nestjs/common';
import { ProjectUserService } from './project_user.service';
import { CreateProjectUserDto } from './dto/create-project_user.dto';
import { UpdateProjectUserDto } from './dto/update-project_user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Project } from 'src/project/entities/project.entity';

@Controller('project-user')
@UseGuards(JwtAuthGuard) 
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService) {}

  @Post()
  create(@Body() createProjectUserDto: CreateProjectUserDto) {
    return this.projectUserService.create(createProjectUserDto);
  }

  @Get()
  findAll(@Query('project_id') project_id: Project) {
    if (!project_id) {
      return { message: 'Project ID is required' };
    }
    return this.projectUserService.findAll(project_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectUserDto: UpdateProjectUserDto) {
    return this.projectUserService.update(+id, updateProjectUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectUserService.remove(+id);
  }
}
