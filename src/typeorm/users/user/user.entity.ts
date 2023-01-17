import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { DailyCheckInsEntity } from '../sign/daily_check_ins.entity';
import { SignDailyLog } from '../sign/sign_daily_log';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  //用户绑定游戏名
  @Column({ nullable: true })
  gamesName: string;

  //用户简介
  @Column({ nullable: true })
  info: string;

  @Column({ nullable: true })
  imageUrl: string;

  // 关联dailyCheckInsEntity表
  @OneToMany(
    () => DailyCheckInsEntity,
    (dailyCheckInsEntity) => dailyCheckInsEntity.user,
  )
  dailyCheckInsEntity: DailyCheckInsEntity[];

  // 关联SignDailyLog表
  @OneToMany(() => SignDailyLog, (signDailyLog) => signDailyLog.user)
  signDailyLog: SignDailyLog[];
}
