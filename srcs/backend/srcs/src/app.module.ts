import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatModule } from './chat/chat.module';

@Module({
  
  imports: [ ConfigModule.forRoot({
    isGlobal: true
  }), 
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
  }),
  PrismaModule, AuthModule, UsersModule, ChatModule],

  controllers: [AppController],
  providers: [],

})
export class AppModule {}