<template>
  <div class="active-list">
    {{winRule}}
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate} from '@/common/js/comm';
  export default {
    data(){
      return{
        winRule:''
      }
    },
    mounted(){
      var par =getQuery();
      this.winRule = par.winRule;
    },
    methods: {

    }

  }
</script>

<style lang="scss" scoped>
  .active-list{
     width:710rpx;
     padding:20rpx 20rpx;
     font-size: 30rpx;
  }
</style>
