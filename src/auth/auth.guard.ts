import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get('roles', context.getHandler());
    const user: User = context.switchToHttp().getRequest().user;
    if (!roles) {
      return true;
    }

    if (!user) {
      return false;
    }

    if (roles.length === 0) {
      return true;
    }

    if (roles.indexOf(user.role) !== -1) {
      return true;
    }

    return false;
  }
}