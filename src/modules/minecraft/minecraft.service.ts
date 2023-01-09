import { Injectable } from '@nestjs/common';
import { queryFull } from 'minecraft-server-util';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Rcon } from 'rcon-client';
import {
  User,
  DailyCheckInsEntity,
  SignDailyLog,
  SignDailyConfig,
} from './typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import {
  SignMinecraftDto,
  SignConfigMinecraftDto,
} from './dto/sign-minecraft.dto';

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

    private config: ConfigService,
  ) {}
  async getMinecraftState() {
    const options = {
      sessionID: 1, // a random 32-bit signed number, optional
      enableSRV: true, // SRV record lookup
    };
    const { version, software, players } = await queryFull(
      this.config.get('MC_HOST'),
      Number(this.config.get('MC_PORT')),
      options,
    );

    if (version) {
      return {
        data: {
          version,
          players,
          software,
        },
        msg: '获取服务器请求成功',
      };
    }

    return {
      data: null,
      msg: '获取失败了',
    };
  }

  // 签到
  async getMinecraftSign({
    userId,
    notes,
    signEquipment,
    signIp,
  }: SignMinecraftDto) {
    //时间处理方法
    const rcon = await Rcon.connect({
      host: this.config.get('MC_HOST'),
      port: this.config.get('MC_RCON_PORT'),
      password: this.config.get('MC_RCON_PASSWORD'),
    });

    //奖励方法
    const signRewardFn = async ({ numSign, user }) => {
      const signReward = await this.signDailyConfig.find({
        where: [
          {
            signCondition: numSign,
          },
          {
            signCondition: LessThanOrEqual(numSign),
          },
        ],
      });

      const findNum = signReward.find((val) => val.signCondition === numSign);
      const findArticle = signReward[0];
      const findSign = findNum || findArticle;
      // 服务器终端操作
      // 0物品赠送 1指令赠送
      if (findSign.typeSignConfig === 0) {
        // 有cmi插件 物品赠送
        const cmi = `give ${findSign.signId} ${findSign.signNum} ${user.name}`;
        await rcon.send(cmi);

        await rcon.end(); //关闭
        return `获得 ${findSign.signName} ${findSign.signNum}`;
      }
    };

    //查询玩家是否在线
    const gamerFn = async ({ name }) => {
      const list = await rcon.send('list');
      if (new RegExp(name).test(list)) return true;
    };

    //查询到用户
    const user = await this.usersRepository.findOneBy({ id: userId });

    //查询玩家在线状态
    const showGamer = await gamerFn(user);

    if (!showGamer) return { msg: '签到失败,游戏不在线' };

    //查询不到用户
    if (!user) return { msg: '没有找到该用户' };

    //表
    const daily = new DailyCheckInsEntity();
    const signLog = new SignDailyLog();

    signLog.user = user;
    signLog.notes = notes;
    signLog.signIntegral = 100;
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
      daily.signShow = true;
      const dailyUser = await this.dailyEntityRepository.save(daily);
      await this.signDailyLog.save(signLog);
      //奖励表
      return { msg: '签到成功 ' + (await signRewardFn(dailyUser)) };
    }

    if (userSign.signShow) return { msg: '今天你已经签到了' };

    //奖励通过后，再+天数
    const reward = await signRewardFn(userSign);

    userSign.numSign = userSign.numSign + 1;
    userSign.notes = notes;
    userSign.signShow = true;

    //更新数据
    const updateSign = await this.dailyEntityRepository.save(userSign);
    //签到日志
    await this.signDailyLog.save(signLog);
    return {
      msg: '你已经签到了' + updateSign.numSign + '天 ' + reward,
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
