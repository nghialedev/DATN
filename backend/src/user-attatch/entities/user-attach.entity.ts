import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('user_attachments') 
export class UserAttach {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: "user_id" })
  user_id: User;


  @Column({ type: 'varchar', length: 500 }) 
  file_path: string;

  @Column({ type: 'varchar', nullable: true })
  birth_certificate: string; 

  @Column({ type: 'varchar', nullable: true })
  military_certificate: string; 

  @Column({ type: 'integer', nullable: true})
  national_id: number; // National ID Number

  @Column({ type: 'integer', nullable: true})
  bank_account: number; // Bank Account Number

  @Column({ type: 'varchar', nullable: true})
  address: string; 

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date;
}
