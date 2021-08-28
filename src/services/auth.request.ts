import { IUsernameLogin, IVCodeLogin } from '@pages/login/login.vue';
import { IOtherBindLogin, IOtherLogin } from '@pages/mine/components/login-methods/login-methods.vue';
import { request } from './service';

// 邮箱验证码登录
export const emailVerificationCodeLogin = (data: IVCodeLogin) => request.post('/auth/login/email', data);
// 账号密码登录
export const accountPasswordLogin = (data: IUsernameLogin) => request.post('/auth/login/password', data);
// 第三方登录
export const otherLoginRequest = (data: IOtherLogin) => request.post('/auth/login/other', data);
// 绑定第三方登录 初始化第三方登录
export const otherBindLoginRequest = (data: IOtherBindLogin) => request.post('/auth/login/other/bind/email', data);
