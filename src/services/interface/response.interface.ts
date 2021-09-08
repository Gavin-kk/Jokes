export interface IResponse<DataType> {
  data: DataType;
  message: string;
  statusCode: number;
}
export interface IUploadResponse {
  success: string[];
  restricted: string[];
  notSupport: string[];
}
