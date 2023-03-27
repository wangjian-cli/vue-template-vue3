<template>
  <Controller :defaultWidth="1440" :defaultHeight="900" v-if="putway === Putway.Popout" />
  <div :class="{ main: true, popout: putway === Putway.Popout }">
    <Header />
    <div class="body top">
      <div class="body-left">
        <Banner :liveData="liveData" :state="state" @reserve="reserve" />
        <LiveService :liveData="liveData" @clickMore="openMore" :state="state" @reserve="reserve" />
      </div>
      <div class="body-right">
        <InvestmentJournal />
        <div :class="{ 'more-module': true, 'is-open': isShowMoreLive }">
          <transition name="hx-slide-left">
            <keep-alive>
              <MoreLive v-if="hasGotTab && isShowMoreLive" @closeMore="closeMore" :tabs="tabs" />
            </keep-alive>
          </transition>
        </div>
      </div>
    </div>
    <div class="body bottom">
      <div class="body-left">
        <VideoList />
      </div>
      <div class="body-right">
        <Views :isShow="hasGotTab" :tabs="tabs" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, onUnmounted, provide } from 'vue';
import { getHomeLive, getTabs } from '_a';
import { errorReport } from '_t';
import { LiveData, Tabs } from '@/types/home';
import State from '@/types/pageStatus';
import useInterval from '@/hooks/useInterval';
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router';
import Putway from '@/types/putway';

// 既保持退出动画,又在退出之后去除鼠标事件
const pointEvent: Ref<'initial' | 'none'> = ref('none');
const isShowMoreLive: Ref<boolean> = ref(false);
const liveData: Ref<LiveData[]> = ref([]);
const tabs: Tabs[] = [];
const state: Ref<State> = ref(State.Loading);
const putway: Ref<Putway> = ref(Putway.Embed);
// 由于更多直播和图文直播依赖获取标签接口,所以获取标签接口完成之后通知这两个模块开始走生命周期
const hasGotTab: Ref<boolean> = ref(false);
const { onShow, setTimer, clearTime } = useInterval();
// 获取首页的tabs
const getTabsApi = () => {
  getTabs()
    .then(resultData => {
      resultData.forEach(item => {
        if (item.label_id) {
          tabs.push({
            labelId: item.label_id,
            labelName: item.label_name,
            sid: item.sid
          });
        }
      });
    })
    .catch((error: Error) => {
      errorReport({
        name: `首页获取tabs标签接口错误:${error.name}`,
        message: error.message,
        stack: error.stack
      });
    })
    .finally(() => {
      hasGotTab.value = true;
    });
};
// 获取首页直播数据
const getHomeLiveApi = () => {
  const sizeNum: number = 6;
  getHomeLive({ size: sizeNum })
    .then(resultData => {
      liveData.value = resultData.map(
        (item): LiveData => ({
          liveId: item.live_id,
          img: item.cut_img,
          link: item.link,
          title: item.title,
          startTime: item.start_time,
          status: item.status,
          host: item.host
        })
      );
      if (liveData.value.length) {
        state.value = State.Success;
      } else {
        throw new Error('首页直播接口数据为空');
      }
    })
    .catch((error: Error) => {
      errorReport({
        name: `首页直播接口错误:${error.name}`,
        message: error.message,
        stack: error.stack
      });
      state.value = State.Error;
    });
};
// 打开更多直播
const openMore = () => {
  isShowMoreLive.value = true;
  pointEvent.value = 'initial';
};
// 关闭更多直播
const closeMore = () => {
  isShowMoreLive.value = false;
  pointEvent.value = 'none';
};
// 点击预约,为了保持banner和直播服务状态一直,预约成功之后请求一次接口
const reserve = () => {
  getHomeLiveApi();
};
onMounted(() => {
  const route: RouteLocationNormalizedLoaded = useRoute();
  // 判断当前是否处于内嵌模式
  if (route.query.putway) {
    putway.value = (route.query.putway + '') as Putway;
  } else {
    putway.value = Putway.Embed;
  }
  window.TA.log({ id: homePageId });
  // 获取tabs接口内容
  getTabsApi();
  // 获取直播信息
  getHomeLiveApi();
  // 聚焦到页面时调用接口,修改是否订阅状态
  onShow(getHomeLiveApi);
  // 设置5min一次的轮询,并且只有在聚焦的时候才会显示
  setTimer(getHomeLiveApi);
});
onUnmounted(() => {
  // 清空轮询
  clearTime();
});
provide('putway', putway);
</script>

<style scoped lang="less">
.main {
  min-width: 1050px;
  max-width: 1398px;
  margin: 0 auto;
  display: flex;
  padding: 9px 8px 8px;
  height: calc(100% - 16px);
  flex-direction: column;
  .body {
    display: flex;
    overflow: auto;
    &-left {
      width: 1030px;
      display: flex;
    }
    &-right {
      width: 360px;
    }
  }
  .top {
    min-height: 327px;
    min-width: 1398px;
    .more-module {
      display: flex;
      position: absolute;
      width: 394px;
      height: calc(100% - 75px);
      min-height: 738px;
      top: 48px;
      overflow: hidden;
      z-index: 3;
      margin-left: -30px;
      pointer-events: v-bind(pointEvent);
      &.is-open {
        &::before {
          content: '';
          width: 38px;
          height: 100%;
          background-image: linear-gradient(270deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);
        }
      }
    }
  }
  .bottom {
    height: calc(100% - 375px);
    min-height: 403px;
    min-width: 1398px;
    margin-top: 8px;
    .body-left,
    .body-right {
      height: 100%;
    }
  }
}
.main.popout {
  height: calc(100% - 32px);
  .top {
    .more-module {
      height: calc(100% - 85px);
      top: 78px;
    }
  }
}
</style>
