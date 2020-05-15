<template>
   <div class="page_index">
      <div class="page_top">
          <div class="page_head">
            <img :src="storeLogo" alt="">
          </div>
          <div class="page_bot">
              {{storeName}}
          </div>
      </div>
     <div class="all_con">
       <div class="inner_top">
         <div class="in_to_le">
           <i class="iconfont icon-shouji" style="color:#D1D1D1;"></i>
         </div>
         <div class="in_to_ri">
           <input type="number" placeholder="请输入绑定手机号" v-model="phoneInput" style="width:600rpx;">
         </div>
       </div>

       <div class="inner_top">
         <div class="in_to_le">
           <i class="iconfont icon-dunpai1" style="color:#D1D1D1;"></i>
         </div>
         <div class="in_to_ri">
           <input type="number"  v-model="codeInput"  placeholder="请输入验证码" style="width:368rpx;margin-right:30rpx;">
         </div>
         <button class="get_btn" :disabled='disabled' :class="showBool?'showB':''"   @click="veriFication">
           {{text}}
         </button>
       </div>

       <div class="inner_top">
         <div class="in_to_le">
           <i class="iconfont icon-qiahao" style="color:#D1D1D1;"></i>
         </div>
         <div class="in_to_ri">
           <input type="number" placeholder="请输入卡号" v-model="cardInput" style="width:600rpx;">
         </div>
       </div>
     </div>
     <div class="con_btn" @click="replPhone">
       <div class="con_btn_btn">
          确定绑定
       </div>
     </div>
   </div>
</template>

