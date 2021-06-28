<script lang="ts">
import Vue from 'vue';
import { ActionTypes } from '@store/module/system';

export default Vue.extend({
  mpType: 'app',
  onLaunch() {
    this.$store.dispatch(`systemModule/${ActionTypes.GET_SYSTEM_INFO}`);
    console.log('加载');
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  },
});
</script>

<style lang="scss">
/*每个页面公共css */
/* 引入uni的css */
@import './common/style/uni.css';

/* 引入iconfont 图标库 */
@import './common/style/icon.css';

/* 引入animate css3动画库*/
/* #ifndef MP-WEIXIN */
@import '~animate.css';
/*  #endif  */

/* #ifdef MP-WEIXIN */
@import './common/style/animate.min.css';
/* #endif */

/*.uni-page-body,
html,
body {
  height: 100%;
}*/
</style>
