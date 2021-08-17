import { request } from './service';

// 获取所有互相关注列表
export const getAllMutualFollowingListsRequest = () => request.get('/follow/mutual');
// 获取所有粉丝也就是关注当前用户的列表
export const getAListOfFansRequest = () => request.get('/follow/fans');
