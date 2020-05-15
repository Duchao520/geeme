<template>
  <div class="org-body">
    <div class="user-defined-tab">
      <el-tabs v-model="activePath" type="card" @tab-click="$router.push(activePath)">
        <el-tab-pane
          v-for="(item,index) in routers"
          :key="index"
          :label="item.title"
          :name="item.path"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="con">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import "@/assets/css/tab.scss";
import { mapState } from "vuex";
//import framework from "./components/frameworkManage";
//import job from "./components/jobManage";
//import auth from "./components/authorityManage";
export default {
  name: "organization",
  //components: { framework, job, auth },
  data() {
    return {
      //orgList: [],
      //orgActive: "",
      /* routers: [
        { path: `/${this.$store.state.authRouter.currentEntry}-inner/setting/organization/framework-set`, title: "架构设置" },
        { path: `/${this.$store.state.authRouter.currentEntry}-inner/setting/organization/job-set`, title: "职务管理" },
        { path: `/${this.$store.state.authRouter.currentEntry}-inner/setting/organization/authority-set`, title: "权限管理" },
      ], */
      activePath: ""
    };
  },
  created() {
    // 模拟接口
    /* this.orgList = [
      {
        name: "架构设置",
        auth: true,
        link: "/brand-inner/setting/organization/framework-set"
      }, // link 兼容三级导航用
      {
        name: "职务管理",
        auth: true,
        link: "/brand-inner/setting/organization/job-set"
      },
      {
        name: "权限管理",
        auth: true,
        link: "/brand-inner/setting/organization/authority-set"
      }
    ]; */
    // 取到有权限的第一个数据作为激活的导航, 可能不需要这个字段，取数组第一个对象即可
    //let activeObj = this.orgList.find(item => item.auth);
    //this.orgActive = activeObj.name; // 默认激活 没有auth字段 直接取 this.orgList[0].name
  },
  mounted() {
    let url = this.$route.path;
    this.activePath = url;
  },
  methods: {},
  computed: {
    ...mapState({
      routers: state =>
        state.authRouter.currentEntryNav.ROUTER_3rd_Nav["组织架构"]
    })
    /* activeComp() {
      if (this.orgActive === "架构设置") {
        return "framework";
      } else if (this.orgActive === "职务管理") {
        return "job";
      } else if (this.orgActive === "权限管理") {
        return "auth";
      }
    } */
  }
};
</script>

<style lang='scss' scoped>
.org-body {
  box-sizing: border-box;
  margin: 0 20px;
  background-color: rgba(255, 255, 255, 1);
  position: relative;
  border-radius: 8px;
  .con {
    box-sizing: border-box;
    padding-top: 20px;
  }
}
</style>
