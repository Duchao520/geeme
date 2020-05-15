<template>
  <div :class="{top:true,active:register}">
      <div class="title">
        <img src="/static/images/geeme-logo.svg" @click="toSite" class="to-web-site">
        <span class="title_text">|</span>
        <span>{{header.title}}</span>
      </div>
      <div class="phone" v-show="header.isphone">
          <div class="phone-icon"></div>
          <div class="phone-text">
            <div class="p-t-top">7*12小时客服热线</div>
            <div class="p-t-bottom">400-800-0650</div>
          </div>
      </div>
    </div>

</template>
<script>
export default {
  props: ['header','register'],
  data(){
    return{
      boxShow:false
    }
  },
  methods: {
    toSite (){
      window.open('https://www.geeme.cn')
    }
  },
  mounted(){
    this.calBgImage = (document.body.clientWidth/document.body.clientHeight) > 1.92
    window.addEventListener('resize',() => {

        let box = document.documentElement.clientWidth/document.documentElement.clientHeight
        this.boxShow = box<1

    })
  }
}
</script>

<style lang="scss">
  .top{
      width: 1200px;
      height: 80px;
      margin:0 auto;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      &.active{
        width: 100%;
        padding: 0 20px;
        background-color: white;
        box-shadow: 0px 2px 8px 0px rgba(174, 184, 229, 0.3);
        .title{
          width: 1400px;
          margin: auto;
        }
      }
        .title{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .title_text{
              color: #DCDFE6;
              font-size: 17px;
              line-height: 80px;
              display: block;
              margin: 0 19px;
          }
          img{
            width:161px;
            height:48px;
          }
          span{
              color: #999999;
              font-size: 22px;
              line-height: 30px;

          }
        }
        .phone{
          display: flex;
          flex-wrap: nowrap;
          justify-content: flex-end;
          align-items: center;
         .phone-icon{
           width: 41px;
           height: 41px;
           background: url('../../assets/img/login_phone.png') no-repeat center center/100% auto;
         }
         .phone-text{
           .p-t-top{
             color: #FFFFFF;
             font-size: 12px;
             display: block;
             margin-left: 2px;
           }
           .p-t-bottom{
             color: #FFFFFF;
             font-size: 20px;
             line-height: 20px;
             font-weight: normal;
             font-family: PingFangSC-Regular;
           }
         }
        }


    }
    .top.active{
      width: auto;
    }
    .to-web-site {
      &:hover {
        cursor: pointer;
      }
    }
</style>


