<template>
  <view>
    <!-- 导航栏-->
    <uni-nav-bar :status-bar="true">
      <view class="dropDown">
        <view class="select-box">
          <view class="selected-title" @tap="showSelectList">
            {{ selectList[currentSelectedIndex].name }}
          </view>
        </view>
        <view class="iconfont icon-xialazhankai"></view>
      </view>
      <view slot="left" @tap="comeBack">
        <view>
          <uni-icons color="#000" type="back" size="24" />
        </view>
      </view>
      <view slot="right" @tap="publishNews">
        <view> 发布 </view>
      </view>
    </uni-nav-bar>
    <view class="padding">
      <!-- 输入框 -->
      <view class="inputBox">
        <textarea v-model="inputValue" placeholder="说点什么吧~"></textarea>
      </view>
      <template v-if="isVideo">
        <!--        视频的预览-->
        <view class="video-box" v-if="videoIsExists">
          <video class="video" :src="videoUrl" :poster="videoPic"></video>
        </view>
        <!--        视频上传的loading-->
        <view v-if="uploadVideoLoading">
          <view class="upload-progress">
            <round-schedule-progress :progress="uploadVideUploadProgress" />
          </view>
        </view>
      </template>
      <template v-else>
        <!-- 上传图片 -->
        <view class="select-img">
          <upload-img @imageListChange="imageListChange"></upload-img>
        </view>
      </template>
    </view>
    <!--选择内容所属分类-->
    <view class="select-article-classify"> 文章分类 </view>
    <view class="select-article-classify"> 话题分类 </view>
    <!--  选择发布本文章时的地区-->
    <view class="address-select">
      <view class="left">
        <image src="/static/location.png" mode="aspectFit" class="location-icon"></image>
        <view class="loading-box">
          <loading :loading="loading" class="loading"></loading>
        </view>
        <view :class="[{ horizontalLine: !position }, 'address']" @tap="reacquireLocation">{{
          geographicLocation
        }}</view>
      </view>
      <view class="right" @tap="switchPosition">
        <view class="ball" :style="{ transform: `translateX(${animationSlider})` }"></view>
      </view>
    </view>
    <view>
      <popup :show="show" @confirm="confirm"></popup>
    </view>
    <view class="bottom" @tap="releaseTypeChange"> {{ releaseType }} </view>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';
import uniFilePicker from '@dcloudio/uni-ui/lib/uni-file-picker/uni-file-picker.vue';
import UploadImg from '@components/upload-img/upload-img.vue';
import Popup from '@components/popup/popup.vue';
import { ArticleType } from '@store/module/home';
import Loading from '@components/loading/loading.vue';
import { IResponse } from '@services/interface/response.interface';
import RoundScheduleProgress from '@components/round-schedule-progress/round-schedule-progress.vue';
import { deleteUploadVideo } from '@services/release.request';

type Select = { id: number; name: string };
let timer: number | undefined;
@Component({ components: { RoundScheduleProgress, Loading, Popup, UploadImg, UniNavBar, uniIcons, uniFilePicker } })
export default class Release extends Vue {
  private currentSelectedIndex: number = 0;
  private selectList: Select[] = [
    { id: 2, name: '所有人可见' },
    { id: 3, name: '仅自己可见' },
  ];
  // 获取位置的loading
  private loading: boolean = true;
  // 输入框输入的内容
  private inputValue: string = '';
  // 要上传的文件 blob 地址
  private imageBlobUrl: string[] = [];
  // 是否显示警告提示框
  private show: boolean = false;
  // 是否不可以返回
  private isReturns: boolean = true;
  // 是否发送位置
  private position: boolean = false;
  // 通过经纬度获取的地理位置
  private geographicLocation: string = '';
  // 视频地址
  private videoUrl: string = '';
  // 视频封面地址
  private videoPic: string = '';
  // 是否是在上传视频 用于显示loading状态
  private isVideo: boolean = false;
  // 上传视频的loading
  private uploadVideoLoading: boolean = false;
  // 视频上传的进度
  private uploadVideUploadProgress: number = 0;

