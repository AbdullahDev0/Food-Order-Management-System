import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'src/shared/strategies/local.strategy';
import { JwtStrategy } from 'src/shared/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Auth } from './entities/auth.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Auth]),
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'emails_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([Users]),
    PassportModule,
    JwtModule.register({
      secret: 'TestingSecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
