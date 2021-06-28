declare type SystemInfo = UniApp.GetSystemInfoResult;

declare interface ISystemState {
  systemInfo: SystemInfo | null;
}
