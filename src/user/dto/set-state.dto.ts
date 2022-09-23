import { IsEmail, IsNotEmpty } from 'class-validator';

export class SetStateDTO {
  @IsNotEmpty()
  active: boolean;

}
