import { ActionContext } from 'vuex';
import { AxiosResponse } from 'axios';
import {
  getAllUserCommentListRequest,
  getAllUserLikeArticleRequest,
  getAllUserPersonalArticleListRequest,
  getAllUserTopicArticleListRequest,
} from '@services/article.request';
import { IResponse } from '@services/interface/response.interface';
import { getCountRequest } from '@services/common.request';
import { IArticle, IArticleState } from './state.interface';
import { ArticleStoreActionType } from './constant';

export const actions = {
  // 获取个人所有文章
  async [ArticleStoreActionType.GET_ALL_PERSONAL_ARTICLES](
    context: ActionContext<IArticleState, unknown>,
    pageNumber: number,
  ) {
    try {
      const result: AxiosResponse<IResponse<IArticle[]>> = await getAllUserPersonalArticleListRequest(pageNumber);
      context.commit(ArticleStoreActionType.CHANGE_ALL_PERSONAL_ARTICLES, result.data.data);
    } catch (err) {
      uni.showToast({ title: '连接失败', icon: 'none' });
      console.log(err.response.data);
    }
  },
  // 获取个人所有话题下的文章
  async [ArticleStoreActionType.GET_ARTICLES_UNDER_ALL_PERSONAL_TOPICS](
    context: ActionContext<IArticleState, unknown>,
    pageNumber: number,
  ) {
    const result = await getAllUserTopicArticleListRequest(pageNumber);
  },
  // 获取个人所有的评论的文章
  async [ArticleStoreActionType.GET_ALL_PERSONAL_COMMENTED_ARTICLES](
    context: ActionContext<IArticleState, unknown>,
    pageNumber: number,
  ) {
    const result = await getAllUserCommentListRequest(pageNumber);
  },
  // 获取个人所有点赞的文章
  async [ArticleStoreActionType.GET_ALL_ARTICLES_LIKED_BY_INDIVIDUALS](
    context: ActionContext<IArticleState, unknown>,
    pageNumber: number,
  ) {
    const result = await getAllUserLikeArticleRequest(pageNumber);
  },
};
