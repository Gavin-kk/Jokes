import { Vue, Component } from 'vue-property-decorator';
import { TOKEN_KEY } from '@common/constant/storage.constant';
import { UserModule } from '@store/module/user';

@Component({})
export default class CheckLoginMixin extends Vue {
  @UserModule.State('isLogin')
  private readonly isLogin?: boolean;
  created() {
    const token: string | '' = uni.getStorageSync(TOKEN_KEY);
    if (token === '' || !this.isLogin) {
      uni.redirectTo({ url: '/pages/login/login' });
    }
  }
}
