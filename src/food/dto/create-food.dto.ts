import { IsNotEmpty } from 'class-validator';

export class CreateFoodDto {
  @IsNotEmpty()
  food_name: string;
  @IsNotEmpty()
  food_type: string;
}
