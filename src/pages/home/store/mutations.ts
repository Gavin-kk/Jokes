import { HomeStoreActionType } from './constant';
import { IClassify, IHomeState } from './state.interface';

export const state: IHomeState = {
  classifyList: [],
};

export const mutations = {
  [HomeStoreActionType.CHANGE_ALL_ARTICLE_CATEGORIES](state: IHomeState, payload: IClassify[]) {
    state.classifyList = payload;
  },
};
