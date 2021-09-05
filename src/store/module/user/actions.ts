import { ActionContext } from 'vuex';
import { AxiosResponse } from 'axios';
import { ICount, IUser, IUserState } from '@store/module/user/state.interface';
import {
  accountPasswordLogin,
  emailVerificationCodeLogin,
  otherBindLoginRequest,
  otherLoginRequest,
} from '@services/auth.request';
import { IResponse } from '@services/interface/response.interface';
import { editPasswordRequest, getUserInfoRequest } from '@services/user.request';
import { IArticleState } from '@pages/mine/store';
import { getCountRequest } from '@services/common.request';
import { getFollowUserRequest } from '@services/follow.request';
import { IFollowEventPayload } from '@components/dynamic/dynamic.vue';
import { TOKEN_KEY } from '@common/constant/storage.constant';
import { IOtherBindLogin, IOtherLogin } from '@pages/mine/components/login-methods/login-methods.vue';
import { UserStoreActionType } from './constant';

export interface IAuthServiceOtherLoginError {
  text: string;
  userBindId: number;
}

const saveToken = (token: string) => {
  uni.setStorage({ key: TOKEN_KEY, data: token });
};
// 通知已经加载的文章或动态当前登录的人已经关注了他们的作者
const changePagesArticleFollow = (context: ActionContext<IUserState, unknown>) => {
  context.state.followedUsers.forEach((item) => {
    uni.$emit('follow', { userId: item.id, isFollow: true } as IFollowEventPayload);
  });
  uni.$emit('follow', { userId: context.state.userInfo.id, isFollow: true } as IFollowEventPayload);
};

