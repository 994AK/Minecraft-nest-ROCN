import { IsString } from 'class-validator';
export class QueryUserDto {
  @IsString()
  id: string;
}
