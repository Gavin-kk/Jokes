<template>
  <view>
    <!-- 导航栏-->
    <uni-nav-bar :status-bar="true">
      <view class="dropDown">
        <view class="select-box">
          <view class="selected-title" @tap="showSelectList">
            {{ selectList[currentSelectedIndex] }}
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
          <upload-img @imageListChange="imageListChange" :cache.sync="imageCache"></upload-img>
        </view>
      </template>
    </view>
    <!--选择内容所属分类-->
    <template v-if="articleOrTopic">
      <view class="select-article-classify" @tap="openSelectClassify">
        <image src="/static/icon-dianyu.png" class="select-article-classify-icon"></image>
        <text>{{ selectedClassifyTitle }} </text>
      </view>
    </template>
    <template v-else>
      <view class="select-article-classify" @tap="openSelectClassify">
        <image src="/static/icon-dianyu.png" class="select-article-classify-icon"></image>
        <text>{{ selectedTopicDataTitle }} </text>
      </view>
    </template>
    <!--  选择发布本文章时的地区-->
    <view class="address-select">
      <view class="left">
        <image src="/static/location.png" mode="aspectFit" class="location-icon"></image>
        <view class="loading-box">
          <loading :loading="loading" class="loading"></loading>
        </view>
        <view :class="[{ horizontalLine: !position }, 'address']" @tap="reacquireLocation">
          {{ geographicLocation }}
        </view>
      </view>
      <view class="right" @tap="switchPosition">
        <view class="ball" :style="{ transform: `translateX(${animationSlider})` }"></view>
      </view>
    </view>
    <view>
      <popup :show="show">
        <view class="popup-box">
          <view class="m-img-box">
            <image class="img" src="/static/bullet-frame-icon.png" mode="aspectFit"></image>
          </view>
          <view class="text">1. 涉及黄色,政治,广告及骚扰信息</view>
          <view class="text">2. 涉及人身攻击</view>
          <view class="text">3. 留联系方式,透露他人隐私</view>
          <view class="text">一经核实将被封禁, 情节严重者永久封禁</view>
          <view class="realize" @tap="confirm">我知道了</view>
          <view class="placeholder"></view>
        </view>
      </popup>
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
import { ArticleType, IClassify } from '@pages/home/store';
import Loading from '@components/loading/loading.vue';
import { IResponse } from '@services/interface/response.interface';
import RoundScheduleProgress from '@components/round-schedule-progress/round-schedule-progress.vue';
import { deleteUploadVideo, postArticleRequest } from '@services/release.request';
import { namespace } from 'vuex-class';
import { ITopic } from '@pages/moment/store';
import { getAddressByLatitudeAndLongitudeRequest } from '@services/common.request';
import { UPLOAD_VIDEO_URL } from '@common/constant/upload-path.constant';

export const enum ArticleTypeEnum {
  article,
  topic,
}

export interface PublishDto {
  // @ApiProperty({ description: '文章内容' })
  content: string;
  // @ApiProperty({ description: '文章的图片', required: false })
  contentImg?: string[];
  // @ApiProperty({ description: '隐私状态 0所有人可见 1 仅自己可见' })
  privacyStatus: 0 | 1;
  // @ApiProperty({ description: '文章的类型 0 代表图文 1代表纯文字 2代表分享 3视频' })
  type: ArticleType;
  // @ApiProperty({ description: '当type等于3时 此项必填 视频的url' })
  videoUrl?: string;
  // @ApiProperty({ description: '当type等于3时 此项必填 视频的封面' })
  videoPic?: string;
  // @ApiProperty({ description: '文章分类的id', required: false })
  ACId?: number;
  // @ApiProperty({ description: '文章所属的分类 0 代表文章分类 1 代表话题分类' })
  isTopic?: ArticleTypeEnum;
  // @ApiProperty({
  //   description: '话题分类的id 文章如果属于话题分类 则此参数必须传递',
  // })
  topicId?: number;
  // @ApiProperty({
  //   description: '发布文章时所在的地理位置 如果用户选择隐藏就发送 在某个不知名的地方',
  // })
  address?: string;
  // @ApiProperty({
  //   description: '引用文章的id 可以为空 number类型',
  //   required: false,
  // })
  shareId?: number;
}

