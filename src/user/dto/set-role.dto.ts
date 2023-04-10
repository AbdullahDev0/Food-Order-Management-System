import { IsNotEmpty } from 'class-validator';
import { Role } from '../../shared/enums/role.enum';

export class SetRoleDTO {
  @IsNotEmpty()
  role: Role;
}
