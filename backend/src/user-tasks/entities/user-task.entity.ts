import { ProjectTaskStatus } from 'src/project_task_status/entities/project_task_status.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { UserBug } from 'src/user_bugs/entities/user_bug.entity';
import { JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity('user_tasks')
export class UserTask {
  @PrimaryGeneratedColumn()
  id: number;
  
  @OneToMany(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @ManyToOne(() => Task, task => task.id)
  @JoinColumn({ name: 'task_id' })
  task_id: Task;

  @OneToOne(() => ProjectTaskStatus, projectTaskStatus => projectTaskStatus.id)
  @JoinColumn({ name: 'project_task_status_id' })
  project_task_status_id: ProjectTaskStatus;

  @Column({ type: 'date' })
  start_date: number;

  @Column({ type: 'date' })
  end_date: number;

  @Column({ type: 'integer' })
  actual_working_time: number;

  @OneToMany(() => UserBug, userBug => userBug.userTask_id)
  userBugs: UserBug[];
}
