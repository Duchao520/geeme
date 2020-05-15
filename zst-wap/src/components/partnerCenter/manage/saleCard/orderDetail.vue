<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">订单购卡详情</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!---->
    <ul class="bg-f list fz15">
      <li class="border-buttom clearfix">
        <span class="fl-l">卡类型</span>
        <span class="fl-r fc-c">{{info.cardType == 1 ? '定制卡' : '通用卡'}}</span>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l">购卡数量</span>
        <span class="fl-r fc-c">{{info.cardCount || 0}}</span>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l">购卡时间</span>
        <span class="fl-r fc-c">{{info.createTimeStr || ''}}</span>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l">商家名称</span>
        <span class="fl-r fc-c">{{info.advertiserName || ''}}</span>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l">商家地址</span>
        <span class="fl-r fc-c">{{info.unitAddress || ''}}</span>
      </li>
      <li class="clearfix">
        <span class="fl-l">联系电话</span>
        <span class="fl-r fc-c">{{info.advertiserContactPhone  || ''}}</span>
      </li>
    </ul>
    <div class="flex-box">
      <a :href="'tel:'+info.advertiserContactPhone" class="btn item bg-yellow fc-f fz14">联系商家</a>
      <!--<button type="button" class="btn item bg-yellow fc-f fz18 ">联系商家</button>-->
      <router-link tag="button" :to="{path:'/detail',query: {id: info.id}}" class="btn item bg-r fc-f fz18">查看商家详情
      </router-link>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getAgentCardList} from '@/assets/js/getData'

  export default {
    props: ['partnerToken'],
    data() {
      return {
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: '',
        orderNum: this.$route.query.orderNum,
        info: {},
      }
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /*返回上一页*/
      back() {
        this.$router.go(-1);//返回上一层
      },
      //获取订单详情
      getDetail() {
        let _self = this;
        let _data = {
          token: _self.token,
          orderNum: _self.orderNum, //购卡订单
        };
        console.log(_self.orderNum)
        _self.$getSignIn(_data).then(sec => {
          getAgentCardList(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.info = _data.data[0];
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })
      }
    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getDetail();
      });
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  .list {
    line-height: 55px;
    padding-left: 10px;
  }

  .list li {
    padding-right: 15px;
  }

  .btn {
    margin: 1rem 10px;
  }

  .btn.bg-yellow {
    background: #FFA61A;
  }
</style>
