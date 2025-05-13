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

  async findAll(options?: { 
    status?: string, 
    priority?: string, 
    userStoryId?: number,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC'
  }) {
    try {
      const queryBuilder = this.tasksRepository.createQueryBuilder('task');
      
      // Thêm relations để lấy thông tin liên quan
      queryBuilder.leftJoinAndSelect('task.userStory_id', 'userStory');
      
      // Áp dụng các điều kiện lọc nếu có
      if (options?.status) {
        queryBuilder.andWhere('task.status = :status', { status: options.status });
      }
      
      if (options?.priority) {
        queryBuilder.andWhere('task.priority = :priority', { priority: options.priority });
      }
      
      if (options?.userStoryId) {
        queryBuilder.andWhere('task.userStory_id = :userStoryId', { userStoryId: options.userStoryId });
      }
      
      // Thêm sắp xếp - SỬA PHẦN NÀY
      const sortBy = options?.sortBy || 'created_at'; // Thay đổi từ createdAt thành created_at
      const sortOrder = options?.sortOrder || 'DESC';
      queryBuilder.orderBy(`task.${sortBy}`, sortOrder);
      
      // Thêm phân trang
      if (options?.page && options?.limit) {
        const skip = (options.page - 1) * options.limit;
        queryBuilder.skip(skip).take(options.limit);
      }
      
      // Thực hiện truy vấn và đếm tổng số bản ghi
      const [tasks, total] = await queryBuilder.getManyAndCount();
      
      // Kiểm tra nếu không có task nào
      if (tasks.length === 0) {
        return this.Response.success(
          SuccessStatusCodesEnum.Ok,
          'No tasks found',
          { tasks: [], total: 0 }
        );
      }
      
      return this.Response.success(
        SuccessStatusCodesEnum.Ok,
        'All Tasks fetched successfully',
        { tasks, total, page: options?.page || 1, limit: options?.limit || total }
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
