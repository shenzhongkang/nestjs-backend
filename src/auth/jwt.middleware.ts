import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (user) {
        req.user = user;
      }
      return next();
    })(req, res, next);
  }
}