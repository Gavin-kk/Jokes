<template>
  <view>
    <!--    导航栏-->
    <nav-bar title="资料编辑" />
    <view class="list">
      <edit-material-item :avatar="userInfo.avatar" title="头像" @clickRight="changeAvatar" />
      <edit-material-item :options="userInfo.nickname" is-input title="昵称" @blur="editNicknameBlur" />
      <edit-material-item :options="userInfo.gender" title="性别" @clickRight="changeOptions('gender')" />
      <edit-material-item title="生日" is-use-slot>
        <picker mode="date" :value="userInfo.birthday" :end="currentTime" @change="datePickerChange">
          {{ userInfo.birthday }}
        </picker>
      </edit-material-item>
      <edit-material-item :options="userInfo.emotion" title="情感" @clickRight="changeOptions('emotion')" />
      <edit-material-item :options="userInfo.profession" title="职业" @clickRight="changeOptions('profession')" />
      <edit-material-item title="家乡" is-use-slot>
        <view @tap="changeHometown" style="font-size: 30rpx">{{ userInfo.hometown }}</view>
        <cascade-selection
          @complete="citySelectionCompleted"
          :component-is-show="regionSelectionComponentIsShow"
          @cascadeClose="citySelectionCompletedClose"
        />
      </edit-material-item>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UniDataPicker from '@dcloudio/uni-ui/lib/uni-data-picker/uni-data-picker.vue';
import NavBar from '@pages/content/components/nav-bar/nav-bar.vue';
import EditMaterialItem from '@pages/edit-material/components/edit-material-item/edit-material-item.vue';
import moment from 'moment';
import CascadeSelection from '@components/cascade-selection/cascade-selection.vue';

moment.locale('zh-cn');

export interface IUserInfo {
  avatar: string;
  nickname: string;
  gender: '男' | '女' | '保密' | string;
  birthday: number | string; // 生日 时间戳
  emotion: string; // 情感
  profession: string; // 职业
  hometown: string; // 家乡
  [key: string]: unknown;
}
// 性别选择弹出层 list
const genderSelectionList: string[] = ['男', '女', '保密'];
// 情感list
const emotionalChoiceList: string[] = ['已婚', '未婚', '保密'];
// 职业选择列表
const careerChoiceList: string[] = ['技术', '产品', '运营', '市场', '人事', '财务', '行政'];

@Component({
  components: { CascadeSelection, EditMaterialItem, NavBar, UniDataPicker },
})
export default class EditMaterial extends Vue {
  private userInfo: IUserInfo = {
    avatar: '/static/demo/userpic/15.jpg',
    nickname: '张三',
    gender: '男',
    birthday: moment().format('YYYY-MM-DD'),
    emotion: '已婚',
    profession: '技术',
    hometown: '内蒙古',
  };

  private regionSelectionComponentIsShow: boolean = false;

  private currentTime = moment().format('YYYY-MM-DD');

  // 城市选择完成事件
  citySelectionCompleted(str: string) {
    console.log(str);
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
        this.userInfo.avatar = res.tempFilePaths[res.tempFilePaths.length - 1];
      },
    });
  }

  // 在 input 失去焦点后更改昵称
  editNicknameBlur(newNickname: string) {
    this.userInfo.nickname = newNickname;
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
      case 'profession':
        // 更改职业
        itemList = careerChoiceList;
        break;
      default:
    }
    uni.showActionSheet({
      itemList,
      success: (res) => {
        this.userInfo[methods] = itemList[res.tapIndex];
      },
    });
  }

  // 更改生日
  datePickerChange(e: { detail: { value: string } }) {
    // e.detail.value 就是最新的时间 格式为 YYYY-MM-DD 的字符串
    this.userInfo.birthday = e.detail.value;
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
</style>
