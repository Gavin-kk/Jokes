import { IMomentState, ITopic, ITopicClassify } from './state.interface';
import { MomentStoreActionType } from './constant';

export const state: IMomentState = {
  topicClassifyList: [],
  topicList: [],
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
};
