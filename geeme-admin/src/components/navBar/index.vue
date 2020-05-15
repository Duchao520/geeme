<template>
  <div>
    <!-- 普通模式 -->
    <ul class="gemee-nav" v-if="!withLink">
      <li
        v-for="item in navList"
        :key="item.id"
        class="nav-item"
        :class="{active: activeId === item.id}"
        @click="check(item)"
      ><a>{{item.title}}</a></li>
    </ul>

    <!-- 导航模式 -->
    <ul class="gemee-nav" v-if="withLink">
      <router-link
        v-for="item in navList"
        :key="item.link"
        :to="item.link"
        class="nav-item"
        active-class="active"
      ><a>{{item.title}}</a></router-link>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    navList: Array,
    withLink: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      activeId: this.navList[0].id
    }
  },
  methods: {
    check(item) {
      this.activeId = item.id;
      this.$emit('change', item)
    }
  }
};
</script>

<style lang="less" scoped>
@navTabB: #dee1e6;
@navTabH: 32px;
@outerW: 6px;
@innerW: 12px;
@navC: #5F6368;

.gemee-nav {
  display: flex;
  align-items: flex-end;
  background: @navTabB;
  border-radius: 6px 6px 0 0;
  height: @navTabH;
  width: 100%;
  .nav-item {
    list-style: none outside none;
    cursor: pointer;
    position: relative;
    border-radius: 6px 6px 0 0;
    transition: transform 0.07s ease-out;
    a {
      padding: 0 26px;
      line-height: @navTabH;
      border-right: 1px solid #999999;
      color: @navC;
      &::before,
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        width: @innerW;
        height: @innerW;
        border-radius: @innerW/2;
        background: @navTabB;
        z-index: 2;
      }
      &::before {
        left: -@innerW;
      }
      &::after {
        right: -@innerW;
      }
    }
    &:last-child {
      a {
        border-right: none;
      }
    }
    
    &::before,
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      background: @navTabB;
      width: @outerW;
      height: @outerW;
      z-index: 1;
    }
    &::before {
      left: -@outerW;
    }
    &::after {
      right: -@outerW;
    }

    /* 边界隐藏 */
    &:first-child::before, &:first-child a::before {
      display: none;
    }
    
    &.active {
      background: #ffffff;
      z-index: 10;
      box-shadow: 0px -1px 4px 0px rgba(171, 172, 175, 0.3);
      transform: scaleY(1.1) scaleX(1.1) translateY(-1.1px);
      a {
        border: none;
        color: #333333;
      }
      &::before, &::after {
        background: #ffffff;
      }
    }

    /* 保证第一个标签不会溢出, 用的估计值 */
    &:nth-child(1).active {
      transform: scaleY(1.1) scaleX(1.1) translateY(-1.1px) translateX(4px);
    }
  }
}
</style>