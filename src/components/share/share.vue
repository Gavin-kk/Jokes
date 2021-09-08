<template>
  <view>
    <view
      @tap.stop="touchShareMask"
      v-if="show"
      :class="['share-mask', 'animate__animated', animationBoxClassName]"
      :style="{ 'animation-duration': `${animationTime}ms` }"
    >
    </view>
    <view
      :class="['share', 'animate__animated', animationClassName]"
      :style="{ 'animation-duration': `${animationTime}ms` }"
    >
      <view class="title">分享到</view>
      <view class="center">
        <block v-for="item in sharingProvider" :key="item.iconClass">
          <view @tap="share(item)" class="item-box" hover-class="item-hover">
            <template v-if="isPYQ(item.name)">
              <view class="pyq">
                <image class="pyq-image" :src="item.iconClass" mode="aspectFit"></image>
              </view>
              <view class="text">{{ item.name }}</view>
            </template>
            <template v-else>
              <view class="item-box">
                <view :class="['iconfont', item.iconClass]"></view>
                <view class="text">{{ item.name }}</view>
              </view>
            </template>
          </view>
        </block>
      </view>
      <view class="cancel" @tap="touchShareMask" hover-class="cancel-click">取消</view>
    </view>
  </view>
</template>

<script lang="ts">
// 分享组件
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
// eslint-disable-next-line import/no-self-import
import { IArticleDetail } from '@pages/content/content.interface';
import { ArticleType } from '@pages/home/store';
import { ShareOptions } from './share';

export interface IShare {
  name: string;
  id: 'sinaweibo' | 'qq' | 'weixin';
  type?: string;
  iconClass: string;
  sort: number;
}

@Component({})
export default class Share extends Vue {
  @Prop({ type: Boolean, default: false })
  private isShow!: boolean;
  @Prop({ type: Boolean, default: false })
  private data!: IArticleDetail;
  private animationTime: number = 200;
  private show: boolean = false;
  // 分享提供商的数据
  private sharingProvider: IShare[] = [];
  // 分享类型
  private shareType: 0 | 2 | 1 | 3 | 4 | 5 = 0;
  // 分享内容
  private shareText: string = '1234';
  // 分享的图片
  private image: string = '/static/demo/userpic/.jpg';

  beforeUpdate() {
    switch (this.data.type) {
      case ArticleType.Graphic:
      case ArticleType.PlainText:
        this.shareType = this.data.type;
        break;
      case ArticleType.Share:
        this.shareType = this.data.share.type;
        break;
      case ArticleType.Video:
        this.shareType = 4;
        break;
      default:
    }
  }

  mounted() {
    this.getShareProvider();
  }

  // 获取分享提供商
  getShareProvider() {
    uni.getProvider({
      service: 'share',
      success: (data) => {
        const dataList: IShare[] = [];
        data.provider.forEach((item: string) => {
          switch (item) {
            case 'weixin':
              dataList.push({
                name: '微信好友',
                id: 'weixin',
                iconClass: 'icon-weixin',
                sort: 0,
              });
              dataList.push({
                name: '朋友圈',
                id: 'weixin',
                iconClass: '/static/icon-pyq.png',
                type: 'WXSenceTimeline',
                sort: 1,
              });
              break;
            case 'sinaweibo':
              dataList.push({
                name: '新浪微博',
                id: 'sinaweibo',
                iconClass: 'icon-xinlangweibo',
                sort: 2,
              });
              break;
            case 'qq':
              dataList.push({
                name: 'qq好友',
                id: 'qq',
                iconClass: 'icon-QQ',
                sort: 3,
              });
              break;
            default:
          }
        });
        this.sharingProvider = dataList.sort((a, b) => a.sort - b.sort);
      },
    });
  }

  // 分享
  async share(e: IShare) {
    console.log(`分享通道:${e.id}； 分享类型:${this.shareType}`);
    // #ifndef H5
    if (!this.shareText && (this.shareType === 1 || this.shareType === 0)) {
      uni.showModal({
        content: '分享内容不能为空',
        showCancel: false,
      });
      return;
    }

    if (!this.image && (this.shareType === 2 || this.shareType === 0)) {
      uni.showModal({
        content: '分享图片不能为空',
        showCancel: false,
      });
      return;
    }

    const shareOptions: ShareOptions = {
      provider: e.id,
      scene: e.type && e.type === 'WXSenceTimeline' ? 'WXSenceTimeline' : 'WXSceneSession', // WXSceneSession”分享到聊天界面，“WXSenceTimeline”分享到朋友圈，“WXSceneFavorite”分享到微信收藏
      type: this.shareType,
      success: (e: any) => {
        uni.showModal({
          content: '已分享',
          showCancel: false,
        });
      },
      fail: (e: any) => {
        uni.showModal({
          content: e.errMsg,
          showCancel: false,
        });
      },
      complete() {},
    };

    switch (this.shareType) {
      case 0:
        shareOptions.summary = this.data.content;
        shareOptions.imageUrl = this.data.pic;
        shareOptions.title = this.data.title;
        shareOptions.href = 'https://newin.top:8088';
        break;
      case 1:
        shareOptions.summary = this.data.content;
        break;
      case 4:
        shareOptions.imageUrl = this.data.video?.pic;
        shareOptions.mediaUrl = this.data.video?.videoUrl;
        shareOptions.title = this.data.title;
        /*        shareOptions.miniProgram = {
          id: 'gh_33446d7f7a26',
          path: '/pages/tabBar/component/component',
          webUrl: 'https://newin.top:8088',
          type: 0,
        }; */
        break;
      default:
        break;
    }
    // #ifdef APP-PLUS
    if (shareOptions.type === 0 && plus.os.name === 'iOS') {
      // 如果是图文分享，且是ios平台，则压缩图片
      (shareOptions.imageUrl as any) = await this.compress();
    }
    // #endif
    if (shareOptions.type === 1 && shareOptions.provider === 'qq') {
      // 如果是分享文字到qq，则必须加上href和title
      shareOptions.href = 'https://uniapp.dcloud.io';
      shareOptions.title = '欢迎体验uniapp';
    }
    uni.share(shareOptions);
    //  #endif
  }

