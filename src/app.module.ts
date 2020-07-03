import { Module } from '@nestjs/common';
import { WelcomeModule } from './welcome/welcome.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    WelcomeModule,
    AuthModule,
    ConfigModule
  ],
})
export class AppModule {}