let timer: number | undefined;
const HomeModule = namespace('homeModule');
@Component({ components: { RoundScheduleProgress, Loading, Popup, UploadImg, UniNavBar, uniIcons, uniFilePicker } })
export default class Release extends Vue {
  @HomeModule.State('classifyList')
  private classifyList!: IClassify[];
  // 当前选择的隐私状态的索引
  private currentSelectedIndex: number = 0;
  // 隐私状态
  private selectList: string[] = ['所有人可见', '仅自己可见'];
  // 获取位置的loading
  private loading: boolean = true;
  // 输入框输入的内容
  private inputValue: string = '';
  // 要上传的文件服务器url地址
  private imageUrl: string[] = [];
  // 是否显示警告提示框
  private show: boolean = true;
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
  // 文章的类型 可以是article或topic
  private articleType: ArticleTypeEnum = ArticleTypeEnum.article;
  // 选中文章分类数据
  private selectedClassify: IClassify | Record<string, unknown> = {};
  // 选中的话题数据
  private selectedTopicData: ITopic | Record<string, unknown> = {};
  // 图片缓存
  private imageCache: string[] = [];

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

  // 判断请求 文章分类还是话题分类 页面显示话题分类还是文章分类
  get articleOrTopic(): boolean {
    return this.articleType === ArticleTypeEnum.article;
  }

  get selectedTopicDataTitle(): string {
    return (this.selectedTopicData.title as string) || '选择话题分类';
  }

  get selectedClassifyTitle(): string {
    return (this.selectedClassify.title as string) || '选择文章分类';
  }

  created() {
    const cache: Record<string, any> = uni.getStorageSync('release');
    // 读取并设置缓存
    Object.keys(cache).forEach((item) => {
      (this as any)[item] = cache[item];
    });

    this.getLocation();
    this.getPage();
  }

  onShow() {
    uni.$on('selectedTopic', (data: ITopic) => {
      this.selectedTopicData = data;
    });
    uni.$on('selectedClassify', (data: IClassify) => {
      this.selectedClassify = data;
    });
  }

  // 发布动态
  async publishNews() {
    if (!this.checkInput()) return;

    const publishDto: PublishDto = {
      content: this.inputValue,
      privacyStatus: this.currentSelectedIndex as 0 | 1,
      type: ArticleType.PlainText,
      address:
        !!this.geographicLocation && this.geographicLocation !== '地址获取失败' && this.position
          ? this.geographicLocation
          : undefined,
    };
    if (this.articleType === ArticleTypeEnum.article) {
      publishDto.ACId = this.selectedClassify.id as number;
    } else {
      publishDto.topicId = this.selectedTopicData.id as number;
      publishDto.isTopic = ArticleTypeEnum.topic;
    }

    switch (true) {
      case this.imageUrl.length !== 0 && this.inputValue !== '':
        publishDto.contentImg = this.imageUrl;
        publishDto.type = ArticleType.Graphic;
        break;
      case this.videoUrl !== '' && this.inputValue !== '':
        publishDto.videoPic = this.videoPic;
        publishDto.videoUrl = this.videoUrl;
        publishDto.type = ArticleType.Video;
        break;
      case this.imageUrl.length === 0 && this.inputValue !== '' && this.videoUrl === '' && this.videoPic === '':
        // 纯文
        publishDto.type = ArticleType.PlainText;
        break;
      default:
    }
    try {
      await postArticleRequest(publishDto);
      uni.showToast({ title: '发布成功' });
      this.isReturns = false;
      // 清除缓存
      uni.removeStorage({ key: 'release' });
      uni.navigateBack({ delta: 1 });
    } catch ({ response }) {
      console.log(response);
    }
  }

  checkInput(): boolean {
    if (this.inputValue === '') {
      uni.showToast({ title: '说点什么吧', icon: 'none' });
      return false;
    }
    if (this.articleType === ArticleTypeEnum.article && !this.selectedClassify.id) {
      uni.showToast({ title: '请选择文章分类', icon: 'none' });
      return false;
    }
    if (this.articleType === ArticleTypeEnum.topic && !this.selectedTopicData.id) {
      uni.showToast({ title: '请选择话题分类', icon: 'none' });
      return false;
    }
    return true;
  }

