<template>
  <div class="detail">
    <div class="detail-item">收益类型：{{detail.title}}</div>
    <div class="detail-item">用户账号： {{detail.username}}</div>
    <div class="detail-item" v-if="detail.shopName">店铺名称:{{detail.shopName}}</div>
    <div class="detail-item">收入比例：{{detail.incomeRatio*100 + '%'}}</div>
    <div class="detail-item">分成比例：{{detail.fenChengRate *100 + '%'}}</div>
    <div class="detail-item">付款金额：{{detail.payMoney}}</div>
    <div class="detail-item">收益金额：<i>￥{{detail.transMoney}}</i></div>
  </div>
</template>

<script>
  import {earnDetail} from "@/assets/js/comm";
  import {getSignIn , timestampToTime , postTitle} from "@/assets/js/jsBridge";

  export default {
    name: "earnDetail",
    data(){
      return{
        zstamountslogId: this.$route.query.zstamountslogId,
        type: this.$route.query.type,
        detail: '',
        typeName: ''
      }
    },
    methods: {
      init(){
        var _self = this;
        postTitle('收益详情');
        _self.typeInit();
        _self.getDetail();
      },
      typeInit(){
        var _self = this;
        if(_self.type == 1){
          _self.typeName = '用户'
        }else if(_self.type == 2){
          _self.typeName = '商家'
        }else if(_self.type == 3){
          _self.typeName = '服务商'
        }
      },
      getDetail(){
        var _self = this;
        var _data = {
          zstamountslogId: String(_self.zstamountslogId),
          type: String(_self.type)
        };
        getSignIn(_data).then(sec => {
          earnDetail(_data,sec).then(res => {
            if(res.data.state == 1){
              _self.detail = res.data.data;
            }
          })
        })
      }
    },
    mounted() {
      var _self = this;
      _self.init();
    }
  }
</script>

<style lang="scss" scoped>
  .detail{
    box-sizing: border-box;
    padding: .41rem .29rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .detail-item{
      width: 100%;
      display: flex;
      font-size: .3rem;
      margin-bottom: .3rem;
      i{
        color: #FF034B;
      }
    }
    .space_between{
      justify-content: space-between;
      p{
        font-size: .28rem;
        color: #94969B;
        align-items: flex-end;
        i{
          font-size: .2rem;
          margin-left: .08rem;
        }
      }
    }
  }
</style>
