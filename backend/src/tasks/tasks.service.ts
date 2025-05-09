import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { error } from 'console';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ErrorStatusCodesEnum,
  Expose,
  SuccessStatusCodesEnum,
} from 'src/classes';

@Injectable()
export class TasksService {
  constructor(
    private readonly Response: Expose,
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    try {
      const newTask = await this.tasksRepository.save(createTaskDto);
      // return newTask;
      return this.Response.success(
        SuccessStatusCodesEnum.Ok,
        'Task created successfully',
        newTask,
      );
    } catch (error) {
      console.log(error);
      // return error;
      return this.Response.error(error, ErrorStatusCodesEnum.BadRequest);
    }
  }

  async findAll() {
    try {
      const tasks = await this.tasksRepository.find();
      return this.Response.success(
        SuccessStatusCodesEnum.Ok,
        'All Tasks fetched successfully',
        tasks,
      );
    } catch (error) {
      console.log(error);
      return this.Response.error(error, ErrorStatusCodesEnum.NotFound);
    }
  }

  async findOne(id: number) {
    try {
      const task = await this.tasksRepository.findOne({ where: { id } });
      if (!task) {
        throw new error('task not found ');
      }
      return this.Response.success(
        SuccessStatusCodesEnum.Ok,
        `Task fetched successfully by ${id}`,
        task,
      );
    } catch (error) {
      console.log(error);
      return this.Response.error(error, ErrorStatusCodesEnum.NotFound);
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.tasksRepository.findOne({ where: { id } });
      if (!task) {
        throw new error('task not found ');
      }
      const updatedTask = await this.tasksRepository.update(id, updateTaskDto);
      return this.Response.success(
        SuccessStatusCodesEnum.Ok,
        `Task updated successfully by ${id}`,
        updatedTask,
      );
    } catch (error) {
      console.log(error);
      return this.Response.error(error, ErrorStatusCodesEnum.NotFound);
    }
  }

  async remove(id: number) {
    try {
      const task = await this.tasksRepository.findOne({ where: { id } });
      if (!task) {
        throw new error('task not found ');
      }
      const deletedTask = this.tasksRepository.softDelete(id);
      return this.Response.success(
        SuccessStatusCodesEnum.Ok,
        `Task deleted successfully by ${id}`,
        deletedTask,
      );
    } catch (error) {
      console.log(error);
      return this.Response.error(error, ErrorStatusCodesEnum.BadRequest);
    }
  }
}
