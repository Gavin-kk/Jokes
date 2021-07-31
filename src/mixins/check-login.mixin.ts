import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const UserModule = namespace('userModule');

@Component({})
export default class CheckLoginMixin extends Vue {
  @UserModule.State('isLogin')
  private whetherToLogIn!: boolean;

  created() {
    if (!this.whetherToLogIn) {
      uni.redirectTo({ url: '/pages/login/login' });
    }
  }
}
