export interface ITopicClassify {
  id: number;
  title: string;
  status: number;
  createAt: string;
  updateAt: string;
}

export interface ITopic {
  id: number;
  title: string;
  pic: string;
  desc: string;
  topicClassifyId: number;
  status: number;
  createAt: string;
  updateAt: string;
}

export interface IMomentState {
  topicClassifyList: ITopicClassify[];
  topicList: ITopic[];
  [key: string]: any;
}
