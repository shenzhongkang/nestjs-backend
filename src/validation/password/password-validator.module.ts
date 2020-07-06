import { Module } from '@nestjs/common';
import { PasswordValidatorImpl } from './password-validator.component';

@Module({
  providers: [PasswordValidatorImpl],
  exports: [PasswordValidatorImpl]
})
export class PasswordValidatorModule {}