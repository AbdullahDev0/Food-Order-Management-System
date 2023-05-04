import { Exclude } from 'class-transformer';

export class SerializedOrder {
  id: number;
  food_name: string;
  food_type: string;
  order_quantity: number;
  created_at: Date;

  @Exclude()
  updated_at: Date;

  constructor(partial: Partial<SerializedOrder>) {
    Object.assign(this, partial);
  }
}
