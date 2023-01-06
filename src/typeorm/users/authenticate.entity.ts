import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entity';
@Entity()
export class Authenticate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
