import { IUsernameLogin, IVCodeLogin } from '@pages/login/login.vue';
import { request } from './service';

// 邮箱验证码登录
export const emailVerificationCodeLogin = (data: IVCodeLogin) => request.post('/auth/login/email', data);
// 账号密码登录
export const accountPasswordLogin = (data: IUsernameLogin) => request.post('/auth/login/password', data);
