import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Users } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

class UserRepositoryMock {
  findOneOrFail = jest.fn(() => {
    return Users;
  });
}

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Users),
          useClass: UserRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