  // 压缩图片
  compress() {
    // 压缩图片 图文分享要求分享图片大小不能超过20Kb
    const img = this.image;
    return new Promise((res) => {
      const localPath = plus.io.convertAbsoluteFileSystem(img.replace('file://', ''));
      // 压缩size
      plus.io.resolveLocalFileSystemURL(
        localPath,
        (entry: any) => {
          entry.file((file: any) => {
            // 可通过entry对象操作图片
            if (file.size > 20480) {
              // 压缩后size 大于20Kb
              plus.zip.compressImage(
                {
                  src: img,
                  dst: img.replace('.jpg', '2222.jpg').replace('.JPG', '2222.JPG'),
                  width: '10%',
                  height: '10%',
                  quality: 1,
                  overwrite: true,
                },
                (event) => {
                  const newImg = img.replace('.jpg', '2222.jpg').replace('.JPG', '2222.JPG');
                  res(newImg);
                },
                (error) => {
                  uni.showModal({
                    content: '分享图片太大,需要请重新选择图片!',
                    showCancel: false,
                  });
                },
              );
            }
          });
        },
        (e) => {
          uni.showModal({
            content: '分享图片太大,需要请重新选择图片!',
            showCancel: false,
          });
        },
      );
    });
  }

  touchShareMask() {
    this.$emit('touchShareMask');
  }

  @Watch('isShow')
  watchIsShow(newIsShow: boolean) {
    // 通过判断新值是否为false 也就是判断是否要是要退出
    // 如果是要退出的话等200ms 等动画完成后再让整个组件不显示
    if (!newIsShow) {
      setTimeout(() => {
        this.show = newIsShow;
      }, this.animationTime);
    } else {
      this.show = newIsShow;
    }
  }

  // 判断是否是 朋友圈
  get isPYQ(): (name: string) => boolean {
    return (name: string) => name === '朋友圈';
  }

  get animationClassName(): string {
    return this.isShow ? 'animate__fadeInUp' : 'animate__fadeOutDownBig';
  }

  get animationBoxClassName(): string {
    // 必须判断isShow 因为 show 是延迟的 当延迟的 show 变为 false 时同时整个组件也都不显示了 动画没有时间播放
    return this.isShow ? 'animate__fadeIn' : 'animate__fadeOut';
  }
}
</script>

<style lang="scss" scoped>
.share-mask {
  position: fixed;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
.share {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 750rpx;
  background: #ffffff;
  z-index: 100;

  .title {
    @include centered;
    height: 100rpx;
    width: 100%;
    font-size: 32rpx;
  }

  .center {
    display: flex;

    .item-box {
      @include centered;
      flex-direction: column;
      flex: 1;

      .text {
        font-size: 30rpx;
        line-height: 60rpx;
      }

      .pyq {
        @include centered;
        width: 100rpx;
        height: 100rpx;
        background: #514d4c;
        border-radius: 50%;
        .pyq-image {
          width: 70%;
          height: 70%;
        }
      }
      .copy {
        @include centered;
        width: 100rpx;
        height: 100rpx;
        background: #ffffff;
        box-sizing: border-box;
        border: 1px solid #cccccc;
        border-radius: 50%;
        .pyq-image {
          width: 70%;
          height: 70%;
        }
      }

      .iconfont {
        @include centered;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        font-size: 65rpx;
        color: #ffffff;
      }

      .icon-weixin {
        background: #2ad19b;
      }

      .icon-xinlangweibo {
        background: #ee5e5e;
      }

      .icon-QQ {
        background: #5280ce;
      }
    }

    .item-hover {
      background: #eeeeee;
    }
  }

  .cancel {
    @include centered;
    height: 100rpx;
    width: 100%;
    font-size: 32rpx;
  }
  .cancel-click {
    background: #bbbbbb;
  }
}
</style>
