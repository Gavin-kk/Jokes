import Vue from 'vue';
import Vuex from 'vuex';
import systemModule from './module/system';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    systemModule,
  },
});

export default store;
