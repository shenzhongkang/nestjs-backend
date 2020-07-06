import { createParamDecorator } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { User } from './user.entity';

export const CurrentUser = createParamDecorator((data, req) => {
  return plainToClass(User, req.user);
});