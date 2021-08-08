import { request } from '@services/service';
// 删除图片
export const deleteUploadImage = (imageName: string) =>
  request.delete('/upload/image', {
    params: { imageName },
    headers: {
      'content-type': ' text/plain ',
    },
  });
// 删除视频
export const deleteUploadVideo = (videoName: string) =>
  request.delete('/upload/video', {
    params: { videoName },
    headers: {
      'content-type': ' text/plain ',
    },
  });
// 发布文章
export const postArticleRequest = (payload: any) => request.post('/article/publish', payload);
