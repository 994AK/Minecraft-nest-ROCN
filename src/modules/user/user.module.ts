import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../typeorm/users/user/user.entity';
import { Authenticate } from '../../typeorm/users/authenticate/authenticate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Authenticate])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
