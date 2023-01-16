import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MinecraftModule } from './modules/minecraft/minecraft.module';
import { TasksModule } from './tasks/tasks.module';
import { config } from 'dotenv';
import { UploadModule } from './modules/upload/upload.module';
config();

// const TypeOrm = TypeOrmModule.forRoot({
//   type: 'mysql',
//   host: '127.0.0.1',
//   port: 3306,
//   username: 'root',
//   password: '123456',
//   database: 'typeorm',
//   entities: [],
//   autoLoadEntities: true,
//   // 不应在生产中使用 - 打包时候记得关闭
//   synchronize: true,
// });

const TypeOrm = TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [],
  autoLoadEntities: true,
  // 不应在生产中使用 - 打包时候记得关闭
  synchronize: true,
});

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    MinecraftModule,
    TypeOrm,
    TasksModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
