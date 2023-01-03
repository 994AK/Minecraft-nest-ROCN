import { Injectable } from '@nestjs/common';

@Injectable()
export class GirlService {
  getGirls() {
    return {
      code: 1,
      data: ['蜕化', '长大', '不知道'],
      msg: '请求成功',
    };
  }
  addGirl(body: any) {
    return {
      code: 1,
      data: body,
      msg: '添加成功',
    };
  }

  getGirlById(id: number) {
    const START = {
      1: { id: 1, name: '88G' },
      2: { id: 2, name: '994AK' },
      3: { id: 3, name: '994AJ' },
    };

    return START[id];
  }

  findGirlById(params: { id: number; name: string }) {
    return {
      code: 1,
      data: {
        id: params.id,
        name: params.name,
      },
      msg: '请求成功',
    };
  }
}
