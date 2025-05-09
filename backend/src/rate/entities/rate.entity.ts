import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Rate {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> User, user => user.id)
    @JoinColumn({name: "user_id"})
    user_id: User;

    @ManyToOne(()=> User, user => user.id)
    @JoinColumn({name: "rated_by_id"})
    rated_by_id: User;
    
    @Column({ type: 'integer' })
    rate: number;
    
    @Column({ type: 'date' })
    month: Date;
    
    @Column({ type: 'date' })
    year: Date;
    
    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp with time zone' })
    deletedAt: Date;
}
