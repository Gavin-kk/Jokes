export interface IVideo {
  playCount: string;
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
  forwardCount: number;
  commentCount: number;
  likeCount: number;
  isLike: number; // 0未点赞 1点赞
  isFollow: number; // 是否关注
}
