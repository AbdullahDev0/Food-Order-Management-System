import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Foods } from './entities/food.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Foods) private readonly foodRepository: Repository<Foods>,
  ) {}

  async create(createFoodDto: CreateFoodDto) {
    const food_name = createFoodDto.food_name;
    if (await this.foodRepository.findOneBy({ food_name }))
      throw new ConflictException('food name already present');
    await this.foodRepository.save(createFoodDto);
    return {
      statuscode: 201,
      message: 'food name added',
      data: {},
    };
  }

  async findAll() {
    return {
      statuscode: 200,
      message: 'all food names list',
      data: await this.foodRepository.find(),
    };
  }

  async findOne(id: number) {
    return {
      statuscode: 200,
      message: 'food name by id',
      data: await this.getData(id),
    };
  }

  async update(id: number, updateFoodDto: UpdateFoodDto) {
    await this.getData(id);
    const food_name = updateFoodDto.food_name;
    if (await this.foodRepository.findOneBy({ food_name }))
      throw new ConflictException('food name already present');
    await this.foodRepository.update(id, updateFoodDto);
    // return { message: ' food name updated successfully ' };
    return {
      statuscode: 200,
      message: 'food name updated successfully',
      data: {},
    };
  }

  async remove(id: number) {
    await this.getData(id);
    await this.foodRepository.delete(id);
    // return { message: ' food name removed successfully ' };
    return {
      statuscode: 200,
      message: 'food name removed successfully',
      data: {},
    };
  }

  async getData(id: number) {
    const data = await this.foodRepository.findOneBy({ id });
    if (!data) throw new NotFoundException("food data doesn't exist");
    return data;
  }
}
