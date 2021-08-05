import { request } from './service';

// 获取个人所有文章
export const getAllUserPersonalArticleListRequest = (pageNumber: number) =>
  request.get('/article/user/list', {
    params: { pageNumber },
  });
// 获取个人所有话题下的文章
export const getAllUserTopicArticleListRequest = (pageNumber: number) =>
  request.get('/article/user/topic/list', {
    params: { pageNumber },
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
