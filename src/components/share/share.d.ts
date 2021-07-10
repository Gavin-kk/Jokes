export interface ShareOptions {
  /**
   * 分享服务提供商，通过uni.getProvider获取，如果不设置则弹出分享列表选择界面
   * - sinaweibo: 新浪微博分享
   * - qq: 分享到QQ好友
   * - weixin: 分享微信消息、朋友圈及微信小程序
   */
  provider?: 'sinaweibo' | 'qq' | 'weixin';
  /**
   * 分享类型。默认图文0，纯文字1，纯图片2，音乐3，视频4，小程序5。
   * - 0: 图文
   * - 1: 纯文字
   * - 2: 纯图片
   * - 3: 音乐
   * - 4: 视频
   * - 5: 小程序
   */
  type?: 0 | 1 | 2 | 3 | 4 | 5;
  /**
   * 标题
   */
  title?: string;
  /**
   * 场景。可取值“WXSceneSession”分享到聊天界面，“WXSenceTimeline”分享到朋友圈，“WXSceneFavorite”分享到微信收藏
   */
  scene?: string;
  /**
   * 摘要
   */
  summary?: string;
  /**
   * 跳转链接
   */
  href?: string;
  /**
   * 图片地址
   */
  imageUrl?: string;
  /**
   * 音视频地址
   */
  mediaUrl?: string;
  /**
   * 分享小程序
   */
  miniProgram?: MiniProgramShareOptions;
  /**
   * 接口调用成功的回调函数
   */
  success?: (result: any) => void;
  /**
   * 接口调用失败的回调函数
   */
  fail?: (result: any) => void;
  /**
   * 接口调用结束的回调函数（调用成功、失败都会执行）
   */
  complete?: (result: any) => void;
}
