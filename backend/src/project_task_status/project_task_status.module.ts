import { Module } from '@nestjs/common';
import { ProjectTaskStatusService } from './project_task_status.service';
import { ProjectTaskStatusController } from './project_task_status.controller';
import { ProjectTaskStatus } from './entities/project_task_status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/project/entities/project.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ProjectTaskStatus,Project])],
  exports: [ProjectTaskStatusService],
  controllers: [ProjectTaskStatusController],
  providers: [ProjectTaskStatusService],
  
})
export class ProjectTaskStatusModule {}
