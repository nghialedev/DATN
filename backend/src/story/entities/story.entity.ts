import { Priority, Task } from 'src/tasks/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  description: string;
   
  @Column({ type: 'integer' })
  story_point: number;
  
  @Column({ type: 'varchar' })
  priority: string;
      
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
     
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
  
  @DeleteDateColumn({ type: 'timestamp with time zone' })
  deletedAt: Date;
     
  @OneToMany(() => Task, (task) => task.userStory_id)
  tasks: Task[];
}
