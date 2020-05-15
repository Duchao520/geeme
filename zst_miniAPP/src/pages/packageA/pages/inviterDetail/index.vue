<template>
    <div class="page_inviter">
        <div class="inv_top">
            <img src="../../static/img/invDetail.png" alt="">
        </div>
        <div class="inD_con">
            <div class="ind_con_top">
                <div class="ind_name">{{dataList.nick}}</div>
                <div class="ind_id">{{dataList.username}}</div>
            </div>

            <div class="ind_eve">
               <div class="ind_le">性别</div>
               <div class="ind_ri">{{dataList.gender == 1 ? '男':'女'}}</div>
            </div>

          <div class="ind_eve">
            <div class="ind_le">地区</div>
            <div class="ind_ri">{{dataList.cityName}}</div>
          </div>

          <div class="ind_eve">
            <div class="ind_le">来源</div>
            <div class="ind_ri">{{dataList.registeSource}}</div>
          </div>

          <div class="ind_eve">
            <div class="ind_le">注册时间</div>
            <div class="ind_ri">{{dataList.createtime}}</div>
          </div>

        </div>
    </div>
</template>

<script>
  import { getQuery , getSignIn ,getYeMoDa} from '@/common/js/comm'

    export default {
        name: "index",
        data(){
          return {
            imAccount:'',
            dataList:''
          }
        },
        mounted(){
          var par = getQuery();
          console.log(par);
          this.imAccount = par.imAccount;
          this.getMes();
        },
        methods:{
          getMes(){
            var _this = this;
             var _data = {
               imAccount:this.imAccount,
               token:this.$store.state.token
             }
            getSignIn(_data).then(sec=>{
              _this.$http.getinDetail(_data,sec).then(res=>{
                // 0应用市场app 1推广海报 2卡淘商城注册 3商家推广链接 4微信平台  5QQ平台  6新浪平台  7阿里平台  8应用市场糖公鸡 9糖公鸡推广海报 10微信公众号  11我的会员
                console.log(res.data);
                if(res.data.registeSource  == 0){
                  res.data.registeSource = '应用市场app'
                }
                if(res.data.registeSource  == 1){
                  res.data.registeSource = '推广海报'
                }
                if(res.data.registeSource  == 2){
                  res.data.registeSource = '卡淘商城注册'
                }
                if(res.data.registeSource  == 3){
                  res.data.registeSource = '商家推广链接'
                }
                if(res.data.registeSource  == 4){
                  res.data.registeSource = '微信平台'
                }
                if(res.data.registeSource  == 5){
                  res.data.registeSource = 'QQ平台'
                }
                if(res.data.registeSource  == 6){
                  res.data.registeSource = '新浪平台'
                }
                if(res.data.registeSource  == 7){
                  res.data.registeSource = '阿里平台'
                }
                if(res.data.registeSource  == 8){
                  res.data.registeSource = '应用市场糖公鸡'
                }
                if(res.data.registeSource  == 9){
                  res.data.registeSource = '糖公鸡推广海报'
                }
                if(res.data.registeSource  == 10){
                  res.data.registeSource = '微信公众号'
                }
                if(res.data.registeSource  == 11){
                  res.data.registeSource = '我的会员'
                }
                res.data.createtime = getYeMoDa(res.data.createtime *1000);
                this.dataList = res.data;
              })
            })
          }
        }
    }
</script>

<style lang="scss" scoped>
.page_inviter{
  width:100%;
  .inv_top{
    width:100%;
    height:225rpx;
    position: relative;
    margin-bottom:80rpx;
    img{
      width:100%;
      height:100%;
    }
  }
  .inD_con{
    width:90%;
    padding:0 5%;
    .ind_con_top{
      margin-bottom:30rpx;
      .ind_name{
        font-size:40rpx;
        font-weight: 600;
      }
      .ind_id{
        font-size: 28rpx;
      }
    }
    .ind_eve{
      display:flex;
      justify-content: space-between;
      align-items: center;
      border-bottom:2rpx solid rgba(60,52,83,0.3);
      padding:20rpx 0;
    }
  }
}
</style>
