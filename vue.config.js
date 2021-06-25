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
      .set('@assets', resolve('src/assets'))
      .set('@utils', resolve('src/utils'))
      .set('@common', resolve('src/common'));
  },
};
