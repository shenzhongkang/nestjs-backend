import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { apiPath } from 'src/api';

@ApiTags('Welcome')
@Controller(apiPath(1, 'welcome'))
export class WelcomeController {
  @Get()
  welcome(): string {
    return 'hello';
  }
}