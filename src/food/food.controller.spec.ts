import { Test, TestingModule } from '@nestjs/testing';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { Foods } from './entities/food.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

class FoodRepositoryMock {
  findOneOrFail = jest.fn(() => {
    return Foods;
  });
}

describe('FoodController', () => {
  let controller: FoodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodController],
      providers: [
        FoodService,
        {
          provide: getRepositoryToken(Foods),
          useClass: FoodRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<FoodController>(FoodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
