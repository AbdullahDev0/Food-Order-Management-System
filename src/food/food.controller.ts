import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  UsePipes,
  UseFilters,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '../shared/enums/role.enum';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';

@UsePipes(ValidationPipe)
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(HttpExceptionFilter)
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodService.create(createFoodDto);
  }

  // @Roles(Role.User)
  @Get()
  findAll() {
    return this.foodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodService.update(+id, updateFoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodService.remove(+id);
  }
}
