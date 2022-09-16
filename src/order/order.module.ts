import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Orders } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/user/entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Comments } from './entities/comment.entity';

@Module({
  imports: [
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
    TypeOrmModule.forFeature([Orders]),
    TypeOrmModule.forFeature([Comments]),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
