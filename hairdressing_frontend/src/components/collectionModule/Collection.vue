<template>
    <div class="payment_container">
      <!-- 订单付款信息 -->
      <div class="payment_info">
        <div class="title">杭州苑苑美容美发 滨江宝龙店</div>
        <div class="area_title">
          <i></i>
          <span>消费明细</span>
          <i></i>
        </div>
        <div class="ser_item_list">
          <div class="ser_item">
            <p>日式剪裁-OL短发</p>
            <div>
              <span class="price">187元</span>
              <span class="count">数量：1</span>
              <span class="price total">225元</span>
            </div>
          </div>
        </div>
        <p class="acco_price"><label>合计：</label><span>290元</span></p>
        <p class="acco_price"><label>会员折后价：</label><span>290元</span></p>
        <p class="acco_price"><label>红包优惠：</label><span class="discount">-20元</span></p>
        <p class="acco_price"><label>优惠券优惠：</label><span class="discount">-20元</span></p>
        <div class="area_title">
          <i></i>
          <span>应付总额</span>
          <i></i>
        </div>
        <p class="real_price">299元</p>
        <div class="area_title" style="margin-top:20px;">
          <i></i>
          <span>订单信息</span>
          <i></i>
        </div>
        <p class="order_info"><label>订单编号</label><span>J32490328759872498579283</span></p>
        <p class="order_info"><label>开单时间</label><span>2018-12-11 10:30</span></p>
        <p class="order_info"><label>客户姓名</label><span>林*强</span></p>
        <p class="order_info"><label>客户手机号</label><span>138*****4724</span></p>
        <p class="order_info"><label>开单人</label><span>吴美丽</span></p>
      </div>
      <!-- 支付方式 -->
      <div class="payment_way">
          <ul>
            <li v-for="(item,index) in payList" :class="{checked:index == num}" @click="tab(index)" :key="index">
              <img :src="item.img">
              <span>{{item.name}}</span>
            </li>
          </ul>
      </div>
      <!-- 支付操作 -->
      <div class="payment_operate">
          <div class="real_pay_amount">299元</div>
          <!-- 支付宝 微信区域 -->
          <div class="no_cash_area" v-if="num==1 || num==0">
              <div class="input_area">
                  <el-input placeholder="扫码或输入付款码"></el-input>
              </div>
              <!-- 二维码区域 -->
              <div class="code_area">
                <div class="code_img">
                  <img src="@/assets/QRCode.png">
                </div>
                <p>顾客扫码付款</p>
              </div>
          </div>
          <!-- 现金支付 -->
          <div class="cash_area" v-if="num==2">
              <p class="cash_title">
                <span class="cash_name">实收</span>
                <span class="cash_blue">不找零</span>
              </p>
              <div class="cash_input_area">
                <el-input placeholder="请输入金额"><template slot="prepend">¥</template></el-input>
              </div>
              <el-button type="primary" style="margin-top:30px;width:100%;">确认收款</el-button>
          </div>
      </div>
    </div>
</template>

<script>
import alipay from '@/assets/zhifubao.png'
import wepay from '@/assets/weixin.png'
import cashpay from '@/assets/xianxiafukuan.png'
export default {
  name:'PaymentCon',
  data(){
    return {
      payList:[{
        img: alipay,
        name:'支付宝支付'
      },{
        img:wepay,
        name:'微信支付'
      },{
        img:cashpay,
        name:'现金支付'
      }],
      num:0
    }
  },
  mounted(){
  },
  methods:{
    tab(index) {
      this.num = index;
    }
  }
}
</script>

<style lang="scss" scoped>
  .payment_container{
    display: flex;
    .payment_info{
      font-size:14px;
      padding:30px;
      width:317px;
      // min-height: 654px;
      border-right:1px solid #EBEBEB;
      .title{
        font-size:18px;
        color:#3A3A3A;
        text-align:center;
      }
      .area_title{
        margin-top:45px;
        i{
          display:inline-block;
          width:105px;
          height:1px;
          background:#EBEBEB;
          vertical-align:middle;
        }
        span{
          display:inline-block;
          color:#9B9B9B;
          padding:0 18px;
        }
      }
      .ser_item_list{
        color:#3A3A3A;
        margin-top:20px;
        .ser_item{
          margin-bottom:10px;
          div{
            margin-top:10px;
            display:flex;
            .price{
              color:#E6333F;
            }
            .count{
              flex:1;
              margin-left:20px;
            }
          }
        }
      }
      .acco_price{
        padding-top:5px;
        text-align:right;
        color:#3A3A3A;
        label{
          width:100px;
          display:inline-block;
          text-align:left;
        }
        span{
          display:inline-block;
          width:80px;
        }
        .discount{color:#E6333F;}
      }
      .real_price{
        font-size:22px;
        color:#E6333F;
        text-align:right;
        padding-top:10px;
      }
      .order_info{
        color:#3A3A3A;
        padding-top:10px;
        display:flex;
        label{flex:1;}
      }
    }
    .payment_way{
      width:189px;
      // min-height: 714px;
      border-right:1px solid #EBEBEB;
      ul{
        li{
          width:100%;
          cursor:pointer;
          height:56px;
          border-bottom:1px solid #EBEBEB;
          color:#9B9B9B;
          display:flex;
          align-items:center;
          img{
            width:22px;
            height:22px;
            margin: 0 12px 0 16px;
          }
          span{
            display:inline-block;
          }
        }
        li.checked{
          color:#333333;
          border-right:2px solid #fff;
        }
      }
    }
    .payment_operate{
      width:269px;
      padding:30px;
      .real_pay_amount{
        font-size:22px;
        color:#E6333F;
      }
      .input_area{
        margin-top:40px;
      }
      .code_area{
        margin-top:40px;
        text-align:center;
        img{width:140px;height:140px;}
        p{font-size:14px;color:#A5A5A5;margin-top:10px;}
      }
      .cash_title{
        margin-top:40px;
        margin-bottom:10px;
        display:flex;
        .cash_name{
          flex:1;
        }
        .cash_blue{
          cursor:pointer;
          color:#409EFF;
        }
      }
    }
  }
</style>



