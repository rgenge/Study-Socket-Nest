import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    ChatModule,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '../../../..', 'client/dist'),
  }),
  UserModule,
  AuthModule,
],
//controllers: [AuthController],
//providers: [ AuthService, PrismaService, JwtService, ],


})
export class AppModule {}
