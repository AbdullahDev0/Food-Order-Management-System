import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  blocked_token: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at!: Date;
}
