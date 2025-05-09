import { Module } from '@nestjs/common';
import { UserTasksService } from './user-tasks.service';
import { UserTasksController } from './user-tasks.controller';
import { Expose } from 'src/classes';

@Module({
  controllers: [UserTasksController],
  providers: [UserTasksService, Expose],
})
export class UserTasksModule {}
