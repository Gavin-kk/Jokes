import { request } from './service';
// 获取所有文章分类
export const getAllArticleCategoriesRequest = () => request.get('/article/classify/all');
// 获取文章分类下的所有文章
export const getClassifyAllArticleRequest = (pageNum: number, classifyId: number) =>
  request.get('/article/classify/list', { params: { pageNum, classifyId } });
