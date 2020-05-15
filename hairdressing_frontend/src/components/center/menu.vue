<template lang="pug">
  .center-menu__wrap
    ul.menu-list(
      v-for="(menu, index) in menuList",
      :key="index"
    )
      li.menu-title
        i.icon.iconfont(
          :class="['icon-'+menu.icon]"
        )
        span {{ menu.title }}
      router-link.menu-item(
        v-for="(list, index) in menu.list",
        :key="index",
        :to="list.url",
        :class="{current: current===list.url}"
        tag="li",
        @click.native="toChange(list)"
      ) {{ list.title }}
</template>
<script>
import * as datas from "@/assets/js/datas";
import * as utils from "@/assets/js/utils";
export default {
  data() {
    return {
      current: "", // 当前的menu
      menuList: datas.ROUTER_CENTER_MENU
    };
  },
  watch: {
    $route(val) {
      this.changeRouter(val);
    }
  },
  mounted() {
    this.changeRouter();
  },
  methods: {
    // 匹配路由
    changeRouter(val) {
      let router = this.$router.currentRoute.fullPath;
      // 匹配路由
      for (let i = 0, len = this.menuList.length; i < len; i++) {
        for (let j = 0, len1 = this.menuList[i].list.length; j < len1; j++) {
          if (utils.isInString(router, this.menuList[i].list[j].url)) {
            this.current = this.menuList[i].list[j].url;
            break;
          }
        }
      }
    },
    // 改变当前路由状态
    toChange(list) {
      this.current = list.url;
      // 向父组件发送数据
      this.$emit("change-router", list);
    }
  }
};
</script>