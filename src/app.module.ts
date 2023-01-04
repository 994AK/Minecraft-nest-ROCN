import { Module } from '@nestjs/common';
import { GirlModule } from './modules/girl/girl.module';
import { UserModule } from './modules/user/user.module';
import { MinecraftModule } from './modules/minecraft/minecraft.module';

@Module({
  imports: [GirlModule, UserModule, MinecraftModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
