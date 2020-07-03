import { Module } from '@nestjs/common';
import { PasswordValidatorImpl } from './password-validator.component';

@Module({
  imports: [PasswordValidatorImpl],
  exports: [PasswordValidatorImpl]
})
export class PasswordValidatorModule {}