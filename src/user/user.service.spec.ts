import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Users } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

class UserRepositoryMock {
  findOneOrFail = jest.fn(() => {
    return Users;
  });
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Users),
          useClass: UserRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
