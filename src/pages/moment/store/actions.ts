import { ActionContext } from 'vuex';
import { AxiosResponse } from 'axios';
import { getAllTopicsRequest, getHotTopicsRequest, getTopicClassifyListRequest } from '@services/topic.request';
import { IResponse } from '@services/interface/response.interface';
import { getUserArticlesFollowedByUsersRequest } from '@services/moment.request';
import { IArticle } from '@pages/home/store';
import { IMomentState, ITopic, ITopicClassify } from './state.interface';
import { MomentStoreActionType } from './constant';

export const actions = {
  // 获取所有话题分类
  async [MomentStoreActionType.GET_ALL_TOPIC_CATEGORIES](context: ActionContext<IMomentState, unknown>) {
    const result: AxiosResponse<IResponse<ITopicClassify[]>> = await getTopicClassifyListRequest();
    context.commit(MomentStoreActionType.CHANGE_ALL_TOPIC_CATEGORIES, result.data.data);
  },
  // 获取所有话题
  async [MomentStoreActionType.GET_ALL_TOPICS](context: ActionContext<IMomentState, unknown>, pageNum: number) {
    const result: AxiosResponse<IResponse<ITopic[]>> = await getAllTopicsRequest(pageNum);
    context.commit(MomentStoreActionType.CHANGE_ALL_TOPICS, result.data.data);
    return result.data.data;
  },
  //  TODO 获取所有用户关注的用户发布的文章 按时间排序
  async [MomentStoreActionType.GET_USER_ARTICLES_FOLLOWED_BY_USERS](
    context: ActionContext<IMomentState, unknown>,
    pageNum: number,
  ) {
    const result: AxiosResponse<IResponse<IArticle[]>> = await getUserArticlesFollowedByUsersRequest(pageNum);
    if (result.data.data.length === 0) {
      return false;
    }
    if (pageNum === 1) {
      context.commit(MomentStoreActionType.CHANGE_USER_ARTICLES_FOLLOWED_BY_USERS, result.data.data);
    } else {
      context.commit(MomentStoreActionType.ADD_USER_ARTICLES_FOLLOWED_BY_USERS, result.data.data);
    }
    return true;
  },
  async [MomentStoreActionType.GET_TRENDING_TOPIC](context: ActionContext<IMomentState, unknown>) {
    const result: AxiosResponse<IResponse<ITopic[]>> = await getHotTopicsRequest();
    context.commit(MomentStoreActionType.CHANGE_TRENDING_TOPIC, result.data.data);
  },
};
