import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';

@Module({
  controllers: [UsersController, FriendController],
  providers: [UsersService, FriendService],
  exports: [UsersService]
})
export class UsersModule {}
