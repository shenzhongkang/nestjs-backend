import { Controller, UseInterceptors, Inject, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/common/interceptors/loggin.interceptor';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { apiPath } from 'src/api';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from './constants';
import { PasswordCryptographerService } from './password-cryptographer/password-cryptographer.interface';
import { EmailValidatorImpl } from 'src/validation/email/email-validator.component';
import { PasswordValidatorImpl } from 'src/validation/password/password-validator.component';
import { LoginDto } from 'src/shared';
import { classToPlain } from 'class-transformer';

@ApiTags('Auth')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'auth'))
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @Inject(PASSWORD_CRYPTOGRAPHER_TOKEN) private readonly passwordCryptographerService: PasswordCryptographerService,
    private readonly emailValidator: EmailValidatorImpl,
    private readonly passwordValidator: PasswordValidatorImpl
  ) {}

  @ApiOperation({ summary: 'Authorize' })
  @ApiResponse({
    status: 200,
    description: 'Credentials are ok, returning JWT'
  })
  @ApiResponse({ status: 400, description: 'The email or password is incorrect!' })
  @Post()
  async login(@Body() req: LoginDto) {
    const emailValidation = await this.emailValidator.validateEmail(req.email);
    if (!emailValidation.isValid) {
      throw new BadRequestException('Invalid email!');
    }
    const passwordValidation = await this.passwordValidator.validatePassword(req.password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException('Invalid password!');
    }
    const user = await this.userService.findOneByEmail(req.email);
    if (!user || !await this.passwordCryptographerService.doCompare(req.password, user.password.hash)) {
      throw new BadRequestException('Incorrect email or password!');
    }
    const token = this.authService.createToken(classToPlain(user));
    return {
      user,
      token
    };
  }
}