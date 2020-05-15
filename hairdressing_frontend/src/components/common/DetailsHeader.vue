<template>
  <div class="details-pages-header">
    <div class="detail-header">
      <div class="header-left">
        <div class="title">{{title}}</div>
        <div class="back" @click="toClose">关闭</div>
      </div>
      <div class="header-right" v-if="tabsList.length">
        <ul class="top-tabs">
          <li 
            class="tab-item" 
            v-for="item in tabsList" 
            :key="item.path" 
            :class="{'active': $route.name !== item.path}"
            @click="triggerTab(item)"
          >
            {{item.title}}
            <span class="line" v-show="$route.name === item.path"></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "详情"
    },
    tabsList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    triggerTab(pathObj) {
      console.log(pathObj)
      this.$router.push({name: pathObj.path})
    },
    toClose() {
      window.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.details-pages-header {
  width: 100%;
  min-width: 1400px;
  height: 65px;
  background: #fff;
  box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
  position: fixed;
  z-index: 999;
  top: 0;
  display: flex;
  justify-content: center;
  .detail-header {
    max-width: 1440px;
    min-width: 1400px;
    height: 100%;
    background: #fff;
    position: relative;
    .header-left {
      padding-top: 10px;
      .title {
        font-size: 18px;
        color: #000;
        font-weight: 600;
      }
      .back {
        position: relative;
        padding-left: 15px;
        font-size: 14px;
        color: #959595;
        width: 100px;
        cursor: pointer;
        &:before {
          content: "";
          width: 7px;
          height: 7px;
          position: absolute;
          left: 3px;
          top: 6px;
          bottom: 0;
          transform: rotate(-45deg);
          border-left: 2px solid #959595;
          border-top: 2px solid #959595;
          border-bottom-left-radius: 2px;
          border-bottom-right-radius: 2px;
        }
      }
    }
    .header-right {
      position: absolute;
      top: 0;
      left: 100px;
      height: 65px;
      line-height: 65px;
      &.tab-left {
      }
    }
  }
}
.top-tabs {
  width: 100%;
  .tab-item {
    position: relative;
    display: inline-block;
    height: 100%;
    margin-left: 30px;
    color: #2a2c44;
    font-size: 16px;
    cursor: pointer;
    &.active {
      color: #999999;
    }
    .line {
      position: absolute;
      left: 5%;
      right: 5%;
      bottom: 0;
      width: 90%;
      height: 4px;
      border-radius: 2px;
      background: #2a2c44;
    }
  }
}
</style>

