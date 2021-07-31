import { IUser, IUserState } from '@store/module/user/state.interface';
import { UserStoreActionType } from '@store/module/user/constant';

export const state: IUserState = {
  userInfo: {},
  isLogin: false,
  count: {
    articleCount: 0,
    topicCount: 0,
    commentCount: 0,
    collectCount: 0,
  },
};

export const mutations = {
  [UserStoreActionType.CHANGE_USER_INFO](state: IUserState, data: IUser) {
    state.userInfo = data;
  },
  [UserStoreActionType.CHANGE_LOGIN_STATUS](state: IUserState, data: boolean) {
    state.isLogin = data;
  },
};
