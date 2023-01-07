import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { QueryUserDto } from './dto/query-user.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //查询用户信息
  @Get('findUserById')
  async findUserById(@Query() query: QueryUserDto) {
    return this.userService.findUserById(query);
  }
}
