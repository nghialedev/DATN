import { Module } from '@nestjs/common';
import { UserAttachService } from './user-attach.service';
import { UserAttachController } from './user-attach.controller';

@Module({
  controllers: [UserAttachController],
  providers: [UserAttachService],
})
export class UserAttachModule {}
