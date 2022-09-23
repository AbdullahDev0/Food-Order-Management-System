import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Req,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/user/entities/user.entity';
import { Between, Repository } from 'typeorm';
import { CreateBulkOrderDto } from './dto/create-bulk-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Comments } from './entities/comment.entity';
import { Orders } from './entities/order.entity';
import { SerializedOrder } from './types';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Orders)
    private readonly orderRepository: Repository<Orders>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    @Inject('EMAIL_SERVICE') private client: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto, @Req() request) {
    const food_name = createOrderDto.food_name;
    const userId = await this.getUserID(request);
    createOrderDto['user'] = userId;
    if (await this.orderRepository.findOneBy({ food_name }))
      throw new ConflictException('order already created');
    await this.orderRepository.save(createOrderDto);
    return {
      statuscode: 201,
      message: 'order created successfully',
      data: {},
    };
  }

  async findAll() {
    const orders = await this.orderRepository.find();
    // return orders.map((order) => new SerializedOrder(order));
    return {
      statuscode: 200,
      message: 'all orders list',
      data: orders.map((order) => new SerializedOrder(order)),
    };
  }

  async findOne(id: number) {
    // return await this.findOrder(id);
    return {
      statuscode: 200,
      message: 'order by id',
      data: await this.findOrder(id),
    };
  }

  async remove(@Req() request) {
    const { morning, evening } = this.getDateRange();
    const { userId, order } = await this.checkOrder(request);
    if (!order.length) throw new NotFoundException('order is not placed');
    await this.orderRepository.delete({
      user: { id: userId },
      created_at: Between(morning, evening),
    });
    return {
      statuscode: 200,
      message: 'order deleted successfully',
      data: {},
    };
  }

  async bulk(createBulkOrderDto: CreateBulkOrderDto, @Req() request) {
    const { userId, order } = await this.checkOrder(request);
    if (order.length) throw new ConflictException('order is already placed');
    createBulkOrderDto.orders.map((order) => (order['user'] = userId));
    const orders = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(Orders)
      .values(createBulkOrderDto['orders'])
      .execute();
    if (!orders) throw new BadRequestException();
    if (createBulkOrderDto.comments) {
      createBulkOrderDto.comments.map((comment) => (comment['user'] = userId));
      if (
        !(await this.commentRepository.save(
          this.commentRepository.create(createBulkOrderDto.comments[0]),
        ))
      )
        throw new BadRequestException();
    }
    return {
      statuscode: 201,
      message: 'order created successfully',
      data: {},
    };
  }

  async bulkDelete(@Req() request) {
    const { morning, evening } = this.getDateRange();
    const { userId, order } = await this.checkOrder(request);
    if (!order.length) throw new NotFoundException('order is not placed');
    await this.orderRepository.delete({
      user: { id: userId },
      created_at: Between(morning, evening),
    });
    await this.commentRepository.delete({
      user: { id: userId },
      created_at: Between(morning, evening),
    });
    return {
      statuscode: 200,
      message: 'order deleted successfully',
      data: {},
    };
  }

  async bulkUpdate(createBulkOrderDto: CreateBulkOrderDto, @Req() request) {
    //Removing old data first
    const { morning, evening } = this.getDateRange();
    const { userId, order } = await this.checkOrder(request);
    if (!order.length) throw new NotFoundException('item not found in order');
    await this.orderRepository.delete({
      user: { id: userId },
      created_at: Between(morning, evening),
    });
    await this.commentRepository.delete({
      user: { id: userId },
      created_at: Between(morning, evening),
    });
    await this.bulk(createBulkOrderDto, request);
    return {
      statuscode: 200,
      message: 'order updated successfully',
      data: {},
    };
  }

  async bulkGet() {
    const { morning, evening } = this.getDateRange();
    return await this.orderRepository.find({
      where: { created_at: Between(morning, evening) },
    });
  }

  async bulkGetID(@Req() request) {
    const { morning, evening } = this.getDateRange();
    const email = request.user.email;
    const userId = await (await this.userRepository.findOneBy({ email })).id;
    return {
      statuscode: 200,
      message: 'order by user',
      data: {
        orders: await this.orderRepository.find({
          where: {
            user: { id: userId },
            created_at: Between(morning, evening),
          },
        }),
        comments: await this.commentRepository.find({
          where: {
            user: { id: userId },
            created_at: Between(morning, evening),
          },
        }),
      },
    };
    // return {
    //   orders: await this.orderRepository.find({
    //     where: { user: { id: userId }, created_at: Between(morning, evening) },
    //   }),
    //   comments: await this.commentRepository.find({
    //     where: { user: { id: userId }, created_at: Between(morning, evening) },
    //   }),
    // };
  }

  //Helper functions
  async sendMailPDF() {
    this.client.emit('generate-email-pdf', {
      user_mail: 'user_mail',
      link: 'link',
    });
    // return {
    //   message: "today's order sent for printing",
    // };
    return {
      statuscode: 200,
      message: "today's order sent for printing",
      data: {},
    };
  }

  getDateRange() {
    const date_ob = new Date();
    date_ob.setHours(0, 0, 0, 0);
    const date = date_ob.getDate();
    const month = date_ob.getMonth();
    const year = date_ob.getFullYear();
    const hours = '0';
    const morning = new Date(year, month, date, +hours);
    const evening = new Date(year, month, date + 1, +hours);
    return { morning, evening };
  }

  async findOrder(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException('item not found in order');
    return order;
  }

  async getUserID(request) {
    const email = request.user.email;
    return (await this.userRepository.findOneBy({ email })).id;
  }

  async checkOrder(request) {
    const { morning, evening } = this.getDateRange();
    const email = request.user.email;
    const userId = (await this.userRepository.findOneBy({ email })).id;
    const order = await this.orderRepository.find({
      where: { user: { id: userId }, created_at: Between(morning, evening) },
    });
    return { userId, order };
  }
}
