import { ActionContext } from 'vuex';
import { AxiosResponse } from 'axios';
import { IResponse } from '@services/interface/response.interface';
import { getAllArticleCategoriesRequest } from '@services/home.request';
import { IClassify, IHomeState } from './state.interface';
import { HomeStoreActionType } from './constant';

export const actions = {
  // 获取文章分类 顺便请求第一个分类的文章
  async [HomeStoreActionType.GET_ALL_ARTICLE_CATEGORIES](context: ActionContext<IHomeState, unknown>) {
    const classifyResult: AxiosResponse<IResponse<IClassify[]>> = await getAllArticleCategoriesRequest();
    context.commit(HomeStoreActionType.CHANGE_ALL_ARTICLE_CATEGORIES, classifyResult.data.data);
  },
};
