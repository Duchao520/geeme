<template>
    <div class="page">
        <div class="img_bg">
          <img :src="images" alt="">
        </div>
        <div class="pa_top">
            <div class="top_con">
               <div class="le_con">
                   <div class="circle" style="width:10rpx;height:10rpx;border-radius: 50%;background:#E00F41;">
                   </div>
               </div>
               <div class="ri_con">
                  <div class="ri_con_top">
                    助商通卡主，分享创造价值
                  </div>
                  <div class="ri_con_bot" v-if="arr.length>1">
                    <span>{{textLe}}</span><span style="color:#E00F41;">{{text}}</span><span>{{textRi}}</span>
                  </div>
                 <div class="ri_con_bot" v-if="arr.length==1">
                   <span>{{textMes}}</span>
                 </div>
               </div>
            </div>
        </div>
        <div class="pa_bot">
           <div class="bot_con">
                <div class="bot_le_con" @click="goShop">
                    <div class="bot_le_title">
                        推荐商家
                    </div>
                    <div class="bot_le_img">
                      <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/dbdfa2502b4f35c3f0df2404ef7c8276.png " alt="">
                    </div>
                    <div class="bot_le_feature">
                      查看卡主商家
                    </div>
                </div>
                 <div class="mid_all_con" @click="goMyVip">
                    <div class="bot_mid_con">
                      <div class="bot_mid_title">
                        我的会员卡
                      </div>
                      <div class="bot_mid_img">
                        <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/b900b4f4affb4dbe1c6a1fa6276ccc99.png " alt="">
                      </div>
                      <div class="many_times" style="font-size: 24rpx;">
                           {{cards}}张
                      </div>
                      <div class="bot_mid_feature">
                        查看卡主商家
                      </div>
                    </div>
                 </div>
                <div class="bot_le_con" @click="goSvip">
                    <div class="bot_le_title">
                      了解卡主
                    </div>
                    <div class="bot_le_img">
                       <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/90971ce55dd1f3f1967079df931ce8c4.png " alt="">
                    </div>
                    <div class="bot_le_feature">
                      查看卡主宝典
                    </div>
                </div>
           </div>
        </div>
    </div>
</template>

<script>
  import { getSignIn } from '@/common/js/comm'
    export default {
        name: "index",
        data(){
          return {
            cards:'',
            images:'',
            text:'',
            arr:'',
            textLe:'',
            textRi:'',
            textMes:'',
          }
        },
       onShow(){
          let token = this.$store.state.token;
          if(token) {
            this.getCarder();
          }else{
            const url = `../../pages/loginpage/main`;
            wx.navigateTo({url})
          }
        },
        mounted(){

        },
        methods:{
          getCarder(){
              var _this = this;
              var _data = {
                token:this.$store.state.token,
                areaCode:this.$store.state.areaCode,
                userId:this.$store.state.userLiId
              }
              getSignIn(_data).then(sec=>{
                _this.$http.getCarder(_data,sec).then(res=>{
                  if(res.state==1) {
                    this.cards = res.data.bg_my_card_num;
                    this.images = res.data.bg_images;
                    let str = res.data.bg_title;
                    let reg = /<([^ >])+[^>]*>(?:[\S\s]*?<\/\1>)?/g;
                    var newStr = str.replace(reg, "");  //整体上一句话
                    var arr = newStr.split('+');   //按照加号分开
                    this.arr = arr;
                    var numP = res.data.bg_shop_amount;
                    this.text = `${numP}+`
                    if (arr.length > 1) {
                      var newArr = arr[0].replace(/\d/g, '');
                      this.textLe = newArr;
                      this.textRi = arr[1];
                    } else {
                      this.textMes = arr[0];
                    }
                    // this.text = str.replace(/[^0-9]/ig,"");
                  }else if(res.state == 10000){
                    const url = `../../pages/loginpage/main`;
                    wx.navigateTo({url})
                  }
                })
              })
          },
          goSvip(){
            wx.navigateTo({
               url:'/pages/packageA/pages/svipRules/main'
            })
          },
          goMyVip(){
            wx.navigateTo({
              url:'/pages/packageD/pages/mySvipcard/main?pageFrom=isCarder'
            })
          },
          goShop(){
            wx.navigateTo({
              url:'/pages/packageD/pages/shopRecom/main'
            })
          }
        }
    }
</script>

<style  lang="scss" scoped>
.page{
  position: absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  margin:auto;
  background:#fed7df;
  z-index: -2;
  .img_bg{
    position: absolute;
    left:0;right:0;
    bottom:0;
    width:100%;
    height:1667rpx;
    z-index:-1;
    img{
      width:100%;
      height:100%;
      display: block;
    }
  }
  .pa_top{
    width:100%;
    height:120rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:40rpx;
    .top_con{
      width:700rpx;
      height:100%;
      border-radius: 20rpx;
      background:#fff;
      .le_con{
        padding:24rpx;
        padding-top:30rpx;
        float: left;
      }
      .ri_con{
        float: left;
        height:100rpx;
        padding:10rpx;
        .ri_con_top{
          font-weight: 700;
          font-size: 36rpx;
        }
        .ri_con_bot{
          font-size: 30rpx;
        }
      }
    }
  }
  .pa_bot{
    width:100%;
    height:290rpx;
    position: absolute;
    bottom:50rpx;
    .bot_con{
      width:700rpx;
      height:100%;
      margin:0 25rpx;
      display:flex;
      justify-content: space-between;
      align-items: center;
      .bot_le_con{
        width:200rpx;
        height:262rpx;
        display:flex;
        align-items: center;
        flex-direction: column;
        border-radius: 10rpx;
        background:#fff;
        box-shadow: 0 0 2px 4px rgba(0, 0, 0, 0.08);
        .bot_le_title{
          font-size: 28rpx;
          padding-top:46rpx;
          font-weight:700 ;
        }
        .bot_le_img{
          width:125rpx;
          height:100rpx;
          margin-bottom:20rpx;
          img{
            width:100%;
            height:100%;
            display: block;
          }
        }
        .bot_le_feature{
          font-size: 20rpx;
          color:#F60F51;
        }
      }
      .mid_all_con{
        width:234rpx;
        height:306rpx;
        background:linear-gradient(144deg,rgba(251,230,204,1),rgba(214,146,92,1));
        border-radius:10px;
        display:flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 2px 4px rgba(0, 0, 0, 0.06);
      }
      .bot_mid_con{
        width:224rpx;
        height:296rpx;
        display:flex;
        align-items: center;
        flex-direction: column;
        border-radius: 16rpx;
        background:#fff;
        .bot_mid_title{
          font-size: 30rpx;
          padding-top:46rpx;
          font-weight:700;
        }
        .bot_mid_img{
          width:125rpx;
          height:100rpx;
          img{
            width:100%;
            height:100%;
            display: block;
          }
        }
        .bot_mid_feature{
          font-size: 22rpx;
          color:#F60F51;
        }
      }
    }
  }
}
</style>
