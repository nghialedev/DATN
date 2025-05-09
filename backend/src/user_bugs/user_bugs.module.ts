import { Module } from '@nestjs/common';
import { UserBugsService } from './user_bugs.service';
import { UserBugsController } from './user_bugs.controller';

@Module({
  controllers: [UserBugsController],
  providers: [UserBugsService],
})
export class UserBugsModule {}
