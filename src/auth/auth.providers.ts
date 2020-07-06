import { Provider } from '@nestjs/common';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from './constants';
import { PasswordCryptographerServiceImpl } from './password-cryptographer/password-cryptographer';

export const authProviders: Provider[] = [
  {
    provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
    useClass: PasswordCryptographerServiceImpl
  }
];