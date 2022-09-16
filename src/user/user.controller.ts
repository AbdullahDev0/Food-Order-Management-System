import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(ValidationPipe)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('deleted')
  listDeleted() {
    return this.userService.listDeleted();
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('deleted/:id')
  restore(@Param('id') id: string) {
    return this.userService.restore(+id);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('active/:id')
  active(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.active(+id, updateUserDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('admin/:id')
  admin(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.admin(+id, updateUserDto);
  }
}
