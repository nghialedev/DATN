import { Message } from 'src/message/entities/message.entity';
import { ProjectDepartment } from 'src/project_departments/entities/project_department.entity';
import { ProjectTaskStatus } from 'src/project_task_status/entities/project_task_status.entity';
import { ProjectUser } from 'src/project_user/entities/project_user.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  deletedAt: Date;

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.project_id)
  projectUsers: ProjectUser[];

  @OneToMany(
    () => ProjectTaskStatus,
    (projectTaskStatus) => projectTaskStatus.project_id,
  )
  projectTaskStatus: ProjectTaskStatus[];

  @OneToMany(
    () => ProjectDepartment,
    (project_department) => project_department.project_id,
  )
  project_department: ProjectDepartment[];

  @OneToMany(() => Message, (message) => message.project_id)
  message: Message[];

}