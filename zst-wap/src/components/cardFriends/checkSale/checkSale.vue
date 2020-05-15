<template>
  <div class="checkSale">
    <v-head :title="success == 0 ? '确认订单' : '核销完成'"
            :borderBtm="true"></v-head>

    <section class="box_padding flex_box justify_space_between"
             style="padding: .24rem;border-bottom: .1rem solid #EEEEEE">
      <img v-lazy="detail.bargainImg" alt="" class="thumb">
      <div class="flex_box flex_column justify_space_between"
           style="width: 4.75rem">
        <p class="fz-30 txt-overflow">{{detail.bargainTitle}}</p>
        <div class="flex_box justify_space_between align_center">
          <p class="iconfont icon-renminbi fz-48 font-weight fc-F7094D">{{$accMul(detail.biBargain.price,1)}}</p>
          <p class="fz-24 fc-F7094D">X1</p>
        </div>
      </div>
    </section>
    <section class="box_padding"
             style="padding: .58rem 0"
             v-if="success == 0">
      <p class="text-center fz-36"
         style="margin-bottom: .38rem">核销码</p>
      <p class="text-center fz-48"
         style="margin-bottom: .45rem">{{useCode}}</p>
      <img :src="qrCode" alt="" class="qr">
    </section>
    <comment @toast="toast"
             @showLoad="showLoad"
             :tokenPromise="tokenPromise"
             v-else></comment>
    <v-toast ref="toast" :tip="tip"></v-toast>
  </div>
</template>

<script>
  import vHead from '@/components/common/v-head'
  import comment from './comment'
  import {bargainCheckQr} from "@/assets/js/comm";
  import {callAppMethod} from "@/assets/js/jsBridge";
  import QRCode from 'qrcode';

  export default {
    name: "checkSale",
    components: {
      vHead,
      comment
    },
    props: ['tokenPromise'],
    data(){
      return{
        success: 0,
        token: '',
        bargainTasksId: this.$route.query.bargainTasksId,
        detail: this.$route.params.detail,
        tip: '',
        qrInfo: '',
        useCode: '',
        qrCode: '',
        timer: ''
      }
    },
    watch: {
      useCode(){
        this.createQrCode(this.useCode);
      }
    },
    created(){
      callAppMethod('17');
    },
    mounted() {
      var _self = this;
      _self.tokenPromise.then(res => {
        _self.token = res;
        _self.init();
      })
    },
    methods: {
      init(){
        var _self = this;
        if(_self.detail.isHasComment == 0 && _self.detail.isUse == 1){
          _self.success = 1;
        }else{
          _self.bargainCheckQr();
          _self.timer = setInterval(() => {
            _self.bargainCheckQr();
          },2000)
        }
      },
      toast(tip){
        this.tip = tip;
        this.$refs.toast.toast();
      },
      showLoad(status){
        this.$emit('showLoad',status)
      },
      bargainCheckQr(){
        var _self = this;
        var _data = {
          token: String(_self.token),
          bargainTasksId: String(_self.bargainTasksId)
        };
        bargainCheckQr(_data).then(res => {
          if(res.data.state == 1){
            _self.qrInfo = res.data.data;
            _self.useCode = res.data.data.useCode;
          }else if(res.data.state == 916416){
            _self.toast('已核销');
            _self.success = 1;
            clearInterval(_self.timer);
          }else{
            _self.toast(decodeURIComponent(res.data.msg))
          }
        })
      },
      /*生成二维码*/
      createQrCode(msg){
        var _self = this;
        QRCode.toDataURL(msg,{margin:0}, function (err, url) {
          _self.qrCode = url;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .checkSale{
    .thumb{
      display: block;
      width: 2rem;
      height: 2rem;
      border-radius: .2rem;
      background: #0d0d0f;
    }
    .qr{
      display: block;
      width: 4.2rem;
      height: 4.2rem;
      margin: 0 auto;
      background: #0d0d0f;
    }
  }
</style>
