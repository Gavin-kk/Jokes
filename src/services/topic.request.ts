// 获取所有话题分类
import { request } from '@services/service';
// 获取所有话题分类
export const getTopicClassifyListRequest = () => request.get('/topic/classify/list');
// 获取所有话题
export const getAllTopicsRequest = (pageNum: number) => request.get('/topic/all', { params: { pageNum } });
