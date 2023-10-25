import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const cors = require("cors");
  // app.use(cors());//adicionado
  // await app.listen(3000);//adicionado
  // app.enableShutdownHooks();
  app.enableCors({
//    origin: process.env.HOST_FRONT,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );


  // app.setGlobalPrefix('api');
  app.use(cookieParser());
  await app.listen(3000);//adicionado
  app.enableShutdownHooks();
}
bootstrap();
