import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';
import { QueryUserDto } from "./dto/query-user.dto";
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signupUser(@Body() userData: CreateUserDto) {
    return this.userService.createUser(userData);
  }

  @Post('login')
  async loginUser(@Body() userData: LoginUserDto) {
    return this.userService.loginUser(userData);
  }

  //查询用户信息
  @Get('findUserById')
  async findUserById(@Query() query: QueryUserDto) {
    return this.userService.findUserById(query);
  }
}
