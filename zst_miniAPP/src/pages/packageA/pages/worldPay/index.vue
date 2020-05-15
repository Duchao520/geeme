<template>
  <div class="page">
     <div class="page_top">
        <div class="page_top_inner">
            <div class="page_inn_le">
               <div class="inn_le_top">{{phone}}</div>
               <div class="inn_le_bot"><span>昵称：{{nickName}}</span></div>
            </div>
            <div class="page_inn_ri">
              <img :src="imgUrl" alt="">
            </div>
        </div>

       <div class="page_mid_inner">
           <div class="page_min_top">
             <div class="input_inner">
               <span>充值卡号：</span>
               <input type="number" class="input_input"  v-model="cardNum"   placeholder="请输入充值卡号">
             </div>
             <i class="iconfont icon-saoyisao" @click="scanGetInner"></i>
           </div>
           <div class="page_min_bot">
             <div class="input_inner">
               <span>充值密码：</span>
               <input type="password" class="input_input" v-model="inputPassword"  placeholder="请输入卡片密码">
             </div>
           </div>
       </div>

       <div class="btn_value" @click="summerCurrent">
          <div class="btn_inner">
             立即充值
          </div>
       </div>
     </div>
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate} from '@/common/js/comm';
  import Tips from '@/common/js/tips'
  export default {
    name: "index",
    data(){
      return {
         imgUrl:'',
         nickName:'',
         phone:'',
         cardNum:'',
         inputPassword:'',
      }
    },
    mounted(){
      this.imgUrl = this.$store.state.avatar;
      this.nickName = this.$store.state.nickname;
      this.phone = this.$store.state.phone;
    },
    methods:{
      summerCurrent(){
        let scimmer =/^[0-9]*$/;
        console.log('啦啦',scimmer.test(this.cardNum));
        if(this.cardNum == ''){
           Tips.toast('请输入卡号','none');
           return false
        }else if(!(scimmer.test(this.cardNum))){
            Tips.toast('请输入数字','none');
            this.cardNum = '';
            return false
        }
        if(this.inputPassword == ''){
          Tips.toast('请输入密码','none');
          return false
        }
        var _data = {
          token:this.$store.state.token,
          cardnum:this.cardNum,
          cardpwd:this.inputPassword
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.getWorldPage(_data,sec).then(res=>{
             if(res.state ==1){
               console.log(res);
               wx.navigateTo({
                 url:`../../pages/worldPayEnd/main?money=${res.money}&totalmoney=${res.totalmoney}`
               })
             }else{
               Tips.toast(`${decodeURIComponent(res.msg)}`,'none')
             }
          })
        })
      },
      scanGetInner(){
        var _this = this;
        wx.scanCode({
          success(res) {
            console.log(res.result);
            _this.cardNum = res.result;
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .placeholderStyle{
    font-size: 28rpx;
  }
  .page{
    width:100%;
    position: absolute;
    left:0;right:0;top:0;bottom:0;
    background:#eeeeee;
    margin:auto;
    .page_top{
      width:100%;
      background:#fff;
      margin-top:30rpx;
      .page_top_inner{
        width:710rpx;
        margin:0 20rpx;
        background:#fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:20rpx 0;
        border-bottom:2rpx solid #cccccc;
        .page_inn_le{
          .inn_le_top{
            font-size: 28rpx;
            font-weight: 700;
          }
          .inn_le_bot{
            font-size: 30rpx;
            color:#808080;
          }

        }
        .page_inn_ri{
          width:134rpx;
          height:134rpx;
          background:purple;
          border-radius: 6rpx;
          img{
            width:100%;
            height:100%;
            border-radius: 6rpx;
          }
        }
      }
      .page_mid_inner{
          width:710rpx;
          margin:0 20rpx;
          padding:40rpx 0;
          border-bottom:2rpx solid #cccccc;
        .page_min_top{
          display: flex;
          justify-content: space-between;
          i{
            color:#F7094D;
            font-weight: 700;
            font-size: 40rpx;
          }
          .input_inner{
            display: flex;
            align-items: center;
            span{
              font-weight: 700;
            }

          }
        }
        .page_min_bot{
          display: flex;
          justify-content: space-between;
          margin-top:86rpx;
          i{
            color:#F7094D;
            font-weight: 700;
          }
          .input_inner{
            display: flex;
            align-items: center;
            span{
              font-weight: 700;
            }
            .input_input{

            }
          }
        }
      }
      .btn_value{
        height:212rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn_inner{
          width:626rpx;
          height:84rpx;
          background:linear-gradient(0deg,rgba(247,9,77,1),rgba(255,139,139,1));
          color: #ffffff;
          border-radius: 8rpx;
          text-align: center;
          line-height: 84rpx;
          font-size:38rpx;
        }
      }
    }
  }
</style>
