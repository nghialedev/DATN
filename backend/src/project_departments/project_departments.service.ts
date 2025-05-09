import { Injectable } from '@nestjs/common';
import { CreateProjectDepartmentDto } from './dto/create-project_department.dto';
import { UpdateProjectDepartmentDto } from './dto/update-project_department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectDepartment } from './entities/project_department.entity';
import { Repository } from 'typeorm';
import {
  ErrorStatusCodesEnum,
  Expose,
  SuccessStatusCodesEnum,
} from 'src/classes';

@Injectable()
export class ProjectDepartmentsService {
  constructor(
    private readonly response: Expose,
    @InjectRepository(ProjectDepartment)
    private readonly projectDepartmentRepository: Repository<ProjectDepartment>,
  ) {}
  async create(createProjectDepartmentDto: CreateProjectDepartmentDto) {
    try {
      const projectDepartment = this.projectDepartmentRepository.create(
        createProjectDepartmentDto,
      );
      const savedProjectDepartment =
        await this.projectDepartmentRepository.save(projectDepartment);
      return this.response.success(
        SuccessStatusCodesEnum.Ok,
        'Project Department created successfully',
        savedProjectDepartment,
      );
    } catch (error) {
      return this.response.error(error, ErrorStatusCodesEnum.BadRequest);
    }
  }

  async findAll() {
    try {
      const projectDepartments = await this.projectDepartmentRepository.find();
      return this.response.success(
        SuccessStatusCodesEnum.Ok,
        'All Project Departments fetched successfully',
        projectDepartments,
      );
    } catch (error) {
      return this.response.error(error, ErrorStatusCodesEnum.NotFound);
    }
  }

  async findOne(id: number) {
    try {
      const projectDepartment = await this.projectDepartmentRepository.findOne({
        where: { id },
      });
      if (!projectDepartment) {
        throw new Error('projectDepartment not found ');
      }
      return this.response.success(
        SuccessStatusCodesEnum.Ok,
        'Project Department fetched successfully',
        projectDepartment,
      );
    } catch (error) {
      return this.response.error(error, ErrorStatusCodesEnum.NotFound);
    }
  }

  async update(
    id: number,
    updateProjectDepartmentDto: UpdateProjectDepartmentDto,
  ) {
    try {
      const projectDepartment = await this.projectDepartmentRepository.findOne({
        where: { id },
      });
      if (!projectDepartment) {
        throw new Error('projectDepartment not found ');
      }
      const updatedProjectDepartment =
        await this.projectDepartmentRepository.update(
          id,
          updateProjectDepartmentDto,
        );
      return this.response.success(
        SuccessStatusCodesEnum.Ok,
        'Project Department updated successfully',
        updatedProjectDepartment,
      );
    } catch (error) {
      return this.response.error(error, ErrorStatusCodesEnum.NotFound);
    }
  }

  async remove(id: number) {
    try {
      const projectDepartment = await this.projectDepartmentRepository.findOne({
        where: { id },
      });
      if (!projectDepartment) {
        throw new Error('projectDepartment not found ');
      }
      const deletedProjectDepartment =
        await this.projectDepartmentRepository.softDelete(id);
      return this.response.success(
        SuccessStatusCodesEnum.Ok,
        'Project Department removed successfully',
        deletedProjectDepartment,
      );
    } catch (error) {
      return this.response.error(error, ErrorStatusCodesEnum.BadRequest);
    }
  }
}
