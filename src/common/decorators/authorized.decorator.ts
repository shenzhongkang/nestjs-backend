import { UserRole } from 'src/user/user.role';
import { SetMetadata } from '@nestjs/common';

export function Authorized(...roles: UserRole[]);
export function Authorized(roles: UserRole[]);
export function Authorized(...roleOrRoles: Array<UserRole | UserRole[]>) {
  const roles = Array.isArray(roleOrRoles[0] ? (roleOrRoles[0] as UserRole[]) : (roleOrRoles as UserRole[]));
  return SetMetadata('roles', roles);
}