import { IsArray } from 'class-validator';

export class FindUserDto {
  @IsArray()
  players: Array<string>;
}
