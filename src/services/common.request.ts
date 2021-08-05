import { SendEmailType } from '@common/enum/send-email-type';
import { request } from '@services/service';
// 请求验证码
export const getEmailVerificationCodeRequest = (email: string, type: SendEmailType) =>
  request.get('/email/code', { params: { email, type } });
// 获取当前用户的所有文章,话题文章,评论的文章,点赞的文章 的数量
export const getCountRequest = () => request.get('/article/user/count');
// 退出登录
export const signOutRequest = () => request.post('/auth/login/exit');
// 请求文章的详情
export const getArticleDetailRequest = (id: number) => request.get(`/article/detail/${id}`);
// 请求一级评论的子评论数据
export const getCommentChildListRequest = (commentId: number) =>
  request.get('/comment/list', { params: { commentId } });
