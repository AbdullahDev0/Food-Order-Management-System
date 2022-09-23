import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { CreateBulkOrderDto } from './dto/create-bulk-order.dto';

// @Roles(Role.Admin)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.Admin, Role.User)
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(ValidationPipe)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() request) {
    return this.orderService.create(createOrderDto, request);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('/bulk')
  bulkOrderGet() {
    return this.orderService.bulkGet();
  }

  @Get('/user')
  bulkOrderIdGet(@Req() request) {
    return this.orderService.bulkGetID(request);
  }

  @Post('/bulk')
  bulkOrder(@Body() createBulkOrderDto: CreateBulkOrderDto, @Req() request) {
    return this.orderService.bulk(createBulkOrderDto, request);
  }

  @Delete('/bulk')
  bolkOrderDelete(@Req() request) {
    return this.orderService.bulkDelete(request);
  }

  @Put('/bulk')
  bolkOrderUpdate(
    @Body() createBulkOrderDto: CreateBulkOrderDto,
    @Req() request,
  ) {
    return this.orderService.bulkUpdate(createBulkOrderDto, request);
  }

  @Get('/mail-print')
  sendMailPDF() {
    return this.orderService.sendMailPDF();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Delete()
  remove(@Req() request) {
    return this.orderService.remove(request);
  }
}
