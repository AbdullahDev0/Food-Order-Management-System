import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Orders } from './entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../user/entities/user.entity';
import { Comments } from './entities/comment.entity';
class OrderRepositoryMock {
  findOneOrFail = jest.fn(() => {
    return Orders;
  });
}

class UserRepositoryMock {
  findOneOrFail = jest.fn(() => {
    return Users;
  });
}

class CommentRepositoryMock {
  findOneOrFail = jest.fn(() => {
    return Comments;
  });
}

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Orders),
          useClass: OrderRepositoryMock,
        },
        {
          provide: getRepositoryToken(Users),
          useClass: UserRepositoryMock,
        },
        {
          provide: getRepositoryToken(Comments),
          useClass: CommentRepositoryMock,
        },
        {
          provide: 'EMAIL_SERVICE',
          useValue: 'Default',
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
