export interface IResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}
export interface IUploadResponse {
  success: string[];
  restricted: string[];
  notSupport: string[];
}