<script>
  import Tips from '@/common/js/tips'
  import { getSignIn ,getQuery} from '@/common/js/comm'
  import md5 from 'js-md5';
  export default {
    data(){
      return {
        phoneInput:'',
        codeInput:'',
        passInput:'',
        text:'获取验证码',
        currentTime: 60,
        disabled: false,
        showBool:false,
        interval:'',
        cardInput:'',
        shopStoreId:'',
        token:'',
        storeLogo:'',
        storeName: '',
        refStoreId:'',
        timer:'',
        time:1,
        scene:'',
      }
    },
    mounted(){
      var par = getQuery();
      console.log(par);
      this.token = this.$store.state.token;
      if(this.token != "") {
        if(par.scene) {
          this.scene = par.scene;
          var arr = encodeURIComponent(par.scene).split(',');
          console.log(arr);
          this.shopStoreId = arr[0];
          this.getDetail();
        }else{
          Tips.toast('你没有携带的scene','none')
        }
      }else{
        const url = `../../pages/loginpage/main?scene=${par.scene}`;
        wx.navigateTo({url})
      }
    },
    onUnload(){
      this.showBool = false;
      this.currentTime = 60;
      this.disabled = false;
      this.text = '发送验证码';
      clearInterval(this.interval);
    },
    methods:{
      backIndex(){
        wx.switchTab({
          url:'/pages/index/main'
        })
      },
      getDetail(){
        var _this = this;
        var _data = {
          token:_this.token,
          shopStoreId:_this.shopStoreId,
          distance:_this.distance?_this.distance:'',
        }
        getSignIn(_data).then(sec=>{
          _this.$http.recomDetail(_data,sec).then(res=>{
            console.log(res);
            if(res.state ==1) {
                this.storeLogo = res.data.storeLogo;
                this.storeName = res.data.storeName;
                this.refStoreId = res.data.refStoreId ;
            }else if(res.state == 10000){
              const url = `../../pages/loginpage/main?scene=${this.scene}`;
              wx.navigateTo({url})
            }else{
              Tips.toast(`${res.msg}`,'none');
            }
          })
        })
      },
      veriFication(){
        var _this = this;
        _this.disabled = true;
        console.log(_this.phoneInput);
        var phone = _this.phoneInput;
        if(phone==''){
          Tips.toast('请输入手机号','none');
          _this.disabled = false;
          return false
        }
        else if(phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
          Tips.toast('手机号码不正确','none');
          _this.disabled = false;
          return false;
        }else {
          var _data = {
            phone:phone,
            type:12,
            smsType:1
          };
          var timeStr = _this.getCuuData();
          var str = `1hehe^_^haha!ysyhl9t@flzx3000c${timeStr}${phone}`;
          var sec = md5(str);
          _this.$http.getVid(_data,sec).then(res=>{
            console.log('获取一下短信验证码',res);
            if(res.state ==1) {
              _this.showBool = true;
              Tips.toast('短信验证码已发送', 'success');
              this.interval = setInterval(function () {
                _this.currentTime--; //每执行一次让倒计时秒数减一
                _this.text = '';
                _this.text = `${_this.currentTime}s`;
                if (_this.currentTime <= 0) {
                  clearInterval(_this.interval);
                  _this.showBool = false;
                  _this.text = '重新发送';
                  _this.currentTime = 60;
                  _this.disabled = false;
                }
              }, 1000)
            }else{
              Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
              _this.disabled = false;
            }
          })
        }
      },
      getCuuData(){
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month =myDate.getMonth()+1;
        if(month < 10){
          month = `0${month}`
        }
        var day =myDate.getDate();
        if(day<10){
          day = `0${day}`
        }
        return `${year}${month}${day}`
      },
      replPhone(){
        console.log(1111);
        var _this = this;
        var _data = {
          token:_this.$store.state.token,
          phone:_this.phoneInput,
          smsCode:_this.codeInput,
          cardNO:_this.cardInput,
          refStoreId:_this.refStoreId
        }
        if(_data.phone == ''){
          Tips.toast('请输入手机号', 'none');
          return
        }
        else if(_data.smsCode == ''){
          Tips.toast('请输入验证码', 'none');
          return
        }else if(_data.cardNO==''){
          Tips.toast('请输入卡号', 'none');
          return
        }else{
          var _self = this;
          getSignIn(_data).then(sec=>{
            _this.$http.hangbBinduser(_data,sec).then(res=>{
              if(res.state == 1){
                Tips.toast(`绑定成功，正在为你跳转`, 'none');
                wx.redirectTo({
                  url:'/pages/packageD/pages/mySvipcard/main?pageFrom=isCarder'
                })
              } else{
                Tips.toast(`${decodeURIComponent(res.msg)}`,'none')
              }
              console.log(res);
            })
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
.page_index{
  width:680rpx;
  padding:0 35rpx;
  height:100vh;
  .page_top{
    width:100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top:140rpx;
    margin-bottom:76rpx;
    .page_head{
      width:150rpx;
      height:150rpx;
      background:#ff6700;
      border-radius: 50%;
      margin-bottom:20rpx;
      img{
        width:100%;
        height:100%;
        display: block;
        border-radius: 50%;
      }
    }
  }
  .all_con{
    width:94%;
    margin:0 3%;
    box-shadow:0 3px 7px 0 rgba(178,195,204,0.09);
    .inner_top{
      width:100%;
      display: flex;
      align-items: center;
      border-bottom: 2rpx solid rgba(92,95,113,0.2);
      padding:20rpx 0;
      .in_to_le{
        float: left;
        i{
          font-size: 40rpx;
          margin-right:20rpx;
          color:#5C5F71;
        }
      }
      .in_to_ri{
        float: left;
        font-size:33rpx;
      }
      .get_btn{
        width:170rpx;
        height:60rpx;
        border:2rpx solid #F7094D;
        border-radius: 6rpx;
        font-size: 24rpx;
        color:#F7094D;
        background:#fff;
        padding:0 10rpx;
      }
      .showB{
        color:#5C5F71;
        border:2rpx solid #5C5F71;
      }
    }
  }
  .con_btn{
    width:100%;
    height:85rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .con_btn_btn{
      width:625rpx;
      height:100%;
      background:#F7094D;
      margin-top:70rpx;
      line-height: 85rpx;
      text-align: center;
      font-size: 38rpx;
      color:#fff;
      border-radius: 10rpx;
    }
  }
}
</style>
