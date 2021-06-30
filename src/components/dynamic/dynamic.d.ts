interface IMoment {
  // 用户名
  username: string;
  // title 内容
  title: string;
  // 用户头像
  avatar: string;
  // 播放数量
  playCount: number;
  // 总时间
  totalTime: number;
  // 回复数量
  privateMessageCount: number;
  // 喜欢数量
  likeCount: number;
  // 不喜欢数量
  dontLikeCount: number;
  // 分享次数
  shareCount: number;
  // 文件类型
  fileType: string;
  // 是否关注
  whetherToFollow: number;
  //  封面图片
  coverImage: string;
  //  是否已经点赞 0 未喜欢 1 喜欢
  isLike: number;
  //  是否点了踩 0 未踩 1 踩 点了踩 会自动取消 喜欢
  dislike: number;
}
