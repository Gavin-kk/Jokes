export interface IResponse<T> {
  data: T;
  message: string;
  statusCode: 200;
}
export interface IUploadResponse {
  success: string[];
  restricted: string[];
  notSupport: string[];
}
