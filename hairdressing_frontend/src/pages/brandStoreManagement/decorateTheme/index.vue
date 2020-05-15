<template>
  <div class="root">
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
    <router-view></router-view>
  </div>
</template>
<script>
  import {mapState} from "vuex"
  import "@/assets/css/tab.scss";

  export default {
    data() {
      return {
        activePath: ''
      };
    },
    computed: {
      ...mapState({
        routers: state => state.authRouter.currentEntryNav.ROUTER_3rd_Nav['网店装修']
      })
    },
    mounted() {
      let url = this.$route.path;
      this.activePath = url;
    },
  };
</script>
<style lang="scss" scoped>
  .root {
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 8px;
    margin: 20px 20px 0;
    height: calc(100vh - 95px);
  }
</style>
