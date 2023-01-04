module.exports = {
  apps: [
    {
      name: 'nestJS',
      exec_mode: 'cluster',
      instances: '2',
      script: './dist/main.js',
      env: {
        // 环境参数，当前指定为开发环境
        NODE_ENV: 'development',
        PORT: '3000',
      },
      env_production: {
        // 环境参数,当前指定为生产环境
        NODE_ENV: 'production', // 使用production模式 pm2 start ecosystem.config.js --env production
        PORT: '3000',
      },
      env_test: {
        // 环境参数,当前为测试环境
        NODE_ENV: 'test',
      },
    },
  ],
};
