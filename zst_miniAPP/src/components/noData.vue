<template>
    <div v-if="boolVis">
        <div class="all_empty">
            <div class="empty_img">
              <img src="../../static/img/common/empty.png" alt="">
            </div>

            <div class="em_title">
                {{noticeMes}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:['showNoData','noticeMes'],
        name: "noData",
        data(){
          return {
            boolVis:false,
            noticeMes:''
          }
        },
        watch:{
          showNoData(val){
            this.boolVis = val;
          },
          noticeMes(val){
            this.noticeMes = val;
          }
        },
        methods:{

        }
    }
</script>

<style lang="scss" scoped>
.all_empty{
  margin-top:300rpx;
  .empty_img{
    width:100%;
    height:332rpx;
    display: flex;
    justify-content: center;
    margin-top:300rpx;
    margin-bottom:60rpx;
    img{
      width:332rpx;
      height:332rpx;
      display: block;
    }
  }
  .em_title{
    font-size: 36rpx;
    text-align: center;
  }
}
</style>
