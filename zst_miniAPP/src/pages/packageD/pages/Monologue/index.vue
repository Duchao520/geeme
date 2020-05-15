<template>
    <div class="page">
       <div class="page_img" :style="{'height':height}">
         <img :src="detailurl" alt="">
       </div>
    </div>
</template>

<script>
  import { getSignIn , getQuery} from '@/common/js/comm'
    export default {
        name: "index",
        data(){
            return {
               id:'',
               detailurl:'',
               height:'3232rpx'
            }
        },
        mounted(){
           var par = getQuery();
           console.log(par);
           this.id = par.id;
           if(par.id==1){
             this.height = '2312rpx'
           }else{
             this.height = '3232rpx'
           }
           this.detailurl = par.detailurl;
           this.postTimes();
        },
        methods:{
            postTimes(){
              var _data = {
                token:this.$store.state.token,
                bannerRegionId:this.id,
              }
              var _this = this;
              getSignIn(_data).then(sec=>{
                _this.$http.postTimes(_data,sec).then(res=>{
                  console.log(res);
                })
              })
            }
        },
      onShareAppMessage: function (res) {
        return {
          title: '',
          path: '',
          imageUrl: '',
          success: function (shareTickets) {
            console.info(shareTickets + '成功');
            // 转发成功
          },
          fail: function (res) {
            console.log(res + '失败');
            // 转发失败
          },
          complete: function (res) {
            // 不管成功失败都会执行
          }
        }
      }
    }
</script>

<style lang="scss" scoped>
.page{
  width:100%;
  .page_img{
    width:750rpx;
    background:#ffffff;
    img{
      width:100%;
      height:100%;
    }
  }
}
</style>
