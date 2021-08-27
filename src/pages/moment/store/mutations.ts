import { IArticle } from '@pages/home/store';
import { IMomentState, ITopic, ITopicClassify } from './state.interface';
import { MomentStoreActionType } from './constant';

export const state: IMomentState = {
  topicClassifyList: [],
  topicList: [],
  followArticleList: [],
  //  热门话题
  hotTopic: [],
};

export const mutations = {
  // 更改所有话题分类
  [MomentStoreActionType.CHANGE_ALL_TOPIC_CATEGORIES](state: IMomentState, payload: ITopicClassify[]) {
    state.topicClassifyList = payload;
  },
  // 更改所有话题
  [MomentStoreActionType.CHANGE_ALL_TOPICS](state: IMomentState, payload: ITopic[]) {
    state.topicList = payload;
  },
  // 添加用户关注的用户文章列表
  [MomentStoreActionType.ADD_USER_ARTICLES_FOLLOWED_BY_USERS](state: IMomentState, payload: IArticle[]) {
    state.followArticleList.push(...payload);
  },
  // 添加用户关注的用户文章列表
  [MomentStoreActionType.CHANGE_USER_ARTICLES_FOLLOWED_BY_USERS](state: IMomentState, payload: IArticle[]) {
    state.followArticleList = payload;
  },
  //  更改热门话题
  [MomentStoreActionType.CHANGE_TRENDING_TOPIC](state: IMomentState, payload: ITopic[]) {
    state.hotTopic = payload;
  },
};
