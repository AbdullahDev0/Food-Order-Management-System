import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodDto } from './create-food.dto';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {
  food_name: string;
  food_type: string;
}
