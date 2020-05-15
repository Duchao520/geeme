<template>
  <div id="gm_customer_record">
    <!-- 顶部header-->
    <!-- <seed-header :title="'美丽档案'"></seed-header> -->
    <!-- container -->
    <!-- <div class="sub_container">
        <div class="container">
            <router-view></router-view>
        </div>
    </div> -->
    <details-header :title="'美丽档案'" :tabsList="customerRecord"/>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name:'GmStaffRecord',
  data(){
    return{
      customerRecord: this.$store.state.authRouter.currentEntryNav.ROUTER_SUB_TABS.customerRecord
    }
  },  
  mounted(){},
  methods:{},
}
</script>

<style lang="scss" scoped>
  // .container{
  //   width: 100%;
  //   padding: 80px 20px 20px;
  //   background-color: #F1F2F7;
  //   margin:0;
  // }
  #gm_customer_record {
    display: flex;
    justify-content: center;
  }
</style>
