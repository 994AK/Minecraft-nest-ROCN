import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { User, DailyCheckInsEntity } from './typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { raw } from 'express';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(DailyCheckInsEntity)
    private dailyEntityRepository: Repository<DailyCheckInsEntity>,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron('0 30 23-0 * * 0-6')
  async handleCron() {
    const date = (date) => {
      //签到日期
      const yesterday = new Date(Date.parse(date));
      //今天
      const today = new Date(Date.now());

      return Number(today.getDate()) > Number(yesterday.getDate());
    };

    const signUser = await this.dailyEntityRepository.find();
    signUser.length &&
      signUser.map(async (item) => {
        // 检测他今天签到了吗
        if (date(item.updatedDate)) {
          //没有签到
          const signShow = await this.dailyEntityRepository.findOne({
            where: { id: item.id },
          });
          signShow.signShow = false;
          // 签到状态超过一天就变成未签到状态
          console.log(await this.dailyEntityRepository.save(signShow));;
        }
      });
  }

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  // }
  //
  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.debug('Called once after 5 seconds');
  // }
}
