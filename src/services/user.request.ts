import { IEditMaterialSubmit } from '@pages/edit-material/edit-material.vue';
import { request } from './service';
// 获取用户详情
export const getUserInfoRequest = (id?: number) => request.get('/user/info', { params: { id } });
// 修改密码
export const editPasswordRequest = (payload: { newPassword: string; VCode: number }) =>
  request.put('/user/edit/password', payload);
// 修改邮箱
export const editEmailRequest = (payload: { password: string; VCode: number; newEmail: string }) =>
  request.put('/user/edit/email', payload);
// 修改个人资料
export const editUserInfoRequest = (payload: IEditMaterialSubmit) => request.put('/user/edit/userinfo', payload);
// 关注用户
export const followUsersRequest = (follwoId: number) => request.post('/follow', { follwoId });
// 搜索用户
export const searchUserRequest = (content: string) =>
  request.get('/user/search', {
    params: { content },
  });
