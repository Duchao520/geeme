<template>
  <div class="root">
    <div class="lineBox">
      <!-- 头 -->
      <div
        class="line-left"
        :style="{'background':itemInfo.completed?(successColor?successColor:'#F52D56'):'#cccccc'}"
        v-if="location!='zero'"
      ></div>
      <!-- 中 -->
      <div class="center" :style="{'color':itemInfo.completed?'#F52D56':'#cccccc'}">
        <div class="center-inner">
          <div class="title" :style="{color:titleColor?titleColor:''}">{{itemInfo.name}}</div>
          <div class="ball" :style="{'background':itemInfo.completed?'#FFF':( showIconDefault? '#FFF':'#cccccc'),color:itemInfo.completed?(successColor?successColor:'#F52D56'):'#cccccc'}">
            <i class="icon iconfont" :class="icon?icon:'icon-icon_order_success'"></i>
          </div>
          <div class="time" :style="{color:timeColor?timeColor:''}">{{itemInfo.time}}</div>
        </div>
      </div>
      <!-- 尾巴 -->
      <div
        class="line-right"
        :style="{'background':itemInfo.completed?(successColor?successColor:'#F52D56'):'#cccccc'}"
        v-if="location!='last'"
      ></div>
    </div>
  </div>
</template>
<script>
/**
 * itemInfo包含：
    time: 时间："2018-12-23 11:00",
    name: 步骤："客户申请退款",
    completed: 完成程度：false
    location是组件的位置，开头，中间，末尾
 */
export default {
  props: {
    itemInfo: Object,
    location: String,
    titleColor:String,
    timeColor:String,
    successColor:String,
    showIconDefault: Boolean,
    icon: String,
  }
};
</script>
<style lang="scss" scoped>
.root {
  min-width: 0;
  height: 50px;
  flex: auto;
  height: 75px;
  .lineBox {
    flex: auto;
    display: flex;
    align-items: center;
    .center {
      width: 23px;
      .center-inner {
        width: 100px;
        height: 76px;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translateX(-39px);
        .ball {
          width: 24px;
          height: 24px;
          line-height: 24px;
          border-radius: 50%;
          i {
            font-size: 24px;
          }
        }
        .title,
        .time {
          line-height: 26px;
          font-size: 12px;
          height: 26px;
          white-space: nowrap;
        }
      }
    }
    .line-left,
    .line-right {
      background: red;
      flex: auto;
    }
  }
}
.line-left {
  min-width: 80px;
  height: 5px;
}
.line-right {
  min-width: 80px;
  height: 5px;
}
</style>
