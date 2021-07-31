import Vue from 'vue';
import Vuex from 'vuex';
import systemModule from './module/system';
import userModule from './module/user';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    systemModule,
    userModule,
  },
});

export default store;
