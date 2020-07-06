import { Provider } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from './constants';
import { Connection } from 'typeorm';
import { User } from './user.entity';
import { DB_CONNECTION_TOKEN } from 'src/database/constants';

export const userProviders: Provider[] = [
  {
    provide: USER_REPOSITORY_TOKEN,
    useFactory: (connection: Connection) => {
      return connection.getRepository(User);
    },
    inject: [DB_CONNECTION_TOKEN]
  }
];