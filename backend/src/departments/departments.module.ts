import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Expose } from 'src/classes';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  exports: [DepartmentsService],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, Expose],
})
export class DepartmentsModule {}
