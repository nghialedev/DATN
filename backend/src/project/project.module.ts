import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ProjectUser } from 'src/project_user/entities/project_user.entity';
import { Expose } from 'src/classes';

@Module({
  imports:[TypeOrmModule.forFeature([Project,ProjectUser]),AuthModule,UserModule],
  exports:[ProjectService],
  controllers: [ProjectController],
  providers: [ProjectService,Expose],
})
export class ProjectModule {}
