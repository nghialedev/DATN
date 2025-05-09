import { ProjectTaskStatusController } from './project_task_status.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateProjectTaskStatusDto } from './dto/create-project_task_status.dto';
import { UpdateProjectTaskStatusDto } from './dto/update-project_task_status.dto';
import { ProjectTaskStatus } from './entities/project_task_status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectTaskStatusService {
  constructor(
    @InjectRepository(ProjectTaskStatus)
    private readonly projectTaskStatusRepository: Repository<ProjectTaskStatus>,
  ){}
  async create(dto: CreateProjectTaskStatusDto) {
    try {
        return await this.projectTaskStatusRepository.save(dto);
    } catch (error) {
        console.log(error);
    }
}
async findAll() {
  return await this.projectTaskStatusRepository.find();
}


async findOne(id: number) {
  try {
      const taskStatus = await this.projectTaskStatusRepository.findOne({
          where: { id },
          relations: ['project'], 
      });

      if (!taskStatus) {
          console.log(`Project task status with ID ${id} not found`);
          return { message: `Project task status not found` };
      }

      return taskStatus;
  } catch (error) {
      console.log('Error finding project task status:', error);
      throw error;
  }
}


  async update(id: number, updateProjectTaskStatusDto: UpdateProjectTaskStatusDto) {
    try {
        const projectTask = await this.projectTaskStatusRepository.findOne({
            where: { id }
        });

        if (!projectTask) {
            console.log('This Project Task Status ID is not found');
            return null; 
        }

        Object.assign(projectTask, updateProjectTaskStatusDto);
        return await this.projectTaskStatusRepository.save(projectTask);
    } catch (error) {
        console.log('Error updating project task status:', error);
        throw error; 
    }
}


  async remove(id: number) {
    try {
        const projectTask = await this.projectTaskStatusRepository.findOne({ where: { id } });

        if (!projectTask) {
            console.log(`Project Task Status with ID ${id} not found`);
            return null;
        }

        await this.projectTaskStatusRepository.softDelete(id);
        console.log(`Project Task Status with ID ${id} has been deleted`);

        return { message: `Project Task Status with ID ${id} successfully deleted` };
    } catch (error) {
        console.log('Error deleting project task status:', error);
        throw error;
    }
}

}