export const actions = {
  // 账号密码登录
  async [UserStoreActionType.SEND_ACCOUNT_PASSWORD_TO_LOG_IN](
    context: ActionContext<IUserState, unknown>,
    payload: { username: string; password: string },
  ) {
    try {
      const result: AxiosResponse<IResponse<{ user: IUser; token: string }>> = await accountPasswordLogin(payload);
      saveToken(result.data.data.token);
      // 在这里发送登录请求 把user提交上去 token 存到locastorage
      await context.dispatch(UserStoreActionType.GET_USER_INFO);
      await context.dispatch(UserStoreActionType.GET_FOLLOW_LIST);
      // 通知已经加载的文章或动态当前登录的人已经关注了他们的作者
      changePagesArticleFollow(context);
      //  请求互关列表
    } catch (err) {
      console.log(err);
      uni.showToast({ title: '账号或密码错误', icon: 'none' });
      console.log(err.response.data, 'SEND_ACCOUNT_PASSWORD_TO_LOG_IN action内部');
    }
  },
  // 第三方登录
  async [UserStoreActionType.SEND_THIRD_PARTY_LOGIN](
    context: ActionContext<IUserState, unknown>,
    payload: IOtherLogin,
  ): Promise<{ type: boolean; userBindId?: number }> {
    const result: AxiosResponse<IResponse<IAuthServiceOtherLoginError | { user: IUser; token: string }>> =
      await otherLoginRequest(payload);
    if ((result.data.data as IAuthServiceOtherLoginError).text === '请绑定邮箱') {
      return { type: false, userBindId: (result.data.data as IAuthServiceOtherLoginError).userBindId };
    }
    saveToken((result.data.data as { user: IUser; token: string }).token);
    await context.dispatch(UserStoreActionType.GET_USER_INFO);
    await context.dispatch(UserStoreActionType.GET_FOLLOW_LIST);
    // 通知已经加载的文章或动态当前登录的人已经关注了他们的作者
    changePagesArticleFollow(context);
    return { type: true };
  },
  // 第三方账号绑定邮箱登录
  async [UserStoreActionType.BIND_EMAIL](
    context: ActionContext<IUserState, unknown>,
    payload: IOtherBindLogin,
  ): Promise<string> {
    const result: AxiosResponse<IResponse<{ user: IUser; token: string }>> = await otherBindLoginRequest(payload);
    if ((result as any).response?.data?.message === '验证码错误') {
      return (result as any).response.data.message;
    }
    saveToken(result.data.data.token);

    await context.dispatch(UserStoreActionType.GET_USER_INFO);
    await context.dispatch(UserStoreActionType.GET_FOLLOW_LIST);
    // 通知已经加载的文章或动态当前登录的人已经关注了他们的作者
    changePagesArticleFollow(context);
    return 'ok';
  },
  // 邮箱验证码登录
  async [UserStoreActionType.SEND_EMAIL_VERIFICATION_CODE_TO_LOG_IN](
    context: ActionContext<IUserState, unknown>,
    payload: {
      email: string;
      VCode: number;
    },
  ) {
    try {
      // 在这里发送登录请求 把user提交上去 token 存到locastorage
      const result: AxiosResponse<IResponse<{ user: IUser; token: string }>> = await emailVerificationCodeLogin(
        payload,
      );
      saveToken(result.data.data.token);
      await context.dispatch(UserStoreActionType.GET_USER_INFO);
      await context.dispatch(UserStoreActionType.GET_FOLLOW_LIST);
      changePagesArticleFollow(context);
    } catch (err) {
      uni.showToast({ title: '验证码错误', icon: 'none' });
      console.error(err.response.data, 'SEND_EMAIL_VERIFICATION_CODE_TO_LOG_IN action内部');
    }
  },
  // 获取用户详情
  async [UserStoreActionType.GET_USER_INFO](context: ActionContext<IUserState, unknown>, id: number): Promise<void> {
    try {
      const result: AxiosResponse<IResponse<IUser>> = await getUserInfoRequest(id);
      if ((result as any).response?.data?.statusCode === 400) {
        throw new Error('');
      }
      // 在这里发送登录请求 把user提交上去 token 存到locastorage
      context.commit(UserStoreActionType.CHANGE_USER_INFO, result.data.data);
      // 更改登录状态
      context.commit(UserStoreActionType.CHANGE_LOGIN_STATUS, true);
      // 获取个人所有文章话题文章评论和点赞的文章 的数量
      await context.dispatch(UserStoreActionType.GET_COUNT, true);
    } catch (err) {
      uni.showToast({ title: '登录失效,请重新登录', icon: 'none' });
      uni.$emit('follow', { userId: 0, isFollow: true } as IFollowEventPayload);
      // 更改登录状态
      context.commit(UserStoreActionType.CHANGE_LOGIN_STATUS, false);
      // console.error(err.response.data, '获取用户详情出错');
    }
  },
  // 获取个人所有文章话题文章评论和点赞的文章 的数量
  async [UserStoreActionType.GET_COUNT](context: ActionContext<IArticleState, unknown>) {
    try {
      const result: AxiosResponse<IResponse<ICount>> = await getCountRequest();
      context.commit(UserStoreActionType.CHANGE_COUNT, result.data.data);
    } catch (err) {
      console.error(err);
      uni.showToast({ title: '服务器出现错误' });
    }
  },
  async [UserStoreActionType.GET_COUNT](context: ActionContext<IArticleState, unknown>) {
    try {
      const result: AxiosResponse<IResponse<ICount>> = await getCountRequest();
      context.commit(UserStoreActionType.CHANGE_COUNT, result.data.data);
    } catch (err) {
      console.error(err);
      uni.showToast({ title: '服务器出现错误' });
    }
  },
  // 获取个人的关注列表
  async [UserStoreActionType.GET_FOLLOW_LIST](context: ActionContext<IArticleState, unknown>) {
    const result: AxiosResponse<IResponse<any>> = await getFollowUserRequest();
    context.commit(UserStoreActionType.CHANGE_FOLLOW_LIST, result.data.data);
  },
  //  修改用户密码
  async [UserStoreActionType.MODIFY_USER_PASSWORD](
    context: ActionContext<IUserState, unknown>,
    payload: { newPassword: string; VCode: number },
  ) {
    await editPasswordRequest(payload);
  },
};
