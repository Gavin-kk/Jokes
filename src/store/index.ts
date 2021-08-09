import Vue from 'vue';
import Vuex from 'vuex';
import momentModule from '@pages/moment/store';
import systemModule from './module/system';
import userModule from './module/user';
import mineModule from '../pages/mine/store';
import homeModule from '../pages/home/store';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    systemModule,
    userModule,
    mineModule,
    homeModule,
    momentModule,
  },
});

export default store;
