import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../user/entities/user.entity';

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

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
