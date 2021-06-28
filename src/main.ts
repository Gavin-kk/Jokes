import Vue from 'vue';
import store from '@src/store/index';
import App from './App.vue';

Vue.config.productionTip = false;
const app = new App({ ...App, store });
app.$mount();
