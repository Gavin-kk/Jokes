import { ArticleType, IArticle, IUserArticlesLikes, IVideo } from '@store/module/home';
import { IUser } from '@store/module/user';

export interface IReply {
  id: number;
  content: string;
  userId: number | null;
  commentId: number;
  targetId: number | null;
  user: IUser;
  target?: IReply;
  createAt: string;
  updateAt: string;
}

export interface IComments {
  id: number;
  content: string;
  userId: number | null;
  articleId: number;
  user: IUser;
  reply: IReply[];
  createAt: string;
  updateAt: string;
  replyCount: number; // 此一级评论下的评论数量
}

export interface IArticleDetail {
  id: number;
  title: string;
  pic: string;
  content: string;
  contentImg: string[];
  video: IVideo | null;
  privacyStatus: number;
  address: string;
  type: ArticleType;
  shareCount: number;
  shareId: number;
  userId: number;
  articleClassifyId: number;
  commentStatus: number;
  status: number;
  createAt: string;
  updateAt: string;
  user: IUser;
  comments: IComments[];
  share: IArticle;
  userArticlesLikes: IUserArticlesLikes[];
  commentCount: number;
  likeCount: number;
  disLikeCount: number;
}
