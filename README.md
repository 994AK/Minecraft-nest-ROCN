# Minecraft-nest-ROCN

> 每次都要自己输入指令，特别繁琐，所以通过Rcon方式搭建属于自己服务器端 sever



#  项目框架

> 1. 使用`nuxt3 + tailwindcss `部署前端页面
>
> 2. 后端使用`nestjs + mysql数据库` 部署后端页面
> 3. 如果你想开箱即用, 请拉取前后端项目代码 

前端地址：https://github.com/994AK/Minecraft-sever-blog

后端地址：https://github.com/994AK/Minecraft-nest-ROCN

## 开始

如果你也想在自己服务器搭建一个sever-blog 你可以跟着我完成以下步骤

1. 拉取项目

   ```js
   git clone https://github.com/994AK/Minecraft-nest-ROCN.git
   ```

2. 安装依赖

   ```js
   # yarn
   yarn install
   
   # npm
   npm install
   
   # pnpm
   pnpm install
   ```

3. 配置env文件

   配置env轻松启动服务器,你需要要有`MYSQL`数据库环境，可以是某云的`MYSQL`数据库线上地址，也可以是`MYSQL`数据库本地地址

   ```js
   // 在根目录下创建 .env
   // JWT就是登陆口令
   JWT_SECRET_KEY="xxxx" 
   // 服务器地址
   MC_HOST="xxx"
   // 服务器端口
   MC_PORT="xxx"
   // RCON端口就是 server.properties文件下的rcon.port
   MC_RCON_PORT='xxx'
   // RCON端口就是 server.properties文件下的rcon.password
   MC_RCON_PASSWORD="xxxxx"
   //数据库配置
   //地址
   MYSQL_HOST="xxx"
   //终端
   MYSQL_PORT=3306
   // 用户名
   MYSQL_USERNAME="x x x"
   // 密码
   MYSQL_PASSWORD="xxx"
   // 表
   MYSQL_DATABASE="xx"
   ```

   另外要注意的话，需要开启**server.properties**文件下的`enable-rcon=true`

4. 启动项目

   ```js
   # yarn 
   yarn start:dev
   
   #npm
   npm run start:dev
   
   #pnpm
   pnpm run start:dev
   ```

## 打包部署

```bash
npm run build
```

pm2部署

```bash
npm run pm2
```

