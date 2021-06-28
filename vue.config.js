const path = require('path');

const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
  lintOnSave: process.env.NODE_ENV === 'development',
  chainWebpack: (config) => {
    config.resolve.alias // 添加别名
      .set('@src', resolve('src'))
      .set('@pages', resolve('src/pages'))
      .set('@components', resolve('src/components'))
      .set('@services', resolve('src/services'))
      .set('@utils', resolve('src/utils'))
      .set('@common', resolve('src/common'))
      .set('@config', resolve('src/config'))
      .set('@store', resolve('src/store'))
      .set('@static', resolve('src/static'));
  },
  transpileDependencies: ['@dcloudio/uni-ui'],
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@common/style/global.scss";@import "./src/uni.scss";',
      },
    },
  },
};
