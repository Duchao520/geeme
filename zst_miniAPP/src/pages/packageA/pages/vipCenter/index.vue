<template>
  <div class="page">
     <div class="page_top">
          <div class="vip_top">
            <img class="vip_top_img" src="../../static/img/vip.png" alt="">
            <div class="all_con">
                <div class="vip_bian">
                    <div class="qr_img" @click="pouUpNews">
                      <img src="../../static/img/erweima.png" alt="">
                    </div>
                    <div class="vip_title">
                       <div class="vip_head">
                         <img :src="imgUrl" alt="">
                       </div>
                       <div class="vip_time" v-if="userRo == 1">
                         <div class="vip_top_time"><span class="vip_name">{{nickName}}</span><span class="vip_no">vip会员</span></div>
                         <div class="vip_bot_time">助商通VIP2{{yes}}年{{mon}}月{{min}}日到期</div>
                       </div>
                      <div class="vip_time" v-if="userRo != 1">
                        <div class="vip_top_time"><span class="vip_name">{{nickName}}</span><span class="vip_no" style="background:linear-gradient(0deg,rgba(179,166,169,1),rgba(204,203,194,1));">普通会员</span></div>
                        <div class="vip_bot_time">开通VIP会员，自用省钱 分享赚钱</div>
                      </div>
                       <div class="vip_money" v-if="userRo==1" @click="goUpradeVip">续费</div>
                       <div class="vip_money" v-if="userRo!=1" @click="goUpradeVip">立即开通</div>
                    </div>
                    <div class="vip_bot">
                      <div class="vip_inner">
                      <div class="eve_in">
                        <div class="eve_top">累积推广</div>
                        <div class="eve_mid" v-if="userRo !=1">--</div>
                        <div class="eve_mid" v-if="userRo ==1">{{dataMes.members}}个</div>
                        <div class="eve_bot">会员</div>
                      </div>

                      <div class="eve_in">
                        <div class="eve_top">累计邀请</div>
                        <div class="eve_mid" v-if="userRo !=1">--</div>
                        <div class="eve_mid" v-if="userRo==1">{{dataMes.shops}}个</div>
                        <div class="eve_bot">商家</div>
                      </div>

                      <div class="eve_in">
                        <div class="eve_top">累计预约</div>
                        <div class="eve_mid" v-if="userRo==1">{{dataMes.reserves}}次</div>
                        <div class="eve_mid" v-if="userRo !=1">--</div>
                        <div class="eve_bot">旅游</div>
                      </div>

                      <div class="eve_in">
                        <div class="eve_top">累计收益</div>
                        <div class="eve_mid" v-if="userRo == 1">{{dataMes.totalMoney}}元</div>
                        <div class="eve_mid" v-if="userRo != 1">--</div>
                        <div class="eve_bot">奖金</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mar_que">
                  <!-- 跑马灯效果  -->
                  <div class="example">
                    <div class="marquee_box">
                      <div class="marquee_text" :style="{left:marqueeDistance +'px',fontSize:size+'rpx'}">
                         <div style="display: flex;align-items: center;margin-right:40rpx;" :key="index" v-for="(item,index) in text"><img  style="border-radius: 50%" :src="item.ico" class='ad-image' alt="">{{item.remark}} 获得{{item.transMoney}}元奖励</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="vip_pri">
                   <div class="pri-title">
                      VIP特权
                   </div>
                </div>

              <div class="shop_img_type">
                <div class="eve_shop_img" :key="item.pid" v-for="item in imgList" @click="gotypePage(item)">
                  <div class="eve_top">
                    <img :src="item.imgUrl" alt="">
                  </div>
                  <div class="eve_bot">
                    {{item.text}}
                  </div>
                </div>
              </div>
            </div>
          </div>
     </div>
    <div class="pouUp" v-if="showPop">
       <div class="pop_img">
         <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/5/08eba20d637730776e0338b3568ecbb5.png" alt="">
         <div class="er_img">
           <img :src="mineInviteQrUrl" alt="">
         </div>
         <div class="er_name">
            {{niceName}}
         </div>
         <div class="er_id">
            ID：{{erid}}
         </div>
         <div class="close_inner" @click="closeInner">
           <img src="/static/img/close.png" alt="">
         </div>
       </div>
    </div>
  </div>
</template>

