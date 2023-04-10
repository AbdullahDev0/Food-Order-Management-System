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
  UseFilters,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '../shared/enums/role.enum';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { CreateBulkOrderDto } from './dto/create-bulk-order.dto';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';

// @Roles(Role.Admin)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(Role.Admin, Role.User)
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(ValidationPipe)
@UseFilters(HttpExceptionFilter)
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
