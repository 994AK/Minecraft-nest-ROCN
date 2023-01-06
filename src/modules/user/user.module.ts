import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../typeorm/users/user/user.entity';
import { Authenticate } from '../../typeorm/users/auth/authenticate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Authenticate])],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
