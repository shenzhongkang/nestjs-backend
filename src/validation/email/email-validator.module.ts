import { Module } from '@nestjs/common';
import { EmailValidatorImpl } from './email-validator.component';

@Module({
  providers: [EmailValidatorImpl],
  exports: [EmailValidatorImpl]
})
export class EmailValidatorModule {}