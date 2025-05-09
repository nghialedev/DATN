import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserBugsService } from './user_bugs.service';
import { CreateUserBugDto } from './dto/create-user_bug.dto';
import { UpdateUserBugDto } from './dto/update-user_bug.dto';

@Controller('user-bugs')
export class UserBugsController {
  constructor(private readonly userBugsService: UserBugsService) {}

  @Post()
  create(@Body() createUserBugDto: CreateUserBugDto) {
    return this.userBugsService.create(createUserBugDto);
  }

  @Get()
  findAll() {
    return this.userBugsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userBugsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserBugDto: UpdateUserBugDto) {
    return this.userBugsService.update(+id, updateUserBugDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userBugsService.remove(+id);
  }
}
