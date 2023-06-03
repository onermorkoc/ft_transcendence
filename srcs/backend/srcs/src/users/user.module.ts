import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';

@Module({
  controllers: [UserController, FriendController],
  providers: [UserService, FriendService],
  exports: [UserService]
})
export class UserModule {}
