import { Injectable } from '@nestjs/common';
import { queryFull } from 'minecraft-server-util';
import { InjectRepository } from '@nestjs/typeorm';
import {
  User,
  DailyCheckInsEntity,
  SignDailyLog,
  SignDailyConfig,
} from './typeorm';
import { Repository } from 'typeorm';
import { SignMinecraftDto, SignConfigMinecraftDto } from './dto/sign-minecraft.dto';

@Injectable()
export class MinecraftService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(DailyCheckInsEntity)
    private dailyEntityRepository: Repository<DailyCheckInsEntity>,

    @InjectRepository(SignDailyLog)
    private signDailyLog: Repository<SignDailyLog>,

    @InjectRepository(SignDailyConfig)
    private signDailyConfig: Repository<SignDailyConfig>,
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

  // 签到
  async getMinecraftSign({
    userId,
    notes,
    signEquipment,
    signIp,
  }: SignMinecraftDto) {
    //时间处理方法
    function date(date) {
      //签到日期
      const yesterday = new Date(Date.parse(date));
      //今天
      const today = new Date(Date.now());

      return Number(today.getDate()) > Number(yesterday.getDate());
    }

    //签到送的积分数量
    const signIntegral = 100;

    //查询到用户
    const user = await this.usersRepository.findOneBy({ id: userId });

    //查询不到用户
    if (!user) return { msg: '没有找到该用户' };

    //表
    const daily = new DailyCheckInsEntity();
    const signLog = new SignDailyLog();

    signLog.user = user;
    signLog.notes = notes;
    signLog.signIntegral = signIntegral;
    signLog.signEquipment = signEquipment;
    signLog.signIp = signIp;

    //查询到用户进行签到处理
    const userSign = await this.dailyEntityRepository.findOne({
      where: { user: user },
      relations: {
        user: true,
      },
    });

    //首次签到 - 没有记录的
    if (!userSign) {
      daily.numSign = 1;
      daily.notes = notes;
      daily.user = user;
      await this.dailyEntityRepository.save(daily);
      //签到日志
      await this.signDailyLog.save(signLog);
      return { data: user, msg: '签到成功' };
    }

    if (!date(userSign.updatedDate)) return { msg: '今天你已经签到了' };

    userSign.numSign = userSign.numSign + 1;
    userSign.notes = notes;

    //更新数据
    const updateSign = await this.dailyEntityRepository.save(userSign);
    //签到日志
    await this.signDailyLog.save(signLog);

    return {
      data: updateSign,
      msg: '你已经签到了' + updateSign.numSign + '天',
    };
  }

  // 添加签到奖励
  async postSignConfigSave(data: SignConfigMinecraftDto) {
    const config = new SignDailyConfig();
    config.signId = data.signId;
    config.signNum = data.signNum;
    config.signCondition = data.signCondition; //天数
    config.signName = data.signName;
    config.typeSignConfig = data.typeSignConfig; // 0 代表物品; 1 代表指令
    config.signCmiDirectives = data.signCmiDirectives || null;

    return { data: await this.signDailyConfig.save(config) };
  }
}
