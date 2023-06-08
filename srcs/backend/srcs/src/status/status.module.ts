import { Module } from '@nestjs/common';
import { StatusGateway } from './status.gateway';
import { StatusService } from './status.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [UsersModule],
    providers: [StatusGateway, StatusService]
})
export class StatusModule {}