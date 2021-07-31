import axios, { AxiosRequestConfig } from 'axios';
import { BASE_URL } from '@config/service.config';

type Method = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';

interface ICompleteResponse {
  data: string | AnyObject | ArrayBuffer;
  statusCode: number;
  header: any;
  cookies: string[];
  errMsg: string;
}

export const request = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

request.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = uni.getStorageSync('_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.defaults.adapter = (config: AxiosRequestConfig) =>
  // 自己定义个适配器，用来适配uniapp的语法
  new Promise((resolve, reject) => {
    // eslint-disable-next-line global-require
    const settle = require('axios/lib/core/settle');
    // eslint-disable-next-line global-require
    const buildURL = require('axios/lib/helpers/buildURL');
    uni.request({
      method: config?.method?.toUpperCase() as Method,
      url: config.baseURL + buildURL(config.url, config.params, config.paramsSerializer),
      header: config.headers,
      data: config.data,
      dataType: (config as any).dataType,
      responseType: config.responseType,
      sslVerify: (config as any).sslVerify,
      complete(r: any) {
        const res: ICompleteResponse = r;
        const response = {
          data: res.data,
          status: res.statusCode,
          message: res.errMsg,
          header: res.header,
          cookies: res.cookies,
          config,
        };
        settle(resolve, reject, response);
      },
    });
  });