<template>
  <div class="full-single-page-mian">
    <!-- 头部导航条 [个人中心/其他业务] -->
    <center-header v-if="type==='center'" :title="title" :backing="'返回'" :isSelfSite="true" />
    <seed-header v-else :title="title" :hasTabs="false" :origin="origin"></seed-header>
    <!-- 内容区域 -->
    <div class="full-single-page-container scrollbar">
      <div class="full-single-page-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'full-page',
  props: {
    type: {
      type: String,
      default: 'center'
    },
    title: {
      type: String,
      default: '个人中心'
    },
    origin: {
      type: String
    }
  },
}
</script>
<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";
  .full-single-page-mian {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .full-single-page-container {
      width: calc(100vw - 40px);
      height: calc(100vh - 105px);
      margin: 85px 20px 20px;
      overflow-y: auto;
      .full-single-page-body {
        min-height: calc(100vh - 105px);
        max-width: 1440px;
        min-width: 960px;
        margin: 0 auto;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
        &::before, &::after{
          content: '';
          display: table;
        }
      }
    }
  }
</style>
