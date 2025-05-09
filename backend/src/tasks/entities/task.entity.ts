import { Department } from 'src/departments/entities/department.entity';
import { Story } from 'src/story/entities/story.entity';
import { UserTask } from 'src/user-tasks/entities/user-task.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Priority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}
@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;
  // One to one relation with department, need to import the department and check for the reverse relation
  @ManyToOne(() => Department, (department) => department.id)
  @JoinColumn({ name: 'department_id'})
  department_id: Department;

  // One to one relation with UserStory, need to import the UserStory and check for the reverse relation
  @ManyToOne(() => Story, (userStory) => userStory.id)
  @JoinColumn({ name: 'userStory_id' })
  userStory_id: Story;

  //inverse relation with user_tasks
  @OneToMany(() => UserTask, (userTask) => userTask.task_id)
  userTask: UserTask[];

  @Column({ type: 'integer', default: 1 })
  story_point: number;

  @Column({ type: 'float', default: 2 })
  working_hours: number;

  @Column({ type: 'varchar', default: 'low' })
  priority: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deleted_at: Date;
}
