import { Injectable } from '@nestjs/common';
import { EmailValidator } from 'src/shared';

@Injectable()
export class EmailValidatorImpl extends EmailValidator {
  constructor() {
    super();
  }
}