import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Comments } from 'src/order/entities/comment.entity';
import { Orders } from 'src/order/entities/order.entity';
import { Role } from 'src/shared/enums/role.enum';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  active: boolean;

  @OneToMany(() => Comments, (comment) => comment.user, { eager: true })
  @JoinColumn()
  comment: Comments;

  @OneToMany(() => Orders, (order) => order.user, { eager: true })
  @JoinColumn()
  order: Orders[];

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
