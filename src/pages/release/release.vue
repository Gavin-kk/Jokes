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
      <!-- 上传图片 -->
      <view class="select-img">
        <upload-img @imageListChange="imageListChange"></upload-img>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator';
import UniNavBar from '@dcloudio/uni-ui/lib/uni-nav-bar/uni-nav-bar.vue';
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';
import uniFilePicker from '@dcloudio/uni-ui/lib/uni-file-picker/uni-file-picker.vue';
import UploadImg from '@components/upload-img/upload-img.vue';

type Select = { id: number; name: string };

@Component({ components: { UploadImg, UniNavBar, uniIcons, uniFilePicker } })
export default class Release extends Vue {
  private currentSelectedIndex: number = 0;
  private selectList: Select[] = [
    { id: 2, name: '所有人可见' },
    { id: 3, name: '仅自己可见' },
  ];
  // 输入框输入的内容
  private inputValue: string = '';
  // 要上传的文件 blob 地址
  private imageBlobUrl: string[] = [];

  @Watch('imageBlobUrl')
  asdf(newList: any) {
    console.log(JSON.stringify(newList));
  }
  // 显示下拉框
  showSelectList(): void {
    const itemList: string[] = this.selectList.map((item) => item.name);
    // 显示选择框
    uni.showActionSheet({
      itemList,
      success: (res) => (this.currentSelectedIndex = res.tapIndex),
    });
  }

  imageListChange(imageList: string[]): void {
    this.imageBlobUrl = imageList;
  }

  // 返回
  comeBack(): void {
    uni.switchTab({
      url: '../home/home',
    });
  }
  // 发布动态
  publishNews(): void {
    uni.showToast({ title: '发布成功' });
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
    background: #ffffff;
    z-index: 100;
  }
}
.padding {
  padding: 20rpx;
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
</style>
