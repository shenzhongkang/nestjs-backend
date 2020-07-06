import { Module } from '@nestjs/common';
import { Log } from './logger.component';

@Module({
  providers: [Log],
  exports: [Log]
})
export class LoggerModule {}