import {
  ConflictException,
  HttpStatus,
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
import customMessage from 'src/shared/responses/customMessage.response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const email = createUserDto.email;
    if (await this.userRepository.findOneBy({ email }))
      throw new ConflictException(
        customMessage(HttpStatus.CONFLICT, 'email already registered'),
      );
    if (
      await this.userRepository.findOne({
        withDeleted: true,
        where: { email: email },
      })
    )
      throw new ConflictException(
        customMessage(HttpStatus.CONFLICT, 'user blocked or deleted account'),
      );
    const password = encodePassword(createUserDto.password);
    const active = false;
    const newUser = this.userRepository.create({
      ...createUserDto,
      password,
      active,
    });
    const user = await this.userRepository.save(newUser);
    return customMessage(HttpStatus.CREATED, 'user created successfully', {
      name: user.name,
      email: user.email,
    });
  }

  async findAll() {
    const users = await this.userRepository.find();
    return customMessage(
      HttpStatus.OK,
      'all users list',
      users.map((user) => new SerializedUser(user)),
    );
  }

  async findOne(id: number) {
    return customMessage(
      HttpStatus.OK,
      'user by id',
      new SerializedUser(await this.getUserbyId(id)),
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.getUserbyId(id);
    await this.userRepository.update(id, updateUserDto);
    return customMessage(
      HttpStatus.OK,
      'user information updated successfully',
    );
  }

  async remove(id: number) {
    await this.getUserbyId(id);
    await this.userRepository.softDelete(id);
    return customMessage(HttpStatus.OK, 'user deleted successfully');
  }

  async active(id: number, setStatDTO: SetStateDTO) {
    const user = await this.getUserbyId(id);
    if (setStatDTO.active === user.active)
      throw new ConflictException(
        customMessage(HttpStatus.CONFLICT, 'defined state already set'),
      );
    await this.userRepository.update(id, setStatDTO);
    return customMessage(HttpStatus.OK, 'user state set successfully');
  }

  async admin(id: number, setRoleDTO: SetRoleDTO) {
    const user = await this.getUserbyId(id);
    if (setRoleDTO.role === user.role)
      throw new ConflictException(
        customMessage(
          HttpStatus.CONFLICT,
          'role is already set to ' + user.role,
        ),
      );
    await this.userRepository.update(id, setRoleDTO);
    return customMessage(HttpStatus.OK, 'user role set successfully');
  }

  async listDeleted() {
    const users = await this.userRepository.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
    });
    return customMessage(
      HttpStatus.OK,
      'deleted users list',
      users.map((user) => new SerializedUser(user)),
    );
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
      throw new NotFoundException(
        customMessage(HttpStatus.NOT_FOUND, 'user not found in deleted'),
      );
    this.userRepository.restore(id);
    return customMessage(HttpStatus.OK, 'user restored successfully');
  }

  async getUserbyId(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new NotFoundException(
        customMessage(HttpStatus.NOT_FOUND, "user doesn't exist"),
      );
    return user;
  }
}
