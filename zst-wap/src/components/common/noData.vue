<template>
    <div v-if="boolVis">
        <div class="all_empty">
            <div class="empty_img">
              <img src="@/assets/imgs/svip/empty.png" alt="">
            </div>

          <div class="em_title">
              {{mess}}
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
            mess:''
          }
        },
        watch:{
          showNoData(val){
            this.boolVis = val;
          },
          noticeMes(val){
            this.mess = val;
          }
        },
        methods:{

        }
    }
</script>

<style lang="scss" scoped>
.all_empty{
  position: absolute;
  left:0;right:0;
  bottom:0;top:0;
  .empty_img{
    width:100%;
    height:3.32rem;
    display: flex;
    justify-content: center;
    margin-top:3rem;
    margin-bottom:.6rem;
    img{
      width:3.32rem;
      height:3.32rem;
      display: block;
    }
  }
  .em_title{
    font-size: .36rem;
    text-align: center;
  }
}
</style>
