import { request } from './service';

// 获取个人所有文章
export const getAllUserPersonalArticleListRequest = (pageNumber: number) =>
  request.get('/article/user/list', {
    params: { pageNumber },
  });
// 获取个人所有话题下的文章
export const getAllUserTopicArticleListRequest = (pageNum: number) =>
  request.get('/article/user/topic/list', {
    params: { pageNum },
  });
// 获取个人所有的评论的文章
export const getAllUserCommentListRequest = (pageNumber: number) =>
  request.get('/comment/user/list', {
    params: { pageNumber },
  });
// 获取个人所有点赞的文章
export const getAllUserLikeArticleRequest = (pageNumber: number) =>
  request.get('/article/user/like/list', {
    params: { pageNumber },
  });
// 获取指定用户的所有文章
export const getUserArticlesRequest = (userId: number, pageNum: number) =>
  request.get('/article/other/user/list', { params: { id: userId, pageNum } });
// 获取指定用户的所有话题文章 userId是可选的 如果userid不传并且当前是登录状态 获取的就是自己的 否则参数错误
export const getTopicArticleListRequest = (pageNum: number, userId?: number) =>
  request.get('/article/user/topic/list', { params: { userId, pageNum } });
// 查询谁给点前用户的文章点赞了 携带文章信息
export const getLikeMineUserRequest = (pageNum: number) =>
  request.get('/article/like/mine', {
    params: {
      pageNum,
    },
  });
