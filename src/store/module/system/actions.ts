import { ActionContext } from 'vuex';
import { ActionTypes } from './constant';

const actions = {
  [ActionTypes.GET_SYSTEM_INFO](content: ActionContext<ISystemState, unknown>) {
    uni.getSystemInfo({
      success(res: SystemInfo) {
        content.commit(ActionTypes.SET_SYSTEM_INFO, res);
      },
    });
  },
};
export default actions;
