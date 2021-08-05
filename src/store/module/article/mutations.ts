import { ArticleStoreActionType } from './constant';
import { IArticle, IArticleState } from './state.interface';

export const state: IArticleState = {
  personalArticleList: [],
};

export const mutations = {
  [ArticleStoreActionType.CHANGE_ALL_PERSONAL_ARTICLES](state: IArticleState, payload: IArticle[]) {
    state.personalArticleList = payload;
  },
  // 改变本地个人评论文章的数据
  [ArticleStoreActionType.CHANGE__ALL_PERSONAL_COMMENTED_ARTICLES](state: IArticleState, payload: IArticle[]) {
    state.personalArticleList = payload;
  },
};
