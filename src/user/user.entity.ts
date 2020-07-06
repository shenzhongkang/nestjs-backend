import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserPassword } from './user-password.entity';
import { UserRole } from './user.role';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ length: 35 })
  @ApiProperty()
  name: string;

  @Column({ length: 50, unique: true })
  @ApiProperty()
  email: string;

  @Column(() => UserPassword)
  password: UserPassword;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Regular })
  role: UserRole;
}