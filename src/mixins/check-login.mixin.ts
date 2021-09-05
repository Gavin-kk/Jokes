import { Vue, Component } from 'vue-property-decorator';
import { TOKEN_KEY } from '@common/constant/storage.constant';

@Component({})
export default class CheckLoginMixin extends Vue {
  created() {
    const token: string | '' = uni.getStorageSync(TOKEN_KEY);
    if (token === '') {
      uni.redirectTo({ url: '/pages/login/login' });
    }
  }
}
