import { IUser } from '@store/module/user';

export const enum ArticleType {
  Graphic, // 图文
  PlainText, // 纯文
  Share, // 分享
  Video,
}
export interface IClassify {
  id: number;
  title: string;
  status: number;
  count: number;
  createAt: string;
  updateAt: string;
}
export interface IUserArticlesLikes {
  id: number;
  isLike: number;
  userId: number;
  articleId: number;
  createAt: string;
  updateAt: string;
}
export interface IVideo {
  playCount: number;
  videoUrl: string;
  pic: string;
}
export interface IArticle {
  id: number;
  title: string;
  pic: string;
  content: string;
  contentImg: string[];
  privacyStatus: number;
  address: string;
  type: ArticleType;
  shareCount: number;
  shareId: number | null;
  userId: number;
  video: IVideo | null;
  articleClassifyId: number;
  commentStatus: number;
  status: number;
  createAt: string;
  updateAt: string;
  user: IUser;
  share: IArticle;
  userArticlesLikes: IUserArticlesLikes[];
  commentCount: number;
  likeCount: number;
  disLikeCount: number;
}

export interface IHomeState {
  classifyList: IClassify[];
  [key: string]: unknown;
}
