import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Foods } from './entities/food.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Foods])],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule {}
