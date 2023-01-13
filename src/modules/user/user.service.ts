import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../typeorm/users/user/user.entity';
import { Authenticate } from '../../typeorm/users/authenticate/authenticate.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Authenticate)
    private authenticateRepository: Repository<Authenticate>,
  ) {}

  //查询用户信息
  async findUserById(query) {
    const findUser = await this.usersRepository.findOne({
      where: {
        id: Number(query.id),
      },
      relations: {
        dailyCheckInsEntity: true,
      },
    });

    return findUser ? { data: findUser } : { msg: '查询不到' };
  }

  //查询多个用户信息
  async fineMultipleUser({ players }) {
    const gamesName = players.map((item) => {
      return {
        gamesName: item,
      };
    });
    return {
      data: await this.usersRepository.find({
        where: [...gamesName],
      }),
    };
  }

  async updateFineUser(Body) {
    //判断 是否 绑定过
    const showGamesName = await this.usersRepository.findOne({
      where: {
        gamesName: Body.gamesName,
      },
    });

    if (showGamesName) {
      return { msg: '该游戏id已绑定' };
    }

    const fineUser = await this.usersRepository.findOne({
      where: {
        id: Body.id,
      },
    });

    fineUser.gamesName = Body.gamesName;
    fineUser.info = Body.info;

    return {
      data: await this.usersRepository.save(fineUser),
      msg: '绑定成功'
    };
  }
}
