import { Module } from '@nestjs/common';
import { EmailValidatorImpl } from './email-validator.component';

@Module({
  imports: [EmailValidatorImpl],
  exports: [EmailValidatorImpl]
})
export class EmailValidatorModule {}