import { ProjectTaskStatus } from './project_task_status/entities/project_task_status.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { RateModule } from './rate/rate.module';
import { Rate } from './rate/entities/rate.entity';
import { UserBugsModule } from './user_bugs/user_bugs.module';
import { UserBug } from './user_bugs/entities/user_bug.entity';
import { ProjectTaskStatusModule } from './project_task_status/project_task_status.module';
import { StoryModule } from './story/story.module';
import { Story } from './story/entities/story.entity';
import { ProjectModule } from './project/project.module';
import { ProjectUserModule } from './project_user/project_user.module';
import { ProjectUser } from './project_user/entities/project_user.entity';
import { DepartmentsModule } from './departments/departments.module';
import { Department } from './departments/entities/department.entity';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';
import { Project } from './project/entities/project.entity';
import { ProjectDepartmentsModule } from './project_departments/project_departments.module';
import { UserTasksModule } from './user-tasks/user-tasks.module';
import { ProjectDepartment } from './project_departments/entities/project_department.entity';
import { UserAttach } from './user-attatch/entities/user-attach.entity';
import { UserTask } from './user-tasks/entities/user-task.entity';
import { ChatGateway } from './chat/chat.gateway';
import { MessageModule } from './message/message.module';
import * as dotenv from 'dotenv';
import { Message } from './message/entities/message.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,  
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Department,
        Project,
        ProjectDepartment,
        ProjectTaskStatus,
        ProjectUser,
        Rate,
        Story,
        Task,
        User,
        UserBug,
        UserAttach,
        UserTask,
        Message
      ],
      synchronize: true,
    }),
    DepartmentsModule,
    ProjectModule,
    ProjectDepartmentsModule,
    ProjectTaskStatusModule,
    ProjectUserModule,
    RateModule,
    StoryModule,
    TasksModule,
    UserModule,
    UserBugsModule,
    UserAttach,
    UserTasksModule,
    MessageModule,
    TypeOrmModule.forFeature([Message])
  ],
  providers: [ChatGateway],
})
export class AppModule {}
