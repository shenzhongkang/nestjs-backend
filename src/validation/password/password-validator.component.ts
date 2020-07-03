import { Injectable } from '@nestjs/common';
import { PasswordValidator } from 'src/shared';

@Injectable()
export class PasswordValidatorImpl extends PasswordValidator {
  constructor() {
    super();
  }
}