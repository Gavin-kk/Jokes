<template>
  <view class="login">
    <view class="title" v-if="!ifUseIcon">登录嘻嘻哈哈, 体验等多功能</view>
    <view class="methods">
      <!--#ifndef H5-->
      <block v-for="item in providerList" :key="item.id">
        <view :class="['iconfont', item.iconClassName]" @tap="login(item)"></view>
      </block>
      <!--#endif-->
    </view>
    <view class="other-login" @tap="openLoginPage" v-if="!ifUseIcon">
      账号密码登录
      <view class="iconfont icon-jinru"></view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { UserModule } from '@store/module/user';
import { UserStoreActionType } from '@store/module/user/constant';
import { otherBindLoginRequest } from '@services/auth.request';

export interface IOtherBindLogin {
  userBindId: number;
  email: string;
  password: string;
  VCode: number;
  nickname: string;
  avatar: string;
}

export interface IOtherLogin {
  type: string;
  openid: string;
  nickname: string;
  avatar: string;
}

export interface IProvider {
  value: string;
  id: 'weixin' | 'qq' | 'sinaweibo';
  iconClassName: string;
}

@Component({})
export default class LoginMethods extends Vue {
  @UserModule.Action(UserStoreActionType.SEND_THIRD_PARTY_LOGIN)
  private readonly otherLoginAction!: (payload: IOtherLogin) => Promise<{ type: boolean; userBindId?: number }>;
  @Prop({ type: Boolean, default: false })
  private ifUseIcon!: boolean;

  private providerList: IProvider[] = [];

  created() {
    const supportProvider: string[] = ['weixin', 'qq', 'sinaweibo'];
    uni.getProvider({
      service: 'oauth',
      success: (res) => {
        this.providerList = res.provider
          .map((item) => {
            let providerName: string;
            let icon: string;
            switch (item) {
              case 'weixin':
                providerName = '微信登录';
                icon = 'icon-weixin';
                break;
              case 'qq':
                providerName = 'QQ登录';
                icon = 'icon-QQ';
                break;
              case 'sinaweibo':
                providerName = '新浪微博登录';
                icon = 'icon-xinlangweibo';
                break;
              default:
            }
            return {
              value: providerName!,
              id: item,
              iconClassName: icon!,
            };
          })
          .filter((itemx) => supportProvider.find((itemy) => itemy === itemx.id));
      },
    });
  }

  // 登录
  login(item: IProvider) {
    uni.login({
      provider: item.id,
      success: (loginRes: any) => {
        uni.getUserInfo({
          provider: item.id,
          success: (userInfo) => {
            const provider = {
              type: item.id,
              openid: loginRes.authResult.openid,
              nickname: userInfo.userInfo.nickName,
              avatar: userInfo.userInfo.avatarUrl,
            };
            this.otherLoginAction(provider)
              .then((res: { type: boolean; userBindId?: number }) => {
                if (!res.type) {
                  const userinfo = {
                    nickname: userInfo.userInfo.nickName,
                    avatar: userInfo.userInfo.avatarUrl,
                    openid: loginRes.authResult.openid,
                  };
                  uni.navigateTo({
                    url: `/pages/bind-email/bind-email?userInfo=${JSON.stringify(
                      userinfo,
                    )}&path=/pages/mine/mine&type=1&provider=${JSON.stringify(provider)}&userBindId=${res.userBindId}`,
                    fail: () => {
                      uni.showToast({ title: '登录失败,请重试' });
                    },
                  });
                }
              })
              .catch(() => {
                uni.showToast({ title: '登录失败,请重试' });
              });
          },
        });

        // console.log(res);
      },
      fail() {
        uni.showToast({ title: '获取登录通道失败,检查是否安装软件', icon: 'none' });
      },
    });
  }
  // 打开登录页面
  openLoginPage() {
    uni.navigateTo({ url: '/pages/login/login' });
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  .title {
    @include centered;
    font-size: $fontMini;
    line-height: 80rpx;
  }

  .methods {
    @include centered;
    box-sizing: border-box;
    /*#ifndef H5*/
    padding: 20rpx;
    /*#endif*/

    .iconfont {
      border-radius: 50%;
      background: #bbbbbb;
      @include centered;
      width: 110rpx;
      height: 110rpx;
      font-size: 55rpx;
      margin: 0 30rpx;
      color: #ffffff;
    }

    .icon-xinlangweibo {
      background: #fc7729;
    }
    .icon-weixin {
      background: #2bd19b;
    }
    .icon-QQ {
      background: #2caefc;
    }
  }

  .other-login {
    @include centered;
    width: 100%;
    height: 80rpx;
    font-size: $fontMini;
    /*#ifdef H5*/
    color: #0a98d5;
    /*#endif*/
    .icon-jinru {
      margin-top: 4rpx;
      font-size: $fontMini;
      color: #bbbbbb;
      /*#ifdef H5*/
      color: #0a98d5;
      /*#endif*/
    }
  }
}
</style>
