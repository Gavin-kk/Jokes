import { IArticle } from '@pages/home/store';
import { IUser } from '@store/module/user';

export interface IPraiseResponse {
  id: number;
  isLike: number;
  userId: number;
  articleId: number;
  createAt: string;
  updateAt: string;
  // 该article是给我的文章点赞的文章
  article: IArticle;
  // 该user是给我的文章点赞的用户
  user: IUser;
}
