import { Module } from '@nestjs/common';
import { Log } from './logger.component';

@Module({
  imports: [Log],
  exports: [Log]
})
export class LoggerModule {}