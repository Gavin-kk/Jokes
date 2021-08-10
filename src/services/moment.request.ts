import { request } from '@services/service';
// 搜索话题
export const searchTopicRequest = (content: string, pageNum: number) =>
  request.get('/topic/search', { params: { content, pageNum } });
// 获取所有用户关注的用户发布的文章 按时间排序
export const getUserArticlesFollowedByUsersRequest = (pageNum: number) =>
  request.get('/article/user/follow', { params: { pageNum } });
