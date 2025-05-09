import { Injectable } from '@nestjs/common';
import { CreateUserTaskDto } from './dto/create-user-task.dto';
import { UpdateUserTaskDto } from './dto/update-user-task.dto';
import { ErrorStatusCodesEnum, Expose } from '../classes/expose'; 

@Injectable()
export class UserTasksService {
  constructor(private readonly response: Expose) {}

  create(createUserTaskDto: CreateUserTaskDto) {
    try {
      return 'This action adds a new userTask';
    } catch (error) {
      return this.response.error(error, ErrorStatusCodesEnum.BadRequest);
    }
  }

  findAll() {
    try {
      return `This action returns all userTasks`;
    } catch (error) {
      return this.response.error(error, ErrorStatusCodesEnum.BadRequest);
    }
  }

  findOne(id: number) {
    try {
      return `This action returns a #${id} userTask`;
    } catch (error) {
      return this.response.error(error, ErrorStatusCodesEnum.BadRequest);
    }
  }

  update(id: number, updateUserTaskDto: UpdateUserTaskDto) {
    try {
      return `This action updates a #${id} userTask`;
    } catch (error) {
      return this.response.error(error, ErrorStatusCodesEnum.BadRequest);
    }
  }

  remove(id: number) {
    try {
      return `This action removes a #${id} userTask`;
    } catch (error) {
      return this.response.error(error, ErrorStatusCodesEnum.BadRequest);
    }
  }
}
