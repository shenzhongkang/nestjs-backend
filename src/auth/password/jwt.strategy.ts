import { Injectable, Inject } from '@nestjs/common';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { CONFIG_TOKEN } from 'src/config/constants';
import { AppProperties } from 'src/config/app-properties.model';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends Strategy {
  constructor(
    private readonly authService: AuthService,
    @Inject(CONFIG_TOKEN) config: AppProperties
  ) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
        secretOrKey: config.token.secret
      },
      async (req: Request, payload: any, next: VerifiedCallback) => await this.verify(req, payload, next)
    );
  }

  async verify(req: Request, payload: any, done: VerifiedCallback): Promise<void> {
    const isValid = await this.authService.validateUser(payload);
    if (!isValid) {
      return done('Unauthorized', false);
    }
    done(null, payload);
  }
}