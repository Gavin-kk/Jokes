import { actions } from './actions';
import { mutations, state } from './mutations';

export * from './state.interface';

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
