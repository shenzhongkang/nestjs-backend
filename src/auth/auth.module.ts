import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { UserModule } from 'src/user/user.module';
import { EmailValidatorModule } from 'src/validation/email/email-validator.module';
import { PasswordValidatorModule } from 'src/validation/password/password-validator.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { authProviders } from './auth.providers';
import { AuthGuard } from './auth.guard';
import { JwtStrategy } from './password/jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [ConfigModule, UserModule, EmailValidatorModule, PasswordValidatorModule],
  providers: [AuthService, ...authProviders, AuthGuard, JwtStrategy],
  exports: [AuthService, AuthGuard]
})
export class AuthModule {}