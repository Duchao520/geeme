<template>
  <div class="bg">
    <div class="flex_box box_padding align_center" style="padding: .24rem .51rem">
      <div class="logo">
        <img :src="logo" alt="">
      </div>
      <span class="fz-48 txt-ellipsis" style="color: #0D0D0F;display: block;width: 5rem">{{storeName}}</span>
    </div>
    <div class="notPayChanel box_padding padding-35">
      <img src="@/assets/imgs/svip/notChanel.png" alt="">
      <p class="fz-36" style="text-align: center;margin-bottom: 1rem">该商家未开通收银系统和卡主功能</p>
      <router-link :to="{name: 'approvePayChanel'}" tag="button" class="btn_radius bg-FEB623 fz-36 fc-ffffff">如何开通收银系统?</router-link>
      <router-link :to="{name: 'cardMaster'}" tag="button" class="btn_radius bg-F60F51 fz-36 fc-ffffff">如何开通卡主功能?</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "notPayChanel",
    data(){
      return{
        logo: this.$route.query.logo,
        storeName: this.$route.query.storeName
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bg{
    background: #F2F2F2;
    .logo{
      display: block;
      width: 1rem;
      height: 1rem;
      /*background: #FF4F81;*/
      border-radius: 50%;
      overflow: hidden;
      margin-right: .3rem;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .notPayChanel{
      background: #FFFFFF;
      border-radius: .2rem .2rem 0 0;
      img{
        display: block;
        width: 4.82rem;
        height: 1.91rem;
        margin: 3rem auto .82rem;
      }
      button{
        display: block;
        width: 100%;
        height: .9rem;
        margin-bottom: .44rem;
      }
    }
  }
</style>
