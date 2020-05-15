<template>
  <div>
    <!--二维码收款-->
    <!--标题栏-->
    <header class="bg-r fc-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="">二维码收款</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!---->
    <div class="bg-r" style="padding-bottom: 32px;">
      <div class="code-box bg-f">
        <h3 class="num ">￥1999</h3>
        <img :src="'data:image/gif;base64,'+qrContent" width="60%"/>
        <p class="fz16">扫二维码支付金额</p>
        <div class="flex-box">
          <div class="item">
            <input type="radio" name="payway" id="payway1" checked="checked" value="1" v-model="receiptWay"
                   @change="allianceshop">
            <label for="payway1" class="radio fz15">支付宝收款</label>
          </div>
          <div class="item">
            <input type="radio" name="payway" id="payway2" value="2" v-model="receiptWay" @change="allianceshop">
            <label for="payway2" class="radio fz15">微信收款</label>
          </div>
        </div>
      </div>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {allianceshop} from '@/assets/js/getData';
  import {postColor} from "@/assets/js/jsBridge";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        tip: '',
        token: '',
        receiptWay: 1, //默认支付宝
        payerShopId: '8600000000',
        qrContent: '', //付款二维码路径
      }
    },
    mounted() {
      var _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.allianceshop();
      });
      postColor('F7094D'); //传递顶部的手机导航栏的色值给安卓
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /*返回上一页*/
      back() {
        this.$router.push({path: '/'});  //返回首页
      },
      //获取支付二维码
      allianceshop() {
        let _self = this;
        let _data = {
          token: _self.token,
          receiptWay: _self.receiptWay, //收款方式 1支付宝 2微信
          payerShopId: _self.payerShopId, //付款方商家Id
        }
        _self.$getSignIn(_data).then(sec => {
          allianceshop(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.qrContent = _data.qrContent;
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })
      },
      //查询商家是否已经支付成功
      /*paySuccess(){
               let _self = this;
               let _data = {

               }
               getData.paySuccess(_data).then(res=>{
                   let _data = res.data ;
                if(_data.state == 1){
                    _self.$router.push({path:'/paySuccess'});  //跳转支付成功页面
                }else{
                    comm.toast(decodeURIComponent(_data.msg));
                }
               }).catch(function (error) {
                comm.alertMsg(error);
            });
        }*/
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  #app {
    height: 100%;
  }

  .code-box {
    margin: 0 auto;
    width: 93%;
    padding: 135px 0 0 0;
    /*height: 456px;*/
    text-align: center;
  }

  .code-box img {
    margin-bottom: 10px;
  }

  .num {
    font-size: 25px;
    margin-bottom: 30px;
  }

  .flex-box {
    padding: 120px 0 10px 0;
  }

  input[type="radio"]:checked + label {
    color: #000000;
  }
</style>
