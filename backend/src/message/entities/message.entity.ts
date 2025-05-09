import { Project } from "src/project/entities/project.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'sender_id' })
    sender_id: number

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'receiver_id' })
    receiver_id: number

    @ManyToOne(() => Project, (project) => project.id)
    @JoinColumn({ name: 'project_id' })
    project_id: number

    @Column({ type: 'text' })
    message: string

    @Column({ type: 'boolean', default: false })
    seen: boolean

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date

    @DeleteDateColumn({ type: 'timestamp with time zone' })
    deletedAt: Date
}