<script>
  import { getSignIn , confirm } from '@/common/js/comm'
  export default {
    name: "index",
    data(){
      return {
         imgList:[
           {imgUrl:'../../static/img/laba.png',text:'推广会员'},
           {imgUrl:'../../static/img/ruzhu.png',text:'入驻商家'},
           {imgUrl:'../../static/img/lvyou.png',text:'免费旅游'},
           {imgUrl:'../../static/img/produce.png',text:'产品秀'},

         ],
        text: [],
        marqueePace: 1,//滚动速度
        marqueeDistance: 0,//初始滚动距离
        size: 24,
        orientation: 'left',//滚动方向
        interval: 20, // 时间间隔
        windowWidth:'',
        length:'',

        userRo:'',
        imgUrl:'',
        nickName:'',
        yes:'',
        mon:'',
        min:'',
        dataMes:'',
        mineInviteQrUrl:'',
        niceName:'',
        username:'',
        erid:'',

        showPop:false,

      }
    },
    mounted(){
      var that = this;
      // var length = that.text.length * that.size;//文字长度
      that.windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
      that.getMesss();
      that.getTip();
    },
    methods:{
      runMarquee () {
        var that = this;

        var query = wx.createSelectorQuery();
        query.select('.marquee_text').boundingClientRect(function (rect) {
          that.length = rect.width;
        }).exec();

        var interval = setInterval(function () {
          //文字一直移动到末端
          if ( -that.marqueeDistance < that.length) {
            that.marqueeDistance = that.marqueeDistance - that.marqueePace;
          } else {
            clearInterval(interval);
            that.marqueeDistance = that.windowWidth;
            that.runMarquee();
          }
        }, that.interval);
      },
      getMesss(){
        var _this = this;
        var _data = {
          token:_this.$store.state.token,
        }
        getSignIn(_data).then(sec=>{
          _this.$http.getVipUser(_data,sec).then(res=>{
            _this.dataMes = res.data;
            _this.userRo = res.data.user.userRole;
            _this.imgUrl = res.data.user.ico == '' ? _this.$store.state.iconImg : res.data.user.ico;
            _this.nickName = res.data.user.nick;
            _this.mineInviteQrUrl = res.data.user.mineInviteQrUrl;
            _this.niceName = res.data.user.nick;
            _this.erid = res.data.user.username;

            var yeaa = String(res.data.user.memberExpiryDate);
            _this.yes = yeaa.substring(0,4);
            _this.mon = yeaa.substring(4,6);
            _this.min = yeaa.substring(6,8);

          })
        })
      },
      getTip(){
        var _this = this;
        var _data = {
          token:_this.$store.state.token,
        }
        getSignIn(_data).then(sec=>{
        _this.$http.getMar(_data,sec).then(res=>{
            _this.text =res.data;
            console.log('这里应该是因为没有值',res);
            if(_this.text.length!=0) {
              _this.runMarquee();// 水平一行字滚动完了再按照原来的方向滚动
            }
          })
        })
      },
      pouUpNews(){
        console.log(11111);
        this.showPop = true;
      },
      closeInner(){
        this.showPop = false;
      },
      gotypePage(par){
        console.log(par);
        if(par.text == '推广会员'){
           wx.navigateTo({
             url:'../../pages/memPro/main'
           })
        }else if(par.text =='入驻商家'){
            wx.navigateTo({
              url:'../../pages/enterShop/main'
            })
        }else if(par.text = '免费旅游'){
           wx.navigateTo({
             url:'../../pages/freeTourism/main'
           })
        }else if(par.text = '产品秀'){
           wx.navigateTo({
             url:'../../pages/productShow/main'
           })
        }
      },
      goUpradeVip(){
        wx.navigateTo({
          url:'../../pages/upgradeVip/main'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.page{
  width: 100%;
  position: absolute;
  left:0;right:0;
  bottom:0;top:0;
  margin:0;
  background:#fff;
  .page_top{
    width:100%;
    height:240rpx;
    background:#FFB154;
    .vip_top{
      width:100%;
      height:70rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      .vip_top_img{
        width:100rpx;
        height:70rpx;
        display: block;
        margin-top:20rpx;
      }
      .all_con{
        position: absolute;
        left:20rpx;right: 20rpx;
        top:98rpx;width:710rpx;
        background: #fff;
        overflow: hidden;
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
        .vip_bian{
          border-radius: 20rpx;
          box-shadow:0rpx 0rpx 24rpx 0rpx rgba(29,9,30,0.28);
          position: relative;
          .qr_img{
            position: absolute;
            width:72rpx;
            height:72rpx;
            top:14rpx;
            left:14rpx;
            img{
              width:100%;
              height:100%;
              display: block;
            }
          }
        }
        .vip_title{
          width:94%;
          height:84rpx;
          padding:0 3%;
          padding-top:64rpx;
          .vip_head{
            width:84rpx;
            height:84rpx;
            background:#FFB154;
            float: left;
            margin-right:10rpx;
            border-radius: 50%;
            img{
              width:84rpx;
              height:84rpx;
              border-radius: 50%;
              display: block;
            }
          }
          .vip_time{
            float: left;
            height:58rpx;
            padding:10rpx;
            margin-bottom:60rpx;
            .vip_top_time{
              font-size: 34rpx;
              line-height: 34rpx;
              display: flex;
              align-items: center;
              margin-bottom:6rpx;
              .vip_name{
                max-width:298rpx;
                @include ovh;
              }
              .vip_no{
                padding:0rpx 10rpx;
                background:linear-gradient(0deg,rgba(247,9,77,1),rgba(255,85,93,1));
                font-size: 20rpx;
                color:#fff;
                border-radius: 6rpx;
                margin-left:10rpx;
              }
            }
            .vip_bot_time{
              font-size: 24rpx;
              color:#8A8A8A;
            }
          }
          .vip_money{
            float: right;
            width:150rpx;
            height:52rpx;
            margin:16rpx 0;
            background:linear-gradient(0deg,rgba(255,126,7,1),rgba(255,174,74,1));
            border-radius:24rpx;
            line-height: 52rpx;
            text-align: center;
            font-size: 24rpx;
            color: #fff;
          }
        }
        .mar_que{
          width:100%;
          height: 50rpx;
          background:#FF830E;
          margin-top:44rpx;
          border-radius: 8rpx;
          .example {
            display: block;
            width: 100%;
            height: 50rpx;
            line-height: 50rpx;
          }

          .marquee_box {
            width: 100%;
            position: relative;
            color:#fff;
          }

          .marquee_text {
            white-space: nowrap;
            position: absolute;
            top: 0;
            display: flex;
            flex-direction: row;
            align-items: center;
          }

          .ad-image {
            width: 30rpx;
            height: 30rpx;
            margin-right: 10rpx;
          }
        }
        .vip_pri{
           width:100%;
          .pri-title{
            line-height: 60rpx;
            margin:34rpx 0;
            font-size: 34rpx;
          }
        }
        .shop_img_type{
          width:710rpx;
          display: flex;
          justify-content: space-between;
          flex-direction: row;
          flex-wrap: wrap;
          .eve_shop_img{
            width:160rpx;
            display: flex;
            align-items: center;
            flex-direction: column;
            margin-bottom:20rpx;
            .eve_top{
              width:80rpx;
              height:80rpx;
              margin-bottom:20rpx;
              img{
                width:100%;
                height:100%;
                display: block;
              }
            }
            .eve_bot{
              font-size: 24rpx;
            }
          }
        }
      }
    }
    .vip_bot{
      width:100%;
      padding-bottom:20rpx;
      .vip_inner{
        width:94%;
        margin:0 3%;
        display: flex;
        justify-content: space-between;
        .eve_in{
          display: flex;
          align-items: center;
          flex-direction: column;
          .eve_top{
            font-size: 24rpx;
          }
          .eve_mid{
            font-size: 28rpx;
            margin-bottom:20rpx;
          }
          .eve_bot{
            font-size: 24rpx;
            color:#8A8A8A;
          }
        }
      }
    }
  }
  .pouUp{
    width:100vw;
    height:100vh;
    position: absolute;
    left:0;right:0;
    bottom:0;top:0;
    background:rgba(0,0,0,0.3);
    display:flex;
    justify-content: center;
    align-items: center;
    .pop_img{
      width:600rpx;
      height: 780rpx;
      position: relative;
      img{
        width:100%;
        height:100%;
        display: block;
      }
      .er_img{
        position: absolute;
        left:0;right:0;
        top:184rpx;
        margin:0 auto;
        width:310rpx;
        height: 310rpx;
        padding:6rpx;
        background:#fff;
      }
      .er_name{
        position: absolute;
        top:80rpx;
        color: #fff;
        text-align: center;
        width:100%;
      }
      .er_id{
        position: absolute;
        top:128rpx;
        text-align: center;
        width:100%;
        color: #fff;
      }
      .close_inner{
        position: absolute;
        right:-24rpx;
        top:-70rpx;
        width:54rpx;
        height:54rpx;
        img{
          width: 100%;
          height:100%;
          display: block;
        }
      }
    }
  }
}
</style>
