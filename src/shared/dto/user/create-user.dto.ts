import { IUser } from '../../models/user.model';

export class CreateUserDto {
  readonly user: IUser;

  readonly password: string;
}