import { SendEmailType } from '@common/enum/send-email-type';
import { request } from '@services/service';
import { ISendCommentPayload } from '@pages/content/content.vue';
import { LikeCommentType } from '@pages/content/components/comment/comment.vue';
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
// 发送评论
export const sendCommentRequest = (payload: ISendCommentPayload) => request.post('/comment/publish', payload);
// 通过经纬度获取地址
export const getAddressByLatitudeAndLongitudeRequest = (payload: { longitude: number; latitude: number }) =>
  request.get('/geography/geocode', { params: payload });
// 点赞评论
export const likeCommentRequest = (type: LikeCommentType, commentId: number) =>
  request.post('/comment/like/comment', {
    commentId,
    type,
  });
