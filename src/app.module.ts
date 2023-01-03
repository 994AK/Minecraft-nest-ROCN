import { Module } from '@nestjs/common';
import { GirlModule } from './girl/girl.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [GirlModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
