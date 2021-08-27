export const newVersionDetection = () => {
  // 获取 manifest.json 的信息
  plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
    //  获取 app的version
    const appVersion = wgtinfo.version;
    // 存缓存 版本号
    try {
      uni.setStorageSync('appVersion', appVersion);
    } catch (e) {}
  });
  // 更新版本接口
  const server = '……'; //  版本接口api
  // 取缓存 版本号
  const v = uni.getStorageSync('appversion');
};
