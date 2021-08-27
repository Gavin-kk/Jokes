import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { TOKEN_KEY } from '@common/constant/storage.constant';

const UserModule = namespace('userModule');

@Component({})
export default class CheckLoginMixin extends Vue {
  @UserModule.State('isLogin')
  private whetherToLogIn!: boolean;

  created() {
    const token: string | '' = uni.getStorageSync(TOKEN_KEY);
    if (token === '') {
      uni.redirectTo({ url: '/pages/login/login' });
    }
  }
}
