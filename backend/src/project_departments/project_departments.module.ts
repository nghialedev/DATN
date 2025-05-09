import { Module } from '@nestjs/common';
import { ProjectDepartmentsService } from './project_departments.service';
import { ProjectDepartmentsController } from './project_departments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectDepartment } from './entities/project_department.entity';
import { Expose } from 'src/classes';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectDepartment])],
  exports: [ProjectDepartmentsService],
  controllers: [ProjectDepartmentsController],
  providers: [ProjectDepartmentsService, Expose],
})
export class ProjectDepartmentsModule {}
