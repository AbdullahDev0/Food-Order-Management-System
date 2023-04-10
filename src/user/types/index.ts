import { Exclude } from 'class-transformer';
import { Comments } from '../../order/entities/comment.entity';
import { Orders } from '../../order/entities/order.entity';

export class SerializedUser {
  id: number;
  name: string;
  email: string;

  @Exclude()
  order: Orders[];

  @Exclude()
  comment: Comments;

  @Exclude()
  password: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Exclude()
  deletedAt: Date;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}
