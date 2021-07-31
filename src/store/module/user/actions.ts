import { ActionContext } from 'vuex';
import { AxiosResponse } from 'axios';
import { IUser, IUserState } from '@store/module/user/state.interface';
import { accountPasswordLogin, emailVerificationCodeLogin } from '@services/auth.request';
import { IResponse } from '@services/interface/response.interface';
import { editEmailRequest, editPasswordRequest, getUserInfoRequest } from '@services/user.request';
import Login from '@pages/login/login.vue';
import { UserStoreActionType } from './constant';

export const actions = {
  // 账号密码登录
  async [UserStoreActionType.SEND_ACCOUNT_PASSWORD_TO_LOG_IN](
    context: ActionContext<IUserState, unknown>,
    payload: { username: string; password: string },
  ): Promise<void> {
    try {
      const result: AxiosResponse<IResponse<{ user: IUser; token: string }>> = await accountPasswordLogin(payload);
      uni.setStorage({ key: '_token', data: result.data.data.token });
      // 在这里发送登录请求 把user提交上去 token 存到locastorage
      context.commit(UserStoreActionType.CHANGE_USER_INFO, result.data.data.user);
      context.commit(UserStoreActionType.CHANGE_LOGIN_STATUS, true);
    } catch (err) {
      uni.showToast({ title: '账号或密码错误', icon: 'none' });
      console.log(err.response.data, 'SEND_ACCOUNT_PASSWORD_TO_LOG_IN action内部');
    }
  },
  // 第三方登录
  async [UserStoreActionType.SEND_THIRD_PARTY_LOGIN](content: ActionContext<IUserState, unknown>): Promise<void> {
    // 在这里发送登录请求 把user提交上去 token 存到locastorage
    content.commit(UserStoreActionType.CHANGE_USER_INFO, 'data');
  },
  // 邮箱验证码登录
  async [UserStoreActionType.SEND_EMAIL_VERIFICATION_CODE_TO_LOG_IN](
    context: ActionContext<IUserState, unknown>,
    payload: {
      email: string;
      VCode: number;
    },
  ): Promise<void> {
    try {
      const result: AxiosResponse<IResponse<{ user: IUser; token: string }>> = await emailVerificationCodeLogin(
        payload,
      );
      uni.setStorage({ key: '_token', data: result.data.data.token });
      // 在这里发送登录请求 把user提交上去 token 存到locastorage
      context.commit(UserStoreActionType.CHANGE_USER_INFO, result.data.data.user);
      // 更改登录状态
      context.commit(UserStoreActionType.CHANGE_LOGIN_STATUS, true);
    } catch (err) {
      uni.showToast({ title: '验证码错误', icon: 'none' });
      console.log(err.response.data, 'SEND_EMAIL_VERIFICATION_CODE_TO_LOG_IN action内部');
    }
  },
  // 获取用户详情
  async [UserStoreActionType.GET_USER_INFO](context: ActionContext<IUserState, unknown>): Promise<void> {
    try {
      const result: AxiosResponse<IResponse<IUser>> = await getUserInfoRequest();
      // 在这里发送登录请求 把user提交上去 token 存到locastorage
      context.commit(UserStoreActionType.CHANGE_USER_INFO, result.data.data);
      // 更改登录状态
      context.commit(UserStoreActionType.CHANGE_LOGIN_STATUS, true);
    } catch (err) {
      uni.showToast({ title: '登录失效,请重新登录', icon: 'none' });
      // 更改登录状态
      context.commit(UserStoreActionType.CHANGE_LOGIN_STATUS, false);
      console.log(err.response.data, '获取用户详情出错');
    }
  },
  //  修改用户密码
  async [UserStoreActionType.MODIFY_USER_PASSWORD](
    context: ActionContext<IUserState, unknown>,
    payload: { newPassword: string; VCode: number },
  ) {
    await editPasswordRequest(payload);
  },
  // 获取文章话题评论收藏的数量
  async [UserStoreActionType.GET_COUNT](context: ActionContext<IUserState, unknown>): Promise<void> {},
};
