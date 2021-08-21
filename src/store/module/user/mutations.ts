import { ICount, IUser, IUserState } from '@store/module/user/state.interface';
import { UserStoreActionType } from '@store/module/user/constant';
import { TOKEN_KEY } from '@common/constant/storage.constant';

export const state: IUserState = {
  userInfo: {},
  isLogin: false,
  count: {
    articleCount: 0,
    topicArticleCount: 0,
    attentionCount: 0,
    fansCount: 0,
  },
};

export const mutations = {
  [UserStoreActionType.CHANGE_USER_INFO](state: IUserState, payload: IUser) {
    state.userInfo = payload;
  },
  [UserStoreActionType.CHANGE_LOGIN_STATUS](state: IUserState, payload: boolean) {
    if (payload) {
      uni.$emit('initSocket');
    }
    state.isLogin = payload;
  },
  [UserStoreActionType.CHANGE_COUNT](state: IUserState, payload: ICount) {
    state.count = payload;
  },
  [UserStoreActionType.CHANGE_BG](state: IUserState, url: string) {
    state.userInfo.bgUrl = url;
  },
  [UserStoreActionType.INIT](state: IUserState) {
    state.count = {
      articleCount: 0,
      topicArticleCount: 0,
      attentionCount: 0,
      fansCount: 0,
    };
    state.isLogin = false;
    state.userInfo = {};
  },
};
