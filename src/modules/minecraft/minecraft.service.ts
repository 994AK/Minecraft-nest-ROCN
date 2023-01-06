import { Injectable } from '@nestjs/common';
import { queryFull } from 'minecraft-server-util';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class MinecraftService {
  constructor(private readonly prisma: PrismaService) {}
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

  async getMinecraftSign(body) {
    //查询签到用户
    const findList = await this.prisma.userSign.findMany({
      where: {
        //必须是存在的用户
        userId: body.userId,
      },
    });

    // 签到数据已存在
    if (findList.length > 0) {
      const date = (date) => {
        //签到日期
        const yesterday = new Date(Date.parse(date));
        //今天
        const today = new Date(Date.now());

        return Number(today.getDate()) > Number(yesterday.getDate());
      };

      // 该用户的签到日志
      const singLogList = await this.prisma.userSignLog.findMany({
        where: {
          userID: findList[0].userId,
        },
      });

      //更新签到次数
      await this.prisma.userSign.update({
        where: {
          userId: findList[0].userId,
        },
        data: {
          seriesDays: singLogList.length,
        },
      });

      // 已经签到过的用户 true > 没签到
      if (date(singLogList[singLogList.length - 1].signTime)) {
        const signLogin = await this.prisma.userSignLog.create({
          data: {
            signReward: body.signReward,
            userID: body.userId,
          },
        });

        return {
          code: 1,
          msg: '签到成功',
          data: signLogin,
        };
      } else {
        return {
          code: 2,
          msg: '你今天签到了',
          data: null,
        };
      }
    }

    //首次签到
    try {
      const sing = await this.prisma.userSign.create({
        data: {
          userId: body.userId,
          //默认连续签到1次
          seriesDays: 1,
          //是否签到了
          showSign: true,
          UserSignLog: {
            create: [
              {
                signReward: body.signReward,
                userID: body.userId,
              },
            ],
          },
          SignConfig: {
            create: [
              {
                userId: body.userId,
                mark: '抽奖箱1',
              },
            ],
          },
        },
        include: {
          User: true,
        },
      });
      return {
        code: 1,
        msg: '首次签到成功',
        data: sing,
      };
    } catch (e) {
      return {
        code: 2,
        msg: '没有该用户',
        data: null,
      };
    }
  }
}
