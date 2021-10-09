<template>
  <view>
    <view :class="['box', 'animate__animated', startAndEndAnimation]" style='animation-duration: 200ms' v-show='isShow'>
      <view class='title'>
        <view @tap='close'>取消</view>
        <view class='title-right' @tap='complete'>完成</view>
      </view>
      <view class='content'>
        <view class='m-list'>
          <block v-for='(item, index) in list' :key='index'>
            <view class='swiper-box-m animate__animated'>
              <swiper
                :class="['swiper-m', 'animate__animated', animationClassName]"
                style='animation-duration: 200ms'
                :display-multiple-items='3'
                vertical
                @change='swiperChange(index, $event)'
                :current='list[index].currentSelectedIndex'
              >
                <swiper-item>
                  <view class='item'></view>
                </swiper-item>
                <block v-for='(itemx, indey) in item.list' :key='itemx.placeName'>
                  <swiper-item>
                    <view
                      @tap='changeCurrentSelected(indey, index)'
                      :class="['item', { active: item.currentSelectedIndex === indey }]"
                    >
                      {{ itemx.placeName }}
                      <view class='loading-box' v-if='itemx.loading'>
                        <image
                          class='loading'
                          src='/static/loading.png'
                          mode='aspectFit'
                          :style='{ transform: `rotate(${loadingRotationDegree}deg)` }'
                        ></image>
                      </view>
                    </view>
                  </swiper-item>
                </block>
                <swiper-item>
                  <view class='item'></view>
                </swiper-item>
              </swiper>
            </view>
          </block>
        </view>
      </view>
    </view>
    <view
      :class="['mask', 'animate__animated', maskAnimation]"
      @tap='close'
      v-show='isShow'
      style='animation-duration: 200ms'
    ></view>
  </view>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getProvincesAndCitiesRequest } from '@services/common.request';

export interface ICityList {
  id: number;
  placeName: string;
  loading: boolean;
}

export interface IWrapper {
  currentSelectedIndex: number; // 当前list中选择的index
  list: ICityList[];
}

// loading 旋转的定时器
let loadingTimer: number | undefined;
@Component({})
export default class CascadeSelection extends Vue {
  // 整个组件是否显示
  @Prop(Boolean)
  private componentIsShow!: boolean;

  // 组件内的componentIsShow
  private isShow: boolean = false;

  @Watch('componentIsShow')
  watchComponentIsShow(newShow: boolean) {
    if (!newShow) {
      setTimeout(() => {
        this.isShow = newShow;
      }, 200);
    } else {
      this.isShow = newShow;
    }
  }

  // loading 的旋转度数
  private loadingRotationDegree: number = 0;

  // 是否启动动画 通过开关此属性来达到开启动画的效果
  private whetherToStartAnimation: boolean = false;

  private list: IWrapper[] = [];

  async created() {
   await this.getData();
   await this.getData(this.list[0].list[0].id);
  }

  async getData(id: number = 1, index?: number): Promise<boolean> {
    const result = await getProvincesAndCitiesRequest(id);
    if (typeof index === 'number') {
      // 如果点击的是省 去除后边的市
      this.list.splice(index + 1);
      if (this.list[index + 1]?.list.length > 0 && result.data.data[0].id === this.list[index + 1]?.list[0]?.id) {
        return false;
      }
    }
    if (result.data.data.length === 0) return false;
    const list:ICityList[] = result.data.data.map((item) => ({ ...item, loading: false }));
    this.list.push({ currentSelectedIndex: 0, list });
    return true;
  }

  // swiper change 事件
  swiperChange(index: number, e: { detail: { current: number } }) {
    this.list[index].currentSelectedIndex = e.detail.current;
    this.getData(this.list[index].list[e.detail.current].id, index);
  }

  // 点击切换当前选择
  async changeCurrentSelected(index: number, pIndex: number) {
    // 让 loading 旋转起来
    this.list[pIndex].list[index].loading = true;
    // 切换当前选择
    this.list[pIndex].currentSelectedIndex = index;
    this.rotatingLoading();
    // 开启动画
    this.whetherToStartAnimation = true;
    // 获取数据
    const whetherToShowAnimation: boolean = await this.getData(this.list[pIndex].list[index].id, pIndex);
    if (whetherToShowAnimation && this.list.length < 3) {
      // 等动画完毕 关闭动画
      setTimeout(() => {
        this.whetherToStartAnimation = false;
      }, 200);
    }
    // 取到数据 loading 停止
    this.list[pIndex].list[index].loading = false;
    // 停止定时器
    clearInterval(loadingTimer);
  }

  // 动loading旋转
  rotatingLoading() {
    this.loadingRotationDegree += 360;
    loadingTimer = setInterval(() => {
      this.loadingRotationDegree += 360;
    }, 500);
  }

  // 选择完毕 提交选择
  complete() {
    let str: string = '';
    this.list.forEach((item) => {
      str += `-${item.list[item.currentSelectedIndex].placeName}`;
    });
    str = str.replace('-', '');
    this.$emit('complete', str);
  }

  // 关闭组件
  close() {
    this.$emit('cascadeClose');
  }

  get animationClassName(): string {
    return this.whetherToStartAnimation ? 'animate__fadeInRight' : '';
  }

  // 控制开始动画和结束动画的计算属性
  get startAndEndAnimation(): string {
    return this.componentIsShow ? 'animate__fadeInUp' : 'animate__fadeOutDown';
  }

  //  蒙版的动画
  get maskAnimation(): string {
    return this.componentIsShow ? 'animate__fadeIn' : 'animate__fadeOut';
  }
}
</script>

<style lang='scss' scoped>
.box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border: 1px solid #cccccc;
  background: #ffffff;
  z-index: 2;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    box-sizing: border-box;
    padding: 0 30rpx;
    font-size: 32rpx;
    border-bottom: 1px solid #e9e8e8;

    .title-right {
      color: #007aff;
    }
  }

  .content {
    position: relative;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 500rpx;
    //height: 600rpx;

    .m-list {
      position: relative;
      display: flex;
      height: 350rpx;
      width: 100%;
      z-index: 30;

      &:after {
        content: '';
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-70%);
        border-top: 1px solid #e9e8e8;
        border-bottom: 1px solid #e9e8e8;
        width: 100%;
        height: 100rpx;
        z-index: -1;
      }

      .swiper-box-m {
        height: 100%;
        flex: 1;
      }

      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30rpx;
        height: 100rpx;
        color: #adadad;

        .loading-box {
          display: flex;
          justify-content: center;
          align-items: center;

          .loading {
            width: 25rpx;
            height: 25rpx;
            margin-left: 10rpx;
            transition: all 0.5s;
            transform-origin: center;
            /*#ifdef H5*/
            margin-top: 3rpx;
            /*#endif*/
          }
        }
      }

      .active {
        color: #000000;
      }
    }
  }
}

.mask {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
</style>
