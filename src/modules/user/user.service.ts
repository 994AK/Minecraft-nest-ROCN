import { Injectable, BadRequestException } from '@nestjs/common';
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

    if (!findUser) {
      throw new BadRequestException('查询不到用户信息');
    }
    return findUser;
  }

  //查询多个用户信息
  async fineMultipleUser({ players }) {
    const gamesName = players.map((item) => {
      return {
        gamesName: item,
      };
    });

    const findList = await this.usersRepository.find({
      where: [...gamesName],
    });

    if (findList.length === 0) {
      throw new BadRequestException('查询不到用户');
    }

    return findList;
  }

  async updateFineUser(Body) {
    //判断 是否 绑定过
    const showGamesName = await this.usersRepository.findOne({
      where: {
        gamesName: Body.gamesName,
      },
    });

    if (showGamesName && Body.id !== showGamesName?.id) {
      return { code: -1, msg: '该用户已有人绑定了' };
    }

    const fineUser = await this.usersRepository.findOne({
      where: {
        id: Body.id,
      },
    });

    fineUser.gamesName = Body.gamesName;
    fineUser.info = Body.info;
    fineUser.imageUrl = Body.imageUrl;

    return { data: await this.usersRepository.save(fineUser) };
  }
}
