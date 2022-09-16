import { PartialType } from '@nestjs/mapped-types';
import { IsEmail } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Role } from 'src/shared/enums/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  name: string;

  @IsEmail()
  email: string;

  password: string;

  active: boolean;

  role: Role;
}
