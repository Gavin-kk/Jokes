import actions from './actions';
import mutations, { state } from './mutations';

export { ActionTypes } from './constant';

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
