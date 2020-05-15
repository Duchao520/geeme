<template lang="pug">
  ul.top-tabs
    li.tab-item(
      v-for="(item, index) in navTabs",
      :class="{'active': currentTab !== item.title}",
      v-show="item.show"
      @click="triggerTab(item)"
    ) {{ item.title }}
      span.line(
        v-show="currentTab === item.title"
      )
</template>
<script>
import { mapActions, mapState } from "vuex";
import { fail } from 'assert';
export default {
  props: {
    tabname: String,
  },
  data() {
    return {
      navTabs: [],
      currentTab: "" // 当前的导航tab
    };
  },
  watch: {
    $route(to, from) {
      this.getCurrentNavTabs();
    }
  },
  computed: {
    'staffRecord'() {
      return this.$store.state.authRouter.currentEntryNav.ROUTER_SUB_TABS.staffRecord
    },
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    }),
  },
  created() {
    this.$nextTick(()=>{
      this.getCurrentNavTabs();
    })
  },
  methods: {
    ...mapActions(['setCurrentEntryNav']),
    triggerTab(item) {
      this.currentTab = item.title;
      if (item.routes && item.routes.length) {
        this.$router.push(item.routes[0].path)
      } else {
        this.$router.push(item.path);
      }
    },
    // 检测当前路由是否在所要的字段内
    getCurrentNavTabs() {
      let val = this.$route;
      let matchName = null;
      let datas = this.$store.state.authRouter.currentEntryNav[this.tabname]
      // console.log(datas)
      if (val.matched && val.matched[1]) {
        matchName = val.matched[1].path.split("/");
      }
      if (matchName&&matchName[2] && datas[matchName[2]]) {
        this.navTabs = datas[matchName[2]];
        this.getCurrentTab(val.path);
      } else {
        this.navTabs = [];
      }
    },
    getCurrentTab(path) {
      for (let i = 0, len = this.navTabs.length; i < len; i++) {
        if (path.indexOf(this.navTabs[i].path) === 0) {
          this.currentTab = this.navTabs[i].title;
          // 员工档案非服务者时没有 [服务档案、相关服务、作品动态、服务评价]
          if(this.navTabs[i].path === `/${this.currentEntry}-inner/staffRecord/record-introduce`){
            this.$nextTick(() => {
              let jobType = this.$store.state.manage.currentInfo.jobType
              if(jobType==='非服务者'){
                let staffRecord = JSON.parse(JSON.stringify(this.staffRecord))
                  staffRecord.forEach((item,idx) => {
                    item.show = idx ? false : true
                  });
                  this.navTabs = staffRecord
              }
            })
          }
          break;
        }
      }
      this.currentTab = this.currentTab || this.$route.meta.parentTitle
    }
  },
  destroyed() {

  }
};
</script>
<style lang="scss" scoped>
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
