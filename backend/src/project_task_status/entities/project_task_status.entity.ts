import { Project } from './../../project/entities/project.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn } from "typeorm";

@Entity()
export class ProjectTaskStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> Project, project => project.id)
     @JoinColumn({ name: "project_id"})
     project_id: Project;
    
    @Column({ type: 'varchar' })
    status: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp with time zone' })
    deletedAt: Date;
}
