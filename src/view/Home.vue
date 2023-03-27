<template>
  <div>helloworld</div>
</template>

<script setup lang="ts">
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
