<template>
  <div class="logistics">
    <section class="box_padding bg-0C8DEB fc-ffffff" style="height: 2.8rem;padding: .34rem;">
      <p class="text-center fz-36"
         style="margin-bottom: .24rem">{{logisticsInfo.State == 2 ? '在途中' : logisticsInfo.State == 3 ? '已签收' : logisticsInfo.State == 4 ? '问题件' : '未签收'}}</p>
      <div class="flex_box">
        <img :src="imgUrl" alt=""
             class="thumb"
             style="margin-right: .4rem">
        <div class="fz-24 box_padding flex_box flex_column justify_space_between"
             style="padding: .14rem 0">
          <p>物流状态:{{logisticsInfo.State == 2 ? '在途中' : logisticsInfo.State == 3 ? '已签收' : logisticsInfo.State == 4 ? '问题件' : '未签收'}}</p>
          <p>承运来源:{{companyName}}快递</p>
          <p>运单编号:{{logisticsInfo.LogisticCode}}</p>
        </div>
      </div>
    </section>
    <section class="main box_padding" style="padding: .8rem .4rem">
      <main>
        <div class="line"></div>
        <div class="flex_box" style="margin-bottom: .62rem" v-for="(item,index) in Traces" :key="index">
          <div class="fc-ffffff" :class="{'status': item.status,'trace': !item.status}">{{item.status == 1 ? '完成' : item.status == 2 ? '派件' : item.status == 3 ? '收件' : item.status == 4 ? '运输' : ''}}</div>
          <div style="width: 5rem">
            <p class="fz-24" v-html="item.AcceptStation"></p>
            <p class="fc-8D8E98" style="font-size: .18rem">{{item.AcceptTime}}</p>
          </div>
        </div>
      </main>
    </section>
    <v-toast ref="toast" :tip="tip"></v-toast>
  </div>
</template>

<script>
  import {searchLogistics} from "@/assets/js/comm";
  import {postTitle} from "@/assets/js/jsBridge";

  export default {
    name: "index",
    data(){
      return{
        shipperCode: this.$route.query.ShipperCode,
        logisticCode: this.$route.query.LogisticCode,
        imgUrl: decodeURIComponent(this.$route.query.imgUrl),
        tip: '',
        logisticsInfo: '',
        Traces: '',
        companyName: ''
      }
    },
    methods: {
      toast(tip){
        this.tip = tip;
        this.$refs.toast.toast()
      },
      searchLogistics(){
        var _self = this;
        var _data = {
          shipperCode: String(_self.shipperCode),
          logisticCode: String(_self.logisticCode)
        };
        searchLogistics(_data).then(res => {
          if(res.data.state == 1){
            _self.logisticsInfo = res.data.data;
            _self.Traces = res.data.data.Traces;
            _self.companyName = res.data.couriercompany.companyName;
            _self.Traces.forEach(ele => {
              if(ele.AcceptStation.indexOf('派送') > -1){
                ele.status = 2;   //2 派送
              }else if(ele.AcceptStation.indexOf('已签收') > -1){
                ele.status = 1;   //1 已签收
              }
              ele.AcceptStation = _self.phoneDeal(ele.AcceptStation);
            });
            _self.Traces[0].status = 3;   //收件
            _self.Traces[1].status = 4;   //发货
            _self.Traces = _self.Traces.reverse();
          }else{
            _self.toast(decodeURIComponent(res.data.msg));
          }
        })
      },
      phoneDeal(str){
        var regexp=/[0-9]{11}/;
        if(str.match(regexp)){
          var phone = str.match(regexp)[0];
          var strs = str.split(phone);
          var tel = 'tel:' + phone;
          var newStr = strs[0] + `<a href="${tel}" style='color: #0C8DEB;'>${phone}</a>)`/*"<a href=  style='color: #0C8DEB;'" +">" + phone + "</a>" + strs[1]*/;
          return newStr
        }else{
          return str;
        }
      }
    },
    mounted() {
      postTitle('查看物流');
      var companyCode = 'SF,shunfeng,HTKY,shentong,STO,tiantian,HHTT';
      if(companyCode.indexOf(this.shipperCode) > -1){
        var companyName,com;
        if(this.shipperCode == 'shunfeng' || this.shipperCode == 'SF'){
          companyName = '顺丰快递';
          com = 'shunfeng';
        }else if(this.shipperCode == 'HTKY'){
          companyName = '百世快递';
          com = 'huitongkuaidi'
        }else if(this.shipperCode == 'shentong' || this.shipperCode == 'STO'){
          companyName = '申通快递';
          com = 'shentong';
        }else if(this.shipperCode == 'tiantian' || this.shipperCode == 'HHTT'){
          companyName = '天天快递';
          com = 'tiantian';
        }
        this.$router.replace({
          name: 'nonsupport',
          query: {
            companyName: companyName,
            logisticCode: this.logisticCode,
            com: com
          }
        })
      }else{
        this.searchLogistics();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fc-0C8DEB{
    color: #0C8DEB;
  }
  .bg-0C8DEB{
    background: #0C8DEB;
  }
  a{
    color: #0C8DEB!important;
  }
  .thumb{
    display: block;
    width: 1.4rem;
    height: 1.4rem;
    background: #0D0D0D;
  }
  .main{
    width: 7.25rem;
    position: absolute;
    top: 2.55rem;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    background: #FFFFFF;
    border-radius: .2rem;
    box-shadow: .02rem 0 .36rem .03rem rgba(12,12,12,.1);
    main{
      width: 100%;
      height: 100%;
      position: relative;
      .line{
        width: .02rem;
        height: 100%;
        background: #E5E5E5;
        position: absolute;
        top: 0;
        left: .3rem;
      }
      .status{
        width: .6rem;
        height: .6rem;
        border-radius: 50%;
        background: #0C8DEB;
        font-size: .2rem;
        text-align: center;
        line-height: .6rem;
        margin-right: .77rem;
        z-index: 10;
      }
      .trace{
        width: .3rem;
        height: .3rem;
        border-radius: 50%;
        background: #0C8DEB;
        z-index: 10;
        margin-left: .15rem;
        margin-right: .92rem
      }

    }
  }
</style>
