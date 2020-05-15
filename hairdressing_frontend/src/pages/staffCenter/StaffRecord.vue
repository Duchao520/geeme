<template>
  <div id="gm_staff_record">
    <!-- 顶部header-->
      <!-- <seed-header :title="'员工档案'"></seed-header> -->
      <details-header :title="'员工档案'" :tabsList="tabList"/>
      <!-- container -->
      <div class="sub_container">
        <div class="container">
          <router-view></router-view>
        </div>
      </div>
      <!-- <g-del-model
        :delTagDialogVisible="delTagDialogVisible"
        @close="delTagDialogVisible=false"
        @confirm="confirmDelTag"
        :title="'确定要删除吗？'"
        :content="'删除后，该员工将不能登录服务者小程序，但客户依然可预约其服务。'"
        :icon="'icon_popup_question'"
        :iconColor="'#FF6D61'"
      ></g-del-model> -->
  </div>
</template>

<script>
import SeedHeader from '@/components/common/SeedHeader'
import Bus from '@/util/bus'
import * as axios from '@/util/axios'
export default {
  name:'GmStaffRecord',
  data(){
    return{
      // delTagDialogVisible: false,
      tabList: this.$store.state.authRouter.currentEntryNav.ROUTER_SUB_TABS.staffRecord
    }
  },
  mounted(){
    if (this.$route.params.jobType <= 0) { // -1：为查看总部员工定义 0：非服务者 1：服务者
      this.tabList = this.tabList.slice(0,1);
    }
    // this.$nextTick(() =>{
    //   Bus.$on('deleteStaffDynamic',data => {
    //    this.delTagDialogVisible=data? true: false
    //     console.log(data, 'ss')
    //   })
    // })
  },
  methods:{
    back(){
      this.$router.push('/shop-inner/staff')
    },
    // confirmDelTag() {
    //   axios.put(
    //     api.staffDynamicWorksStatusChangeByIds.URL,
    //     {
    //       idList:[this.delId],isDeleted:true
    //     }
    //   ).then(res=>{
    //     this.getStaffDynamicWorksList();
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
#gm_staff_record{
  .container{
    height: calc(100vh - 105px);
    overflow-y: auto;
    @include scroll-bar(4px, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    padding-bottom: 0;
  }
}
</style>
