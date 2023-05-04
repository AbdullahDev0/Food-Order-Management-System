import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

class AuthRepositoryMock {
  findOneOrFail = jest.fn(() => {
    return Auth;
  });
}

class UserRepositoryMock {
  findOneOrFail = jest.fn(() => {
    return Users;
  });
}

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(Auth),
          useClass: AuthRepositoryMock,
        },
        {
          provide: getRepositoryToken(Users),
          useClass: UserRepositoryMock,
        },
        {
          provide: 'EMAIL_SERVICE',
          useValue: 'Default',
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
