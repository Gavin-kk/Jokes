import { ActionContext } from 'vuex';
import { AxiosResponse } from 'axios';
import { getAllTopicsRequest, getTopicClassifyListRequest } from '@services/topic.request';
import { IResponse } from '@services/interface/response.interface';
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
};
