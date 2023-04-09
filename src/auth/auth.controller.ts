import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LocalAuthGuard } from 'src/shared/guards/local-auth.guard';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Cron } from '@nestjs/schedule';

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(ValidationPipe)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async create(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  logout(@Req() request) {
    const token = request.headers['authorization'].split(' ')[1];
    return this.authService.logout(token);
  }

  @Cron('0 1 * * * *')
  removeExpiredTokens() {
    this.authService.removeExpiredTokens();
  }

  @Post('reset-password/:id/:token')
  resetPassord(
    @Param('id') id: string,
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassord(+id, token, resetPasswordDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('reset-password/:id')
  resetPassordEmail(@Param('id') id: string) {
    return this.authService.resetPassordEmail(+id);
  }
}
