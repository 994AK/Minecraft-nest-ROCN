import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../typeorm/users/user/user.entity';
import { Authenticate } from '../../typeorm/users/auth/authenticate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Authenticate])],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
