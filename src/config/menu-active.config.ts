export interface IMenuActiveConfig {
  pagePath: string;
  title: string;
}

export const menuActiveConfig: IMenuActiveConfig[] = [
  {
    pagePath: 'pages/home/index',
    title: 'home',
  },
  {
    pagePath: 'pages/moment/index',
    title: 'moment',
  },
];
