<template>
  <div class="root">
    <div class="user-defined-tab">
      <el-tabs v-model="activePath" type="card" @tab-click="$router.push(activePath)">
        <el-tab-pane v-for="(item,index) in routers"
          :key="index"
          :label="item.title"
          :name="item.path">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="con">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import "@/assets/css/tab.scss";

export default {
  data() {
    return {
      activePath:''
    };
  },
  props: {

  },
  computed: {
    ...mapState({
      routers: state => state.authRouter.currentEntryNav.ROUTER_3rd_Nav['全局设置']
    })
  },
  mounted(){
    let url = this.$route.path;
    this.activePath = url;
  },
  methods: {
    handleClick(d) {
      console.log(d);
    },
  }
};
</script>
<style lang="scss" scoped>
.root {
  box-sizing: border-box;
  margin: 0 20px;
  background-color: rgba(255, 255, 255, 1);
  position: relative;
  border-radius: 8px 8px 0 0;
  .top-line {
    position: absolute;
    top: -34px;
    height: 34px;
    background: rgba(174, 184, 229, 0.3);
    width: 100%;
    border-radius: 10px 10px 0 0;
    color: #5f6368;
    line-height: 34px;
    font-size: 14px;
  }
  .con{
    box-sizing: border-box;
    // padding-top: 30px;
  }
}
</style>
