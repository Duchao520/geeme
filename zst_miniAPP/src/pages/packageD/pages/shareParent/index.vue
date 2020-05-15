<template>
  <div class="page">
    <div class="page_img">
      <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/6/5/5b7050cc8ba68504a0b6ae4a0056eed9.png" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return {

      }
    },
    mounted(){

    },
    methods:{

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
      height:2312rpx;
      background:#ffffff;
      img{
        width:100%;
        height:100%;
      }
    }
  }
</style>
