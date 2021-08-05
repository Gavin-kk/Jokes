import { HomeStoreActionType } from './constant';
import { IArticle, IClassify, IHomeState } from './state.interface';

export const state: IHomeState = {
  classifyList: [],
  articleList: [],
};

export const mutations = {
  [HomeStoreActionType.CHANGE_ALL_ARTICLE_CATEGORIES](state: IHomeState, payload: IClassify[]) {
    state.classifyList = payload;
  },
  [HomeStoreActionType.CHANGE_CLASSIFIED_ARTICLES](state: IHomeState, payload: IArticle[]) {
    state.articleList.push(...payload);
  },
};
