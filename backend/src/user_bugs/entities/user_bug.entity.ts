import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { UserTask } from 'src/user-tasks/entities/user-task.entity';
import { ProjectTaskStatus } from 'src/project_task_status/entities/project_task_status.entity';

@Entity('user_bugs')
export class UserBug {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserTask, (userTask) => userTask.id)
    @JoinColumn({name: "userTask_id"})
    userTask_id: UserTask;

    @OneToOne(() => ProjectTaskStatus, projectTaskStatus => projectTaskStatus.id)
    @JoinColumn({ name: 'project_task_status_id' })
    project_task_status_id: ProjectTaskStatus;

    @Column({ type: 'integer' })
    story_point: number;

    @Column({ type: 'float' })
    working_hours: number;

    @Column({ type: 'integer' })
    priority: number;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'text' })
    comment: string;

    @Column({ type: 'text' })
    description: string; 

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;
        
    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
    
    @DeleteDateColumn({ type: 'timestamp with time zone' })
    deletedAt: Date;
}
