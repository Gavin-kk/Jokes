import { ICount, IUser, IUserState } from '@store/module/user/state.interface';
import { UserStoreActionType } from '@store/module/user/constant';

export const state: IUserState = {
  userInfo: {},
  isLogin: false,
  count: {
    articleCount: 0,
    topicArticleCount: 0,
    commentCount: 0,
    likeCount: 0,
  },
};

export const mutations = {
  [UserStoreActionType.CHANGE_USER_INFO](state: IUserState, payload: IUser) {
    state.userInfo = payload;
  },
  [UserStoreActionType.CHANGE_LOGIN_STATUS](state: IUserState, payload: boolean) {
    state.isLogin = payload;
  },
  [UserStoreActionType.CHANGE_COUNT](state: IUserState, payload: ICount) {
    state.count = payload;
  },
};
