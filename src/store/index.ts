import Vue from 'vue';
import Vuex from 'vuex';
import systemModule from './module/system';
import userModule from './module/user';
import articleModule from './module/article';
import homeModule from './module/home';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    systemModule,
    userModule,
    articleModule,
    homeModule,
  },
});

export default store;
