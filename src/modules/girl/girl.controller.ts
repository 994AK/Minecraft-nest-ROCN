import { Controller, Get, Post, Query, Body, Param } from '@nestjs/common';
import { GirlService } from './girl.service';

@Controller('girl')
export class GirlController {
  constructor(private girlService: GirlService) {}

  // 普通Get方法
  @Get()
  getGirl(): any {
    return this.girlService.getGirls();
  }

  // Post传参数
  @Post('addGirl')
  postAddGirl(@Body() body): any {
    return this.girlService.addGirl(body);
  }

  // Get传参数
  @Get('getGirlById')
  getGirlById(@Query() query): any {
    const id = Number(query.id);
    return this.girlService.getGirlById(id);
  }

  // 动态路由
  @Get('findGirlById/:id/:name')
  findGirlById(@Param() param) {
    return this.girlService.findGirlById(param);
  }
}
