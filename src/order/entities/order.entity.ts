import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { Users } from '../../user/entities/user.entity';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.order, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: Relation<Users>;

  @Column()
  food_name: string;

  @Column()
  food_type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  order_quantity: number;

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
}
