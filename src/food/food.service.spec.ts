import { Test, TestingModule } from '@nestjs/testing';
import { FoodService } from './food.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Foods } from './entities/food.entity';

class FoodRepositoryMock {
  findOneOrFail = jest.fn(() => {
    return Foods;
  });
}

describe('FoodService', () => {
  let service: FoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodService,
        {
          provide: getRepositoryToken(Foods),
          useClass: FoodRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<FoodService>(FoodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
