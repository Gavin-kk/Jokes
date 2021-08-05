import { IUser } from '@store/module/user';

export interface IUserArticlesLikes {
  id: number;
  isLike: number;
  userId: number;
  articleId: number;
  createAt: string;
  updateAt: string;
}

export interface IArticle {
  id: number;
  title: string;
  pic: string | null;
  content: string;
  contentImg: string[];
  privacyStatus: number;
  address: string;
  type: number;
  shareCount: number;
  shareId: number | null;
  userId: number;
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

export interface IArticleState {
  personalArticleList: IArticle[];
}