  get animationSlider() {
    return this.position ? '100%' : '0';
  }
  get releaseType(): string {
    return this.videoUrl === '' ? '发布视频' : '发布图片';
  }
  // 判断视频是否存在 或
  get videoIsExists(): boolean {
    return this.videoUrl !== '';
  }

  created() {
    this.getLocation();
  }

  getLocation() {
    timer = setTimeout(() => {
      uni.showToast({ title: '地址获取失败', icon: 'none' });
      this.geographicLocation = '地址获取失败';
      this.loading = false;
    }, 5000);
    // uni.getLocation({
    //   success: async ({ latitude, longitude }) => {
    //     const result: any = await getAddressByLatitudeAndLongitudeRequest({ latitude, longitude });
    //     this.geographicLocation = `${result.data.addressComponent.city}-${result.data.addressComponent.district}`;
    //     this.loading = false;
    //     clearInterval(timer);
    //   },
    // });
  }
  // 发布视频或发布图片
  async releaseTypeChange() {
    if (this.releaseType === '发布图片' && this.videoUrl) {
      // uni.showToast({ title: '请删除视频以切换发布图片', icon: 'none' });
      // 删除的图片名称;
      const urlArr = this.videoUrl.split('/');
      // 发送删除请求
      await deleteUploadVideo(urlArr[urlArr.length - 1]);
      this.videoUrl = '';
      this.isVideo = false;
      return;
    }
    if (this.releaseType === '发布视频') {
      const itemList: string[] = ['拍视频', '选视频'];
      try {
        const sourceType: string = await new Promise((resolve, reject) => {
          uni.showActionSheet({
            itemList,
            alertText: '请选择视频类型',
            success: (res) => {
              resolve(itemList[res.tapIndex]);
            },
            fail() {
              reject();
            },
          });
        });

        uni.chooseVideo({
          maxDuration: 60,
          sourceType: [sourceType],
          success: (res) => {
            if (res.size > 10485760) {
              uni.showToast({ title: '文件太大了,视频限制10M哦,换个别的吧', icon: 'none' });
              return;
            }
            this.uploadVideoLoading = true;
            this.isVideo = true;
            // 发送视频上传请求
            const uploadVideo = uni.uploadFile({
              name: 'video',
              url: 'http://localhost:5000/api/v1/upload/video',
              fileType: 'video',
              file: res.tempFile,
              header: {
                Authorization: `Bearer ${uni.getStorageSync('_token')}`,
              },
              success: (uploadRes) => {
                const videoUrl: IResponse<{ success: { coverUrl: string; videoUrl: string }[] }> = JSON.parse(
                  uploadRes.data,
                );
                if (videoUrl.message === '文件大小超出限制') {
                  uni.showToast({ title: videoUrl.message, icon: 'none' });
                  this.isVideo = false;
                  this.videoUrl = '';
                  return;
                }
                this.uploadVideoLoading = false;
                uni.hideLoading();
                this.videoUrl = videoUrl.data.success[videoUrl.data.success.length - 1].videoUrl;
                this.videoPic = videoUrl.data.success[videoUrl.data.success.length - 1].coverUrl;
              },
              fail: () => {
                uni.showToast({ title: '上传错误', icon: 'none' });
              },
            });
            uploadVideo.onProgressUpdate((r) => {
              this.uploadVideUploadProgress = r.progress;
              if (r.progress === 100) {
                uni.showLoading({ title: '视频正在转码中,请稍候', mask: true });
                this.uploadVideoLoading = false;
                this.uploadVideUploadProgress = 0;
              }
            });
          },
        });
        // eslint-disable-next-line no-empty
      } catch (err) {}
    }
  }

  // 显示下拉框
  showSelectList() {
    const itemList: string[] = this.selectList.map((item) => item.name);
    // 显示选择框
    uni.showActionSheet({
      itemList,
      success: (res) => (this.currentSelectedIndex = res.tapIndex),
    });
  }
  // 从新获取位置
  reacquireLocation() {
    this.geographicLocation = '';
    this.loading = true;
    this.getLocation();
  }

