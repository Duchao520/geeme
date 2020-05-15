<template>
  <div>
    <!--标题栏-->
    <header class="bg-f " :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom">我的职员</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!---->
    <div>
      <ul class="bg-f">
        <div class="nullImg" v-if="list.length == 0"><img src="@/assets/imgs/partnerCenter/null.png" width="50%"/></div>
        <li class="border-buttom relative list-con" v-else>
          <p class="fz17 p-hide">试试(ID:111111)</p>
          <p class="fc-c fz12">添加时间：2018-08-08 12:12:12</p>
          <span class="fz14 state">审核状态</span>
        </li>
      </ul>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import * as comm from '@/assets/js/comm'
  import * as getData from '@/assets/js/getData'

  export default {
    data() {
      return {
        list: [],
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
      }
    },
    mounted() {

    },
    created: function () {
      let _self = this;
    },
    methods: {
      /*返回上一页*/
      back() {
        this.$router.go(-1);//返回上一层
      },
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  .list-con {
    padding: 15px 75px 13px 16px;
  }

  .list-con .state {
    position: absolute;
    right: 12px;
    top: 50%;
    line-height: 1;
    margin-top: -6px;
  }
</style>
