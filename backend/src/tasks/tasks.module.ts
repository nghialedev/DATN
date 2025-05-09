import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Expose } from 'src/classes';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  exports: [TasksService],
  controllers: [TasksController],
  providers: [TasksService, Expose],
})
export class TasksModule {}
