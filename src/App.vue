<script lang="ts">
import Vue from 'vue';
import { ModuleConstant } from '@store/module.constant';
import { UserStoreActionType } from '@store/module/user/constant';

export default Vue.extend({
  mpType: 'app',
  onLaunch() {
    const token: string | '' = uni.getStorageSync('_token');
    if (token) {
      this.$store.dispatch(`${ModuleConstant.userModule}/${UserStoreActionType.GET_USER_INFO}`);
    }
  },
  onShow() {
    // console.log('App Show');
    // uni.getNetworkType({
    //   success(res) {
    //     console.log(res.networkType, 123);
    //   },
    // });
    // uni.onNetworkStatusChange((res) => {
    //   uni.showToast({ title: '网络错误', icon: 'none', duration: 2000 });
    // });
  },
  onHide() {
    // console.log('App Hide');
  },
});
</script>

<style lang="scss">
/*每个页面公共css */
/* 引入uni的css */
//@import './common/style/uni.css';

/* 引入iconfont 图标库 */
@import './common/style/icon.css';

/* 引入animate css3动画库*/
/* #ifndef MP-WEIXIN */
@import '~animate.css';
/*  #endif  */

/* #ifdef MP-WEIXIN */
@import './common/style/animate.min.css';
/* #endif */

//.uni-page-body,
//html,
//body {
//  height: 100%;
//}
</style>
