// 获取所有话题分类
import { request } from '@services/service';
import { CreateTopicDto } from '@pages/create-topic/create-topic.vue';
import { GetTopIcType } from '@pages/topic-detail/topic-detail.vue';
// 获取所有话题分类
export const getTopicClassifyListRequest = () => request.get('/topic/classify/list');
// 获取所有话题
export const getAllTopicsRequest = (pageNum: number) => request.get('/topic/all', { params: { pageNum } });
// 创建话题
export const createTopicRequest = (payload: CreateTopicDto) => request.post('/topic/create', payload);
// 获取指定话题分类下的话题
export const getTheSpecifiedTopicCategoryRequest = (pageNum: number, classifyId: number) =>
  request.get('/topic/classify', { params: { pageNum, classifyId } });
// 获取热门话题
export const getHotTopicsRequest = () => request.get('/topic/popular/list');
// 获取话题下的默认文章列表
export const getTopicArticleListRequest = (pageNum: number, topicId: number, type: GetTopIcType) =>
  request.get('/article/topic/list', { params: { pageNum, topicId, type } });
