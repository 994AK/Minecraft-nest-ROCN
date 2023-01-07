import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { QueryUserDto } from './dto/query-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //jwt鉴权
  @UseGuards(AuthGuard('jwt'))
  //查询用户信息
  @Get('findUserById')
  async findUserById(@Query() query: QueryUserDto) {
    return this.userService.findUserById(query);
  }
}
