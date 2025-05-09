import { Injectable } from '@nestjs/common';
import { CreateProjectUserDto } from './dto/create-project_user.dto';
import { UpdateProjectUserDto } from './dto/update-project_user.dto';
import { ProjectUser } from './entities/project_user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/project/entities/project.entity';
import {
  ErrorStatusCodesEnum,
  Expose,
  SuccessStatusCodesEnum,
} from 'src/classes';

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
    private readonly expose: Expose,
  ) {}

  async create(createProjectUserDto: CreateProjectUserDto) {
    try {
      const newProjectUser = await this.projectUserRepository.save(createProjectUserDto);
      return this.expose.success(
        SuccessStatusCodesEnum.Created,
        'Project user created successfully',
        newProjectUser,
        true,
      );
    } catch (error) {
      return this.expose.error(error, ErrorStatusCodesEnum.BadRequest);
    }
  }

  async findAll(project_id: Project) {
    try {
      const projectUsers = await this.projectUserRepository.find({
        where: { project_id, deletedAt: null },
      });
      return this.expose.success(
        SuccessStatusCodesEnum.Ok,
        'Project users fetched successfully',
        projectUsers,
        true,
      );
    } catch (error) {
      return this.expose.error(error, ErrorStatusCodesEnum.InternalServerError);
    }
  }

  async findOne(id: number) {
    try {
      const projectUser = await this.projectUserRepository.findOne({ where: { id } });
      if (!projectUser) {
        return this.expose.error(
          'Project user not found',
          ErrorStatusCodesEnum.NotFound,
        );
      }
      return this.expose.success(
        SuccessStatusCodesEnum.Ok,
        'Project user found',
        projectUser,
        true,
      );
    } catch (error) {
      return this.expose.error(error, ErrorStatusCodesEnum.InternalServerError);
    }
  }

  async update(id: number, updateProjectUserDto: UpdateProjectUserDto) {
    try {
      const projectUser = await this.projectUserRepository.findOne({ where: { id } });
      if (!projectUser) {
        return this.expose.error(
          'Project user not found',
          ErrorStatusCodesEnum.NotFound,
        );
      }
      Object.assign(projectUser, updateProjectUserDto);
      const updated = await this.projectUserRepository.save(projectUser);
      return this.expose.success(
        SuccessStatusCodesEnum.Ok,
        'Project user updated successfully',
        updated,
        true,
      );
    } catch (error) {
      return this.expose.error(error, ErrorStatusCodesEnum.InternalServerError);
    }
  }

  async remove(id: number) {
    try {
      const projectUser = await this.projectUserRepository.softDelete(id);
      if (projectUser.affected === 0) {
        return this.expose.error(
          'Project user not found',
          ErrorStatusCodesEnum.NotFound,
        );
      }
      return this.expose.success(
        SuccessStatusCodesEnum.Ok,
        'Project user deleted successfully',
        null,
        true,
      );
    } catch (error) {
      return this.expose.error(error, ErrorStatusCodesEnum.InternalServerError);
    }
  }
}
