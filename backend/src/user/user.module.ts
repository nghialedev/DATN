import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Expose } from 'src/classes';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, Expose],
})
export class UserModule {}