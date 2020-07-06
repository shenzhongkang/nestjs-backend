import { Injectable, Inject } from '@nestjs/common';
import { SignOptions, sign } from 'jsonwebtoken';
import { CONFIG_TOKEN } from 'src/config/constants';
import { AppProperties } from 'src/config/app-properties.model';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  private static readonly DEFAULT_SIGN_OPTIONS: SignOptions = {
    algorithm: 'HS256',
    expiresIn: '7d'
  };

  private readonly signOptions: SignOptions;
  private readonly secret: string;

  constructor(@Inject(CONFIG_TOKEN) config: AppProperties) {
    this.secret = config.token.secret;
    this.signOptions = {
      algorithm: config.token.algorithm || AuthService.DEFAULT_SIGN_OPTIONS.algorithm,
      expiresIn: config.token.expiresIn || AuthService.DEFAULT_SIGN_OPTIONS.expiresIn
    }
  }

  createToken(payload): string {
    return sign(payload, this.secret, this.signOptions);
  }

  async validateUser(signedUser: User): Promise<boolean> {
    return true;
  }
}