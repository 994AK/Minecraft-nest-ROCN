import { Injectable } from '@nestjs/common';
import { queryFull } from 'minecraft-server-util';
import { PrismaService } from '../../prisma.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../typeorm/users/user/user.entity';
import { DailyCheckInsEntity } from '../../typeorm/users/sign/daily_check_ins.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MinecraftService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(DailyCheckInsEntity)
    private dailyEntityRepository: Repository<DailyCheckInsEntity>,
  ) {}
  async getMinecraftState() {
    const options = {
      sessionID: 1, // a random 32-bit signed number, optional
      enableSRV: true, // SRV record lookup
    };

    try {
      const { version, software, players } = await queryFull(
        '66aserver.zhongbai233.top',
        25565,
        options,
      );
      if (version) {
        return {
          code: '1',
          data: {
            version,
            players,
            software,
          },
          msg: '获取服务器请求成功',
        };
      }
    } catch (e) {
      return {
        code: '2',
        data: null,
        msg: '获取失败了',
      };
    }
  }

  async getMinecraftSign({ userId, notes }: { userId: number; notes: string }) {
    //查询到用户
    const user = await this.usersRepository.findOneBy({ id: userId });

    //查询到用户进行签到处理
    if (user) {
      const userSign = await this.dailyEntityRepository.findOne({
        where: { user: user },
        relations: {
          user: true,
        },
      });

      const daily = new DailyCheckInsEntity();

      //首次签到 - 没有记录的
      if (!userSign) {
        daily.numSign = 1;
        daily.notes = notes;
        daily.user = user;
        await this.dailyEntityRepository.save(daily);
        return { data: user, msg: '签到成功' };
      }

      //有签到信息
      if (userSign) {
        //处理是否符合今天的日期
        const date = (date) => {
          //签到日期
          const yesterday = new Date(Date.parse(date));
          //今天
          const today = new Date(Date.now());

          return Number(today.getDate()) > Number(yesterday.getDate());
        };

        // 判断今天是否签到了
        if (!date(userSign.updatedDate)) return { msg: '今天你已经签到了' };

        userSign.numSign = userSign.numSign + 1;
        userSign.notes = notes;

        //更新数据
        const updateSign = await this.dailyEntityRepository.save(userSign);

        return {
          data: updateSign,
          msg: '你已经签到了' + updateSign.numSign + '天',
        };
      }
    }

    return { msg: '没有找到该用户' };
  }
}
