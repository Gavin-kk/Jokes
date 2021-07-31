import { SendEmailType } from '@common/enum/send-email-type';
import { request } from '@services/service';
// 请求验证码
export const getEmailVerificationCode = (email: string, type: SendEmailType) =>
  request.get('/email/code', { params: { email, type } });
