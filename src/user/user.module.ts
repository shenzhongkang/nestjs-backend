import { Module } from '@nestjs/common';
import { userProviders } from './user.providers';
import { PasswordValidatorModule } from 'src/validation/password/password-validator.module';
import { EmailValidatorModule } from 'src/validation/email/email-validator.module';
import { DatabaseModule } from 'src/database/database.module';
import { LoggerModule } from 'src/logger/logger.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from 'src/auth/constants';
import { PasswordCryptographerServiceImpl } from 'src/auth/password-cryptographer/password-cryptographer';

@Module({
  controllers: [UserController],
  imports: [PasswordValidatorModule, EmailValidatorModule, DatabaseModule, LoggerModule],
  providers: [
    ...userProviders,
    {
      provide: PASSWORD_CRYPTOGRAPHER_TOKEN,
      useClass: PasswordCryptographerServiceImpl
    },
    UserService
  ],
  exports: [UserService]
})
export class UserModule {}