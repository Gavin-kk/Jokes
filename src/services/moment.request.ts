import { request } from '@services/service';

export const searchTopicRequest = (content: string, pageNum: number) =>
  request.get('/topic/search', { params: { content, pageNum } });
