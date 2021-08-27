import { IArticle } from '@pages/home/store';

export interface ITopicClassify {
  id: number;
  title: string;
  status: number;
  createAt: string;
  updateAt: string;
}

export interface ITopic {
  id: number;
  title: string;
  pic: string;
  desc: string;
  topicClassifyId: number | string;
  articleCount: number | string; // 该话题总文章数
  todayCount: number | string; // 该话题今日文章数
  status: number;
  createAt: string;
  updateAt: string;
}

export interface IMomentState {
  topicClassifyList: ITopicClassify[];
  topicList: ITopic[];
  followArticleList: IArticle[];
  hotTopic: ITopic[];
}
