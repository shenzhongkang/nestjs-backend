import { Provider } from '@nestjs/common';
import { createConnection } from 'typeorm';
import { DB_CONNECTION_TOKEN } from './constants';
import { CONFIG_TOKEN } from 'src/config/constants';
import { AppProperties } from 'src/config/app-properties.model';

export const databaseProviders: Provider[] = [
  {
    provide: DB_CONNECTION_TOKEN,
    inject: [CONFIG_TOKEN],
    useFactory: async ({ db }: AppProperties) => {
      return await createConnection({
        type: 'mysql',
        host: db.host,
        port: db.port,
        username: db.dbuser,
        password: db.dbpassword,
        database: db.dbname,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        logger: 'advanced-console'
      });
    }
  }
];