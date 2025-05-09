import { ProjectDepartment } from 'src/project_departments/entities/project_department.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  department: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  deletedAt: Date;

  @OneToMany(() => User, (user) => user.department_id)
  user: User[];

  @OneToMany(() => Task, (task) => task.department_id)
  task: Task[];

  @OneToMany(
    () => ProjectDepartment,
    (project_department) => project_department.department_id,
  )
  project_department: ProjectDepartment[];
}
