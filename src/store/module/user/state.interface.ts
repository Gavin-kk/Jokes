export interface IUserinfo {
  id?: number;
  gender: number;
  age: number;
  emotion: string;
  job: string;
  birthday: string;
  hometown: string;
  userId: number;
}

export interface ICount {
  articleCount: number;
  topicArticleCount: number;
  commentCount: number;
  likeCount: number;
  [key: string]: number;
}

export interface IFollow {
  id: number;
  userId: number;
  followId: number;
  createAt: string;
  updateAt: string;
}

export interface IUser {
  id: number;
  username: string;
  avatar: string;
  email: string;
  createAt: string;
  updateAt: string;
  status: number;
  phone: string;
  nickname: string;
  userinfo?: [IUserinfo];
  // 当前用户是否关注了文章的发布者 文章的关注 如果是则数组存在
  followed: [IFollow];
  totalVisitors?: number; // 总访客数
  todaySVisitor?: number; // 24小时前到现在的访客数
  likeCount?: number; // 给我所有文章点赞的数量
  followCount?: number; // 我关注的数量
  fansCount?: number; // 关注我的数量
  isMe: boolean;
}

export interface IUserState {
  userInfo: IUser | Record<string, unknown>;
  isLogin: boolean;
  count: ICount;
}
