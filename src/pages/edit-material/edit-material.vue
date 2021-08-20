<template>
  <view>
    <!--    导航栏-->
    <nav-bar title="资料编辑" :page-path="comeBackPath" />
    <view class="list">
      <edit-material-item :avatar="formData.avatar" title="头像" @clickRight="changeAvatar" />
      <edit-material-item :options="userInfo.nickname" is-input title="昵称" @blur="editNicknameBlur" />
      <edit-material-item :options="genderCalculation" title="性别" @clickRight="changeOptions('gender')" />
      <edit-material-item title="生日" is-use-slot>
        <picker mode="date" :value="formData.birthday" :end="currentTime" @change="datePickerChange">
          {{ formData.birthday }}
        </picker>
      </edit-material-item>
      <edit-material-item :options="formData.emotion" title="情感" @clickRight="changeOptions('emotion')" />
      <edit-material-item :options="formData.job" title="职业" @clickRight="changeOptions('job')" />
      <edit-material-item title="家乡" is-use-slot>
        <view @tap="changeHometown" style="font-size: 30rpx">{{ formData.hometown }}</view>
        <cascade-selection
          @complete="citySelectionCompleted"
          :component-is-show="regionSelectionComponentIsShow"
          @cascadeClose="citySelectionCompletedClose"
        />
      </edit-material-item>
    </view>
    <button @tap="submit" class="btn">完成</button>
  </view>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import UniDataPicker from '@dcloudio/uni-ui/lib/uni-data-picker/uni-data-picker.vue';
import NavBar from '@components/nav-bar/nav-bar.vue';
import EditMaterialItem from '@pages/edit-material/components/edit-material-item/edit-material-item.vue';
import moment from 'moment';
import CascadeSelection from '@components/cascade-selection/cascade-selection.vue';
import CheckLoginMixin from '@src/mixins/check-login.mixin';
import { namespace } from 'vuex-class';
import { IUser } from '@store/module/user';
import lodash from 'lodash';
import { editUserInfoRequest } from '@services/user.request';
import { IResponse, IUploadResponse } from '@src/services/interface/response.interface';
import { UPLOAD_IMAGE_URL } from '@common/constant/upload-path.constant';

export interface IEditMaterialSubmit {
  avatar: string;
  nickname: string;
  gender: number;
  age: number;
  emotion: string;
  job: string;
  birthday: string;
  hometown: string;
}

moment.locale('zh-cn');

// 性别选择弹出层 list
const genderSelectionList: string[] = ['男', '女', '保密'];
// 情感list
const emotionalChoiceList: string[] = ['已婚', '未婚', '保密'];
// 职业选择列表
const careerChoiceList: string[] = ['技术', '产品', '运营', '市场', '人事', '财务', '行政'];

const UserModule = namespace('userModule');
@Component({
  components: { CascadeSelection, EditMaterialItem, NavBar, UniDataPicker },
})
export default class EditMaterial extends Mixins(CheckLoginMixin) {
  @UserModule.State('userInfo')
  private readonly userInfo!: IUser;

  // 页面点击返回返回的页面
  private comeBackPath: string = '/pages/settings/settings';

  // 要提交的表单集合
  private formData: IEditMaterialSubmit = {
    avatar: '',
    nickname: '',
    gender: 2,
    age: 0,
    birthday: '',
    emotion: '',
    job: '',
    hometown: '',
  };
  // 级联选择组件是否显示
  private regionSelectionComponentIsShow: boolean = false;
  private currentTime: string = moment().format('YYYY-MM-DD');

  // 计算性别
  get genderCalculation(): string {
    return genderSelectionList[this.formData.gender];
  }

  created() {
    this.formatUserInfo();
    this.getPageOptions();
  }

  // 格式化个人的信息 赋值给表单数据
  formatUserInfo() {
    if (!lodash.isEmpty(this.userInfo.userinfo)) {
      const data: IEditMaterialSubmit = {
        ...this.userInfo.userinfo![0],
        nickname: this.userInfo.nickname,
        avatar: this.userInfo.avatar,
      };
      delete (data as any).userId;
      delete (data as any).id;
      this.formData = data;
    }
  }

  //  判断上个页面是否有带来跳转的路由 如果有则赋值给 comeBackPath
  getPageOptions() {
    const pages: any = getCurrentPages();
    const {
      options: { path },
    } = pages[pages.length - 1];
    if (typeof path !== 'undefined') {
      this.comeBackPath = path;
    }
  }

  // 提交更改
  async submit() {
    // 按钮loading
    uni.showLoading({ title: '请稍候', mask: true });
    try {
      await editUserInfoRequest(this.formData);
      uni.hideLoading();
      uni.showToast({ title: '更新成功' });
    } catch ({ response }) {
      uni.showToast({ title: response.message, icon: 'none' });
    }
  }

  // 城市选择完成事件
  citySelectionCompleted(str: string) {
    this.formData.hometown = str;
    this.regionSelectionComponentIsShow = false;
  }
  // 城市选择关闭事件
  citySelectionCompletedClose() {
    this.regionSelectionComponentIsShow = false;
  }

  // 更换头像
  changeAvatar() {
    uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: (res) => {
        uni.uploadFile({
          url: UPLOAD_IMAGE_URL,
          filePath: res.tempFilePaths[res.tempFilePaths.length - 1],
          name: 'files',
          header: {
            Authorization: `Bearer ${uni.getStorageSync('_token')}`,
          },
          success: (uploadRes) => {
            const { data }: IResponse<IUploadResponse> = JSON.parse(uploadRes.data);
            this.formData.avatar = data.success[0];
          },
          fail: () => {
            uni.showToast({ title: '服务器错误,请稍候' });
          },
        });
      },
    });
  }

  // 在 input 失去焦点后更改昵称
  editNicknameBlur(newNickname: string) {
    this.formData.nickname = newNickname;
  }
  // 更改选项
  changeOptions(methods: string) {
    let itemList: string[] = [];
    switch (methods) {
      case 'gender':
        // 更改性别
        itemList = genderSelectionList;
        break;
      case 'emotion':
        // 更改情感
        itemList = emotionalChoiceList;
        break;
      case 'job':
        // 更改职业
        itemList = careerChoiceList;
        break;
      default:
    }
    uni.showActionSheet({
      itemList,
      success: (res) => {
        if (methods === 'gender') {
          this.formData[methods] = res.tapIndex;
        } else {
          (this.formData as any)[methods] = itemList[res.tapIndex];
        }
      },
    });
  }

  // 更改生日
  datePickerChange(e: { detail: { value: string } }) {
    // e.detail.value 就是最新的时间 格式为 YYYY-MM-DD 的字符串
    this.formData.birthday = e.detail.value;
  }

  // 更改家乡
  changeHometown() {
    // 显示地区三级列表选择框
    this.regionSelectionComponentIsShow = true;
  }
}
</script>

<style lang="scss" scoped>
.list {
  padding: 0 20rpx;
}
.btn {
  background: #ffe933;
  color: #000000;
  margin: 30rpx 20rpx;
}
</style>
