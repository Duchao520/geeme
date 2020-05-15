<template>
  <div class="page">
      <div class="input_num">
        <input type="number"  v-model="number" @blur="testPage"  placeholder="请输入推荐人助商通id账号">
      </div>
      <div class="input_text">
          注：推荐人修改仅有一次机会
      </div>
      <div class="bind_btn">
         <div class="btn_btn" @click="bind_pople">
               绑定
         </div>
      </div>
  </div>
</template>

<script>
  import { getQuery , getSignIn , utf8Decode} from '@/common/js/comm'
  import Tips from '@/common/js/tips'
    export default {
        name: "index",
        data(){
          return {
             number:'',
             postNumber:false
          }
        },
        methods:{
          bind_pople(){
            this.testPage();
            if(this.postNumber){
                var _data={
                  token:this.$store.state.token,
                  userName:this.number,
                }
                getSignIn(_data).then(sec=>{
                   this.$http.postInvite(_data,sec).then(res=>{
                     console.log('输入成功后的页面反应',res);
                     if(res.state == 1){
                       Tips.toast('添加成功' , 'none');
                       wx.switchTab({
                         url: '../../../../pages/personal/main'
                       })
                     }else{
                       Tips.toast(decodeURIComponent(res.msg),'none');
                       return false;
                     }
                   })
                })
            }else{
              Tips.toast(decodeURIComponent(res.msg),'none');
              return false;
            }
          },
          testPage(){
            var reg = /^[0-9]*$/ ;
            if(this.number==''){
              Tips.toast('请输入推荐人','none');
              return false;
            }
            var ref = reg.test(this.number);
            if(!ref){
              Tips.toast('请输入数字','none')
              this.number = '';
              return false;
            }
            this.postNumber = true;
          }
        }
    }
</script>

<style  lang="scss" scoped>
.page{
  width:100%;
  overflow: hidden;
  .input_num{
    width: 750rpx;
    height: 100rpx;
    display:flex;
    justify-content: center;
    align-items: center;
    margin-top:60rpx;
    input{
      width:620rpx;
      height:96rpx;
      border:2rpx solid #eeeeee;
      padding-left:30rpx;
    }
  }
  .input_text{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    padding:40rpx;
  }
  .bind_btn{
    width:750rpx;
    height:100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn_btn{
      width:620rpx;
      height:92rpx;
      background:#F7094D;
      text-align: center;
      line-height: 92rpx;
      color:#fff;
    }
  }
}
</style>
