import Vue from 'vue';
import store from '@src/store/index';
import WebsocketMixin from '@src/mixins/websocket.mixin';
import App from './App.vue';
//
// const mixin = {
//   data() {
//     return {
//       hah: '1234',
//     };
//   },
//   created() {
//     (this as any).haha();
//   },
//   methods: {
//     haha() {
//       console.log((this as any).hah, '12');
//     },
//   },
// };
Vue.config.productionTip = false;
// Vue.mixin();
const app = new App({ ...App, store });
app.$mount();
