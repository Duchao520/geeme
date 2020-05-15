<template>
  <div class="dataStatistics">
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">数据统计</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <div class="bg-f ">
      <div class="clearfix bg-f fz15 title">
        <div class="fl-l flex-box fc-c">
          <div class="item">
            <input type="radio" name="type" id="type1" @change="getAgentSaleCard" v-model="time" value="30"/>
            <label for="type1">近30天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type2" @change="getAgentSaleCard" v-model="time" value="90"/>
            <label for="type2">近90天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type3" @change="getAgentSaleCard" v-model="time" value="180"/>
            <label for="type3">近180天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type4" checked="checked" @change="getAgentSaleCard" v-model="time"
                   value=""/>
            <label for="type4">全部</label>
          </div>
        </div>
        <div class="fl-r">卡销售统计图</div>
      </div>
    </div>
    <div class="chart" id="myChart" :style="{width: '355px', height: '320px'}"></div>
    <div class="bottom">
      <div class="module">
        <div class="space_bet" style="margin-bottom: 5px">
          <span class="module_title recharge">充值奖励</span>
          <i>查看充值奖励明细</i>
        </div>
        <div class="space_bet" style="margin-bottom: 5px">
          <p class="fz15">累计推广会员 100人</p>
          <p class="fz15">累计推广商家 8家</p>
        </div>
        <p class="fz15">累计充值奖励 20000元</p>
      </div>
      <div class="module">
        <div class="space_bet" style="margin-bottom: 5px">
          <span class="module_title consume">消费返佣</span>
        </div>
        <p class="fz15" style="margin-bottom: 5px">累计线上订单200单，累计返佣30000.08元</p>
        <p class="fz15">累计线下消费400单，累计返佣60000.08元</p>
      </div>
      <div class="module">
        <div class="space_bet" style="margin-bottom: 5px">
          <span class="module_title saleCard">售卡奖励</span>
          <i>查看售卡订单明细</i>
        </div>
        <p class="fz15">累计售卡订单5单，累计奖励10000元</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {postColor} from "@/assets/js/jsBridge";

  export default {
    name: "dataStatistics",
    data() {
      return {
        time: "30",
        count: 0, //总计的会员总数
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
      }
    },
    mounted() {
      let _self = this;
      postColor('ffffff'); //传递顶部的手机导航栏的色值给安卓
    },
    methods: {
      back() {
        this.$router.go(-1);//返回上一层
      },
      getAgentSaleCard() {

      }
    }
  }
</script>

<style scoped>
  @import '../../../assets/css/charts.css';
  @import '../../../assets/css/partner_base.css';
  .bottom{
    width: 100%;
    background: #FAFAFA;
    box-sizing: border-box;
    padding: 10px;
  }
  .bottom .module{
    width: 100%;
    background: #FFFFFF;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 8px;
    margin-bottom: 8px;
  }
  .space_bet{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .bottom .module .module_title{
    border-radius: 10px;
    font-size: 14px;
    color: #FFFFFF;
    padding: 0 10px;
  }
  .bottom .module .recharge{
    background: #FFA61A;
  }
  .bottom .module .consume{
    background: #8FC31F;
  }
  .bottom .module .saleCard{
    background: #0068B7;
  }
  .bottom .module i{
    font-size: 14px;
    color: #8D8E98;
  }

</style>
