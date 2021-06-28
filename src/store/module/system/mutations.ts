import { ActionTypes } from './constant';

export const state: ISystemState = {
  systemInfo: null,
};

const mutations = {
  [ActionTypes.SET_SYSTEM_INFO](state: ISystemState, data: SystemInfo) {
    state.systemInfo = data;
  },
};
export default mutations;
