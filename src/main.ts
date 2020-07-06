import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.use(express.json());
  app.useGlobalPipes(new ValidationPipe());

  const authGuard = app.select(AuthModule).get(AuthGuard);
  app.useGlobalGuards(authGuard);

  // config swagger
  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('szk swagger')
    .setDescription('Common description')
    .setVersion('1.0')
    .build();
  
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/swagger', app, swaggerDocument, { swaggerOptions: { docExpansion: 'none' } })

  const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
  await app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
}
bootstrap();
