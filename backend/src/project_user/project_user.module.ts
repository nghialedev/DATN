import { Expose } from 'src/classes';
import { Module } from '@nestjs/common';
import { ProjectUserService } from './project_user.service';
import { ProjectUserController } from './project_user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUser } from './entities/project_user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ProjectUser])],
  exports: [ProjectUserService],
  controllers: [ProjectUserController],
  providers: [ProjectUserService, Expose],
})
export class ProjectUserModule {}
