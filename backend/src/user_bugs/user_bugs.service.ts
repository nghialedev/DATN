import { Injectable } from '@nestjs/common';
import { CreateUserBugDto } from './dto/create-user_bug.dto';
import { UpdateUserBugDto } from './dto/update-user_bug.dto';

@Injectable()
export class UserBugsService {
  create(createUserBugDto: CreateUserBugDto) {
    return 'This action adds a new userBug';
  }

  findAll() {
    return `This action returns all userBugs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userBug`;
  }

  update(id: number, updateUserBugDto: UpdateUserBugDto) {
    return `This action updates a #${id} userBug`;
  }

  remove(id: number) {
    return `This action removes a #${id} userBug`;
  }
}
