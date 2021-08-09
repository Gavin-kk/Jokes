<template>
  <view>
    <button @tap="comeBack">返回</button>
    <template v-if="currentShowArticleOrTopic">
      <block v-for="(item, index) in classifyList" :key="item.id">
        <avatar-list @clickItem="comeBack" :count="item.count" :index="index" :title="item.title" />
      </block>
    </template>
    <template v-else>
      <block v-for="(item, index) in topicList" :key="item.id">
        <avatar-list
          @clickItem="comeBack"
          :count="10"
          :title="item.title"
          :index="index"
          :desc="item.desc"
          :pic="item.pic"
        />
      </block>
      <pull-up-loading :text="pullMsg"></pull-up-loading>
    </template>
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ArticleTypeEnum } from '@pages/release/release.vue';
import { ModuleConstant } from '@store/module.constant';
import { MomentStoreActionType } from '@pages/moment/store/constant';
import { namespace } from 'vuex-class';
import { ITopic } from '@pages/moment/store';
import { IClassify } from '@pages/home/store';
import { HomeStoreActionType } from '@pages/home/store/constant';
import ItemList from '@components/list/item-list.vue';
import AvatarList from '@components/avatar-list/avatar-list.vue';
import { LoadingStatus } from '@components/sliding-list/loading-status';
import PullUpLoading from '@components/pull-up-loading/pull-up-loading.vue';

const MomentModule = namespace('momentModule');
const HomeModule = namespace('homeModule');

@Component({
  components: { PullUpLoading, AvatarList, ItemList },
})
export default class SelectClassify extends Vue {
  @MomentModule.State('topicList')
  private topicList!: ITopic[];
  @HomeModule.State('classifyList')
  private classifyList!: IClassify[];
  private type: ArticleTypeEnum = ArticleTypeEnum.topic;
  private pullMsg: LoadingStatus = LoadingStatus.load;
  // 页码
  private pageNum: number = 1;

  // 判断当前显示哪种列表
  get currentShowArticleOrTopic(): boolean {
    return this.type === ArticleTypeEnum.article;
  }

  created() {
    this.getData();
  }

  comeBack(index: number) {
    if (this.currentShowArticleOrTopic) {
      uni.$emit('selectedClassify', this.classifyList[index]);
    } else {
      uni.$emit('selectedTopic', this.topicList[index]);
    }
    uni.navigateBack({
      delta: 1,
    });
  }
  // 页面滚动到底部事件
  async onReachBottom() {
    this.pullMsg = LoadingStatus.loading;
    this.pageNum++;
    await this.getData();
    this.pullMsg = LoadingStatus.load;
  }

  async getData() {
    const pages: any = getCurrentPages();
    const {
      options: { type },
    }: { options: { type: string } } = pages[pages.length - 1];

    this.type = +type;

    if (+type === ArticleTypeEnum.article && !this.classifyList.length) {
      try {
        await this.$store.dispatch(`${ModuleConstant.homeModule}/${HomeStoreActionType.GET_ALL_ARTICLE_CATEGORIES}`);
      } catch ({ response }) {
        console.log(response);
      }
    } else {
      if (!this.topicList.length) this.pageNum++;
      try {
        await this.$store.dispatch(
          `${ModuleConstant.momentModule}/${MomentStoreActionType.GET_ALL_TOPICS}`,
          this.pageNum,
        );
      } catch ({ response }) {
        console.log(response);
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