  // 获取当前是那一页跳转来的 用于判断显示是属于文章列表还是属于话题列表
  getPage() {
    const pages: any = getCurrentPages();
    const {
      options: { type },
    }: { options: { type: string } } = pages[pages.length - 1];
    if (+type !== ArticleTypeEnum.article) {
      this.articleType = ArticleTypeEnum.topic;
    }
  }

  // 打开选择话题或文章分类列表
  openSelectClassify() {
    uni.navigateTo({ url: `/pages/select-classify/select-classify?type=${this.articleType}` });
  }

  getLocation() {
    timer = setTimeout(() => {
      uni.showToast({ title: '地址获取失败', icon: 'none' });
      this.geographicLocation = '地址获取失败';
      this.loading = false;
    }, 5000);
    uni.getLocation({
      success: async ({ latitude, longitude }) => {
        const result: any = await getAddressByLatitudeAndLongitudeRequest({ latitude, longitude });
        this.loading = false;
        clearInterval(timer);
        if (!result.data.addressComponent.city.length || !result.data.addressComponent.district.length) {
          this.geographicLocation = '地址获取失败';
          return;
        }
        this.geographicLocation = `${result.data.addressComponent.city}-${result.data.addressComponent.district}`;
      },
    });
  }

  // 发布视频或发布图片
  async releaseTypeChange() {
    if (this.releaseType === '发布图片' && this.videoUrl) {
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
              url: UPLOAD_VIDEO_URL,
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
                this.videoUrl = videoUrl.data.success[videoUrl.data.success.length - 1].videoUrl;
                this.videoPic = videoUrl.data.success[videoUrl.data.success.length - 1].coverUrl;
                console.log(videoUrl.data.success[videoUrl.data.success.length - 1].videoUrl);
                uni.hideLoading();
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
    // 显示选择框
    uni.showActionSheet({
      itemList: this.selectList,
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
    this.imageUrl = imageList;
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

  // 监听 uni.navigateBack 的返回事件 如果返回为true 则不跳转 false 为返回
  onBackPress(): boolean {
    if (!this.imageUrl.length && !this.inputValue.length) {
      return false;
    }

    if (this.isReturns) {
      uni.showModal({
        content: '是否保存为草稿, 注意图片视频都不能保存哦',
        confirmText: '保存',
        cancelText: '不保存',
        success: (res) => {
          this.isReturns = false;
          if (res.confirm) {
            uni.setStorage({
              key: 'release',
              data: {
                currentSelectedIndex: this.currentSelectedIndex,
                inputValue: this.inputValue,
                imageUrl: this.imageUrl,
                imageCache: this.imageUrl,
                videoUrl: this.videoUrl,
                videoPic: this.videoPic,
                isVideo: this.isVideo,
                selectedClassify: this.selectedClassify,
                selectedTopicData: this.selectedTopicData,
              },
            });
          } else {
            uni.removeStorage({ key: 'release' });
          }
          uni.navigateBack({
            delta: 1,
          });
        },
      });
    } else {
      uni.removeStorage({ key: 'release' });
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
  border-bottom: 1px solid $borderColor;

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
      width: 40rpx;
      height: 40rpx;
      margin-right: 10rpx;
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
  background: #ffe934;
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

.select-article-classify {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100rpx;
  box-sizing: border-box;
  padding: 20rpx;
  font-size: 30rpx;
  border-top: 1px solid $borderColor;
  border-bottom: 1px solid $borderColor;
  .select-article-classify-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 10rpx;
  }
}

.popup-box {
  width: 650rpx;
  height: 650rpx;
  background: #ffffff;
  border-radius: 10rpx;
  box-sizing: border-box;
}
.m-img-box {
  width: 100%;
  height: 200rpx;
  padding: 25rpx 0;
  .img {
    width: 100%;
    height: 100%;
  }
}
.text {
  width: 100%;
  padding: 10rpx 20rpx;
  font-size: 30rpx;
}

.realize {
  box-sizing: border-box;
  @include centered;
  width: 600rpx;
  height: 100rpx;
  margin: 20rpx 25rpx;
  background: #ffe934;
}

.placeholder {
  height: 20rpx;
}
</style>
