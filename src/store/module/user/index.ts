import { namespace } from 'vuex-class';
import { actions } from './actions';
import { mutations, state } from './mutations';

export * from './state.interface';
export const UserModule = namespace('userModule');
export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
