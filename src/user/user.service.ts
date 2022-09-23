import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { encodePassword } from 'src/shared/utils/bcrypt';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SetRoleDTO } from './dto/set-role.dto';
import { SetStateDTO } from './dto/set-state.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { SerializedUser } from './types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const email = createUserDto.email;
    if (await this.userRepository.findOneBy({ email }))
      throw new ConflictException('email already registered');
    if (
      await this.userRepository.findOne({
        withDeleted: true,
        where: { email: email },
      })
    )
      throw new ConflictException('user blocked or deleted account');
    const password = encodePassword(createUserDto.password);
    const active = false;
    const newUser = this.userRepository.create({
      ...createUserDto,
      password,
      active,
    });
    await this.userRepository.save(newUser);
    // return new SerializedUser(await this.userRepository.save(newUser));
    return {
      statuscode: 201,
      message: 'user created successfully',
      data: {},
    };
  }

  async findAll() {
    const users = await this.userRepository.find();
    // return users.map((user) => new SerializedUser(user));
    return {
      statuscode: 200,
      message: 'all users list',
      data: users.map((user) => new SerializedUser(user)),
    };
  }

  async findOne(id: number) {
    // return new SerializedUser(await this.getUserbyId(id));
    return {
      statuscode: 200,
      message: 'user by id',
      data: new SerializedUser(await this.getUserbyId(id)),
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.getUserbyId(id);
    await this.userRepository.update(id, updateUserDto);
    // return { message: 'user information updated successfully' };
    return {
      statuscode: 200,
      message: 'user information updated successfully',
      data: {},
    };
  }

  async remove(id: number) {
    await this.getUserbyId(id);
    await this.userRepository.softDelete(id);
    // return { message: 'user deleted successfully' };
    return {
      statuscode: 200,
      message: 'user deleted successfully',
      data: {},
    };
  }

  async active(id: number, setStatDTO: SetStateDTO) {
    const user = await this.getUserbyId(id);
    if (setStatDTO.active === user.active)
      throw new ConflictException('defined state already set');
    await this.userRepository.update(id, setStatDTO);
    return {
      statuscode: 200,
      message: 'user state set successfully',
      data: {},
    };
  }

  async admin(id: number, setRoleDTO: SetRoleDTO) {
    const user = await this.getUserbyId(id);
    if (setRoleDTO.role === user.role)
      throw new ConflictException('role is already set to ' + user.role);
    await this.userRepository.update(id, setRoleDTO);
    return {
      statuscode: 200,
      message: 'user role set successfully',
      data: {},
    };
  }

  async listDeleted() {
    const users = await this.userRepository.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
    });
    // return users.map((user) => new SerializedUser(user));
    return {
      statuscode: 200,
      message: 'deleted users list',
      data: users.map((user) => new SerializedUser(user)),
    };
  }

  async restore(id: number) {
    if (
      (
        await this.userRepository.find({
          withDeleted: true,
          where: { id: id, deletedAt: Not(IsNull()) },
        })
      ).length == 0
    )
      throw new NotFoundException('user not found in deleted');
    this.userRepository.restore(id);
    // return { message: 'user restored successfully' };
    return {
      statuscode: 200,
      message: 'user restored successfully',
      data: {},
    };
  }

  async getUserbyId(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException("user doesn't exist");
    return user;
  }
}
