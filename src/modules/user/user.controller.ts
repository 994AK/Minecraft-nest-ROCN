import { Controller, Get, Req, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { QueryUserDto } from './dto/query-user.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //查询用户信息
  @Get('findUserById')
  //jwt鉴权
  @UseGuards(JwtGuard)
  async findUserById(@Req() req, @Query() query: QueryUserDto) {
    console.log(req.user);
    return this.userService.findUserById(query);
  }
}
