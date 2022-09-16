import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Users } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { comparePasswords, encodePassword } from 'src/shared/utils/bcrypt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    @Inject('EMAIL_SERVICE') private client: ClientProxy,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) return null;
    if (!user.active) throw new ForbiddenException('User is not authorized');
    if (!comparePasswords(pass, user.password)) return null;
    const { password, ...result } = user;
    return result;
  }

  async login(loginAuthdto: LoginAuthDto) {
    const email = loginAuthdto.email;
    const user = await this.userRepository.findOneBy({ email });
    const payload = { email: user.email, roles: user.role };
    return {
      statuscode: 200,
      message: 'token created successfully',
      data: {
        name: user.name,
        token: this.jwtService.sign(payload),
      },
    };
  }

  async verify(access_token: string) {
    return this.authRepository.find({ where: { blocked_token: access_token } });
  }

  async logout(token: string) {
    if (await this.authRepository.findOneBy({ blocked_token: token }))
      throw new ForbiddenException('user is not authorized');
    await this.blockToken(token);
    return {
      statuscode: 200,
      message: 'user logged out successfully',
      data: {},
    };
  }

  async resetPassordEmail(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException("user doesn't exist");
    const user_mail = user.email;
    const payload = { id: id };
    const token = this.jwtService.sign(payload, {
      secret: process.env.RESET_SECRET,
    });
    const link = `${process.env.BASE_URL}/auth/reset-password/${id}/${token}`;
    this.client.emit('password-reset-email', {
      user_mail: user_mail,
      link: link,
    });
    // if (!(await email(user_mail, 'Reset Password', link)))
    //   throw new ServiceUnavailableException();
    // return { message: 'you will shortly receive reset email link' };
    return {
      statuscode: 200,
      message: 'you will shortly receive reset email link',
      data: {},
    };
  }

  async resetPassord(
    id: number,
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ) {
    try {
      this.jwtService.verify(token, {
        secret: process.env.RESET_SECRET,
      });
    } catch (err) {
      console.log(err);
      throw new ForbiddenException('expired or invalid token');
    }
    if ((await this.verify(token)).length)
      throw new ForbiddenException('expired or invalid token');
    await this.blockToken(token);
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException("user doesn't exist");
    if (resetPasswordDto.password !== resetPasswordDto.confirm_password)
      throw new ConflictException("passwords don't match");
    const password = encodePassword(resetPasswordDto.password);
    const newUser = this.userRepository.create({
      password,
    });
    if (!(await this.userRepository.update(id, newUser)))
      throw new InternalServerErrorException();
    // return { message: 'password reset successful' };
    return {
      statuscode: 200,
      message: 'password reset successful',
      data: {},
    };
  }

  async blockToken(token) {
    const blocked_token = this.authRepository.create({
      blocked_token: token,
    });
    await this.authRepository.save(blocked_token);
  }

  async removeExpiredTokens() {
    const date_ob = new Date();
    const date = date_ob.getDate();
    const month = date_ob.getMonth();
    const year = date_ob.getFullYear();
    const hours = date_ob.getHours();
    const time = new Date(year, month, date, hours + 4); //Keeping one hour ahead timespan
    await this.authRepository.delete({
      created_at: LessThan(time),
    });
  }
}
