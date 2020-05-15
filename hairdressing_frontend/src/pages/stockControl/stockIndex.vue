<template>
  <div class="container">
      <div class="body">
          <router-view></router-view>
      </div>
  </div>

</template>

<style lang="scss" scoped>
*{
    box-sizing: border-box;
}
.body{
    width: 100%;
    // height: 300px;
    padding: 24px 20px 0;
}
</style>

<script>
import MyHeader from "@/components/common/Header";
export default {
    components:{
        'my-header':MyHeader
    },
  data() {
    return {};
  }
};
</script>
