// 获取所有话题分类
import { request } from '@services/service';
import { CreateTopicDto } from '@pages/create-topic/create-topic.vue';
// 获取所有话题分类
export const getTopicClassifyListRequest = () => request.get('/topic/classify/list');
// 获取所有话题
export const getAllTopicsRequest = (pageNum: number) => request.get('/topic/all', { params: { pageNum } });
// 创建话题
export const createTopicRequest = (payload: CreateTopicDto) => request.post('/topic/create', payload);
// 获取指定话题分类下的话题
export const getTheSpecifiedTopicCategoryRequest = (pageNum: number, classifyId: number) =>
  request.get('/topic/classify', { params: { pageNum, classifyId } });
