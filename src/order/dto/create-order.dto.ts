import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  food_name: string;

  @IsNotEmpty()
  @IsString()
  food_type: string;

  @IsNotEmpty()
  @IsNumber()
  order_quantity: number;

  comments: string;
}
