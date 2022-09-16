import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