  switchPosition() {
    if (this.geographicLocation === '地址获取失败') {
      uni.showToast({ title: '地址获取失败', icon: 'none' });
      return;
    }
    this.position = !this.position;
  }

  imageListChange(imageList: string[]) {
    this.imageBlobUrl = imageList;
  }

  // 用户点击提示框确认
  confirm() {
    this.show = false;
  }

  // 返回
  comeBack(): void {
    uni.navigateBack({
      delta: 1,
    });
  }

  // 发布动态
  publishNews(): void {
    let type: ArticleType | null = null;
    switch (true) {
      case this.imageBlobUrl.length !== 0 && this.inputValue !== '':
        type = ArticleType.Graphic;
        break;
      case this.imageBlobUrl.length === 0 && this.inputValue !== '':
        // 纯文
        type = ArticleType.PlainText;
        break;
      case this.videoUrl !== '' && this.inputValue !== '':
        type = ArticleType.Video;
        break;
      default:
    }
    // if()
    uni.showToast({ title: '发布成功' });
  }

  // 监听 uni.navigateBack 的返回事件 如果返回为true 则不跳转 false 为返回
  onBackPress(): boolean {
    if (!this.imageBlobUrl.length && !this.inputValue.length) {
      return false;
    }

    if (this.isReturns) {
      uni.showModal({
        content: '是否保存为草稿',
        confirmText: '保存',
        cancelText: '不保存',
        success: (res) => {
          this.isReturns = false;
          if (res.confirm) {
            uni.showToast({ title: '保存' });
          } else {
            uni.showToast({ title: '不保存' });
          }
          uni.navigateBack({
            delta: 1,
          });
        },
      });
    }
    return this.isReturns;
  }
}
</script>

<style lang="scss" scoped>
@import 'src/common/style/global';

.dropDown {
  @include centered;
  width: 100%;
  height: 100%;

  .select-box {
    position: relative;
    z-index: 100;
  }
}
.padding {
  padding: 20rpx;

  .video-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 500rpx;

    .video {
      width: 100%;
      height: 100%;
    }
  }

  .upload-loading-box {
    width: 100rpx;
    height: 100rpx;
    background: #0a98d5;
  }
}

.inputBox {
  box-sizing: border-box;
  width: 100%;
}

.select-img {
  margin-top: 25rpx;
  width: 100%;

  .select-img-title {
    @include bothSides;
    font-size: 32rpx;

    .select-img-title-right {
      color: #cccccc;
    }
  }
}
.address-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100rpx;
  padding: 20rpx;
  box-sizing: border-box;

  .left {
    position: relative;
    display: flex;

    .loading-box {
      position: absolute;
      left: 80rpx;
      top: 50%;
      transform: translate(0, -50%);

      .loading {
        width: 30rpx;
        height: 30rpx;
      }
    }

    &:after {
      content: '';
      position: absolute;
    }
    .location-icon {
      width: 50rpx;
      height: 50rpx;
    }
    .address {
      font-size: 30rpx;
    }
    .horizontalLine {
      text-decoration: line-through;
    }
  }
  .right {
    width: 100rpx;
    height: 50rpx;
    border-radius: 30rpx;
    border: 1px solid rgba(2, 2, 2, 0.2);
    .ball {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50rpx;
      width: 50rpx;
      background: #ffc055;
      border-radius: 50%;
      transition: all 0.3s;
      transform: translateX(0);

      &:after {
        content: '';
        width: 35rpx;
        height: 35rpx;
        background: #ffffff;
        border-radius: 50%;
      }
    }
  }
}

.bottom {
  @include centered;
  position: absolute;
  bottom: 0;
  background: rgb(255, 192, 85);
  border-radius: 10rpx 10rpx 0 0;
  overflow: hidden;
  width: 100%;
  height: 100rpx;
  font-size: 30rpx;
}

.upload-progress {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
