import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  
  imports: [ ConfigModule.forRoot({
    isGlobal: true
  }), PrismaModule, AuthModule, UserModule],

  controllers: [AppController],
  providers: [],

})
export class AppModule {}