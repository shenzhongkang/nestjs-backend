import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { WelcomeModule } from './welcome/welcome.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { JwtMiddleware } from './auth/jwt.middleware';
import { JwtStrategy } from './auth/password/jwt.strategy';

@Module({
  imports: [
    UserModule,
    AuthModule,
    WelcomeModule,
    ConfigModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
