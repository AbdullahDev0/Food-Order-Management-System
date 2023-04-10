import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Foods } from './entities/food.entity';
import customMessage from '../shared/responses/customMessage.response';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Foods) private readonly foodRepository: Repository<Foods>,
  ) {}

  async create(createFoodDto: CreateFoodDto) {
    const food_name = createFoodDto.food_name;
    if (await this.foodRepository.findOneBy({ food_name }))
      throw new ConflictException(
        customMessage(HttpStatus.CONFLICT, 'food name already present'),
      );
    await this.foodRepository.save(createFoodDto);
    return customMessage(HttpStatus.CREATED, 'food name added');
  }

  async findAll() {
    return customMessage(
      HttpStatus.OK,
      'all food names list',
      await this.foodRepository.find(),
    );
  }

  async findOne(id: number) {
    return customMessage(
      HttpStatus.OK,
      'food name by id',
      await this.getData(id),
    );
  }

  async update(id: number, updateFoodDto: UpdateFoodDto) {
    await this.getData(id);
    const food_name = updateFoodDto.food_name;
    if (await this.foodRepository.findOneBy({ food_name }))
      throw new ConflictException(
        customMessage(HttpStatus.CONFLICT, 'food name already present'),
      );
    await this.foodRepository.update(id, updateFoodDto);
    // return { message: ' food name updated successfully ' };
    return customMessage(HttpStatus.OK, 'food name updated successfully');
  }

  async remove(id: number) {
    await this.getData(id);
    await this.foodRepository.delete(id);
    // return { message: ' food name removed successfully ' };
    return customMessage(HttpStatus.OK, 'food name removed successfully');
  }

  async getData(id: number) {
    const data = await this.foodRepository.findOneBy({ id });
    if (!data)
      throw new NotFoundException(
        customMessage(HttpStatus.NOT_FOUND, "food data doesn't exist"),
      );
    return data;
  }
}
