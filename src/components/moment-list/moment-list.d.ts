export interface IVideo {
  playCount: number;
  totalTime: string;
}
export interface IShare {
  content: string;
  momentPic: string;
}

declare interface IMomentList {
  id?: number;
  username: string;
  gender: number; // 0为男 1为女
  age: number;
  avatar: string;
  content: string;
  momentPic: string | null;
  video: IVideo | null;
  share: IShare | null;
  address: string;
  forwardCount: number; // 分享转发数量
  commentCount: number;
  likeCount: number;
  isLike: number; // 0未点赞 1点赞
  isFollow: number; // 是否关注
  dontLikeCount?: number;
  dislike?: number;
  createAt?: string;
}
