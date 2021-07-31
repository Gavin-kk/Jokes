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
  topicCount: number;
  commentCount: number;
  collectCount: number;
  [key: string]: number;
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
  totalVisitors: number; // 总访客数
  todaySVisitor: number; // 24小时前到现在的访客数
  likeCount: number; // 给我所有文章点赞的数量
  followCount: number; // 我关注的数量
  fansCount: number; // 关注我的数量
}

export interface IUserState {
  userInfo: IUser | Record<string, unknown>;
  isLogin: boolean;
  count: ICount;
}
