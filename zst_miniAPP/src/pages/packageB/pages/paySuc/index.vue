<template>
    <div class="page">
      <div class="page_top">
            <div class="pa_top_le">
               <div class="pa_le_top">支付成功</div>
               <div class="pa_le_bot">支付日期:{{shopMes.consumeTime}}</div>
            </div>
            <div class="pa_top_ri" v-if="btnShow">
              <button class="share_de" open-type="share" :data-shareModel="shopMes">
                <i class="iconfont icon-fenxiang" style="margin-right:10rpx;"></i>
                <i style="overflow: hidden;">分享商家</i>
              </button>
            </div>
      </div>
      <div class="all_shop_detail">
          <div class="shop_Detail" @click="goShopDetail">
               <div class="shop_all_le">
                  <div class="shop_le">
                    <img :src="shopMes.storeLogo" alt="">
                  </div>
                  <div class="shop_ri">
                     <div class="shop_name">
                        {{shopMes.storeName}}
                     </div>
                     <div class="shop_address">
                        <i style="display: inline-block;margin-right:10rpx;" class="iconfont icon-dizhi"></i><span>{{shopMes.address}}</span>
                     </div>
                  </div>
               </div>
               <div class="shop_all_ri">
                  <i class="iconfont icon-iconfontjiantou5"></i>
               </div>
          </div>
          <!--<div class="score_inject">-->
            <!--<div class="score_le">-->
                <!--<span style="margin-right:20rpx;">商家评分</span>-->
                <!--<div class="star">-->
                   <!--<span v-for="(item,index) in stars" :key="item.id" @click="scoreIt(item.id)">-->
                     <!--<i class="iconfont icon-shoucang-tianchong" style="margin-right:6rpx;" :class="item.id <= starId?'yesColor':''"></i>-->
                   <!--</span>-->
                <!--</div>-->
            <!--</div>-->
            <!--<div class="score_ri" @click="go_score">-->
                <!--我要留言-->
            <!--</div>-->
          <!--</div>-->
      </div>

      <div class="order_detail">
          <div class="eve_title">
             订单详情
          </div>
          <div class="eve_eve">
            订单金额：{{shopMes.totalMoney}}元
          </div>
        <div class="eve_eve">
           不参与折扣金额：{{shopMes.nonPartakeMoney }}元
        </div>
        <div class="eve_eve">
           支付方式：微信
        </div>
        <div class="eve_eve">
           支付时间：{{shopMes.consumeTime}}
        </div>
        <div class="eve_eve">
           优惠方式：{{couponType}}
        </div>
         <div class="eve_eve">
            <div class="eve_le">优惠金额：{{shopMes.partakeMoney}}元</div>
            <div class="eve_ri">实际支付：{{shopMes.actualReceiveMoney}}元</div>
         </div>
      </div>

      <div class="total_detail">
         <div class="total_le" v-if="totalMoney">
           话呗余额：{{totalMoney}}
         </div>
          <div class="all_ri_de">
             <div class="total_mid">下载助商通每天领话呗</div>
             <div class="total_ri" @click="xiazai">立即下载</div>
          </div>
      </div>

      <div class="recruit_card" v-if="hasSvipcardActive ==1">
          <div class="rec_le">该商家正在进行招募卡主活动</div>
          <div class="rec_ri" @click="goStore"><span>招募卡主</span><i class="iconfont icon-arrfill_l"></i></div>
      </div>

      <div class="nearbyShop" v-if="dataArr.length != 0">
          <div class="near_title">附近的卡主商家</div>
         <div class="shop_bot" style="padding-bottom:80rpx;">
          <div class="eve_shop_inner">
            <div class="eve_con" :key="item.id" v-for="item in dataArr" @click="goShop(item)">
              <div class="eve_con_le">
                <img :src="item.storeLogo" alt="">
                <div class="isCarder_shop" v-if="item.hasCard ==1">
                  <img src="/static/img/shopRecom/cardShop.png" alt="">
                </div>
              </div>
              <div class="eve_con_ri">
                <div class="ev_shopName">
                  <span class="ev_name">{{item.storeName}}</span>
                  <span class="ev_add">{{item.distance}}km</span>
                </div>
                <div class="intro">
                  <div class="in_tit">{{item.dealCateMatchRow}}</div>
                  <div class="in_img" v-if="item.hasSvipcardActive == 1">
                    <img src="/static/img/shopRecom/comeCar.png" alt="">
                  </div>
                </div>

                <div class="int_cu" v-if="item.arr.length!=0">
                  <div class="cu_img">
                    <img src="/static/img/shopRecom/cu.png" alt="">
                  </div>
                  <div class="cu_con">
                    满{{item.arr[0].consumeMoney}}减{{item.arr[0].availableIntegral}}话呗
                  </div>
                </div>

                <div class="int_cu" v-if="item.newArr.length !=0">
                  <div class="cu_img">
                    <img src="/static/img/shopRecom/zhe.png" alt="">
                  </div>
                  <div class="cu_con">
                    话呗抵扣{{item.newArr[0].discountRate}}折活动
                  </div>
                </div>

                <div class="int_cu">
                  <div class="cu_img" style="width:90rpx;height:26rpx;">
                    <img src="/static/img/shopRecom/sha.png" alt="">
                  </div>
                  <div class="cu_con" style="font-size: 20rpx;">
                    立领卡主折扣{{item.shareCardDiscount}}折，折上折更优惠
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="bot_btn" @click="closePage">
          关闭
      </div>

      <div class="alert" v-if="showItem">
        <div class="alertContent">
          <div class="close">
            <img src="/static/img/close.png" alt="" @click="closeInner">
          </div>
          <div class="top_popup" v-if="showActive == 1">
            <div class="img_mes">
              <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/14/eba875fd89f211c42ca3422a6f28d7a7.png" alt="">
              <div class="btns">
                <div class="btnDIV" @click="closeInner"></div>
                <div class="btnDIV" @click="goStoreBargain"></div>
              </div>
            </div>
          </div>
          <div class="shareCardFlag box_padding" style="padding: 0 28rpx;" v-if="showCard == 1">
            <img src="../../static/img/paySuc.png" alt="" class="mg-auto" style="width: 298rpx;height: 183rpx;margin-bottom: 12rpx">
            <p class="font-weight fz-38 text-center">【送好友一张共享卡】</p>
            <p class="fz-30 text-center flex_box text-center align_center" style="margin-bottom: 28rpx;flex-wrap: wrap">好友消费立享<i class="fc-F7094D fz-38 font-weight">{{shareCardDiscount}}折</i>，你还能获得<i class="fc-F7094D fz-38 font-weight">{{commissionRate}}%</i>的佣金</p>
            <button class="btn_radius bg-FEB623 fc-ffffff fz-36"
                    style="display: block;width: 100%;margin-bottom: 12rpx"
                    open-type="share" :data-shareCard="shopMes">去分享</button>
            <p class="fz-30 text-center">关闭后可在<span class="fc-F7094D">卡主-收藏的卡</span>中查看</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import { getSignIn , getQuery , toDate} from '@/common/js/comm';
    import { mapMutations } from 'vuex'
    import floatTo from  '@/common/js/floatTo';
    import { NEWSHOPID }  from '@/store/mutation-types'
    import Tips from '@/common/js/tips'
    import round from '@/common/js/round'
    export default {
        name: "index",
        data(){
          return {
            shopMes:{},
            orderNum:'',
            imgs:[],
            btnShow:true,
            shareCardDiscount:'',
            totalMoney:'',
            commissionRate:'',
            couponType:'',
            shopStoreId:'',
            stars:[{id:1},{id:2},{id:3},{id:4},{id:5}],
            starId:0,
            shareCardId:'',
            dataArr:[],
            shopId:'',
            hasSvipcardActive:1,   //判断是否有活动
            showActive:'',
            copywritingTitle:'',
            price:'',
            currentPrice:'',
            cutDetail:'',
            mainImg:'',
            showCard:'',
            showItem:'',
          }
        },
        mounted(){
            var par = getQuery();
            this.orderNum = par.orderNum;
            this.shopStoreId = par.shopStoreId;
            this.shareCardId = par.shareCardId ?par.shareCardId:'';
            this.getOrderDetail();
        },
        methods:{
          ...mapMutations({
            newShopId:'NEWSHOPID'
          }),
          goopenTeam(par){
            console.log(par);
            wx.navigateTo({
              url:`/pages/packageC/pages/cutFree/main?bargainId=${par.id}&storeId=${par.storeIds}&fromPage=canJoin`
            })
          },
          go_score(){
            wx.navigateTo({
              url:'../../pages/scorePage/main'
            })
          },
          lookMore(){
            wx.navigateTo({
              url:'/pages/packageC/pages/index/main'
            })
          },
          goShop(par){
            if(this.$store.state.token){
              wx.navigateTo({
                url:`../../pages/shopRecDet/main?shopStoreId=${par.id}&distance=${par.distance}`
              })
            }else{
              this.goLogin();
            }
          },
          goStoreBargain(){
            if(this.$store.state.token){
              wx.navigateTo({
                url:`/pages/packageA/pages/currentStoreAct/main?scene=${this.shopStoreId}`
              })
            }else{
              this.goLogin();
            }
          },
          getOrderDetail(){
            var _data = {
              token:this.$store.state.token ? this.$store.state.token : '',
              orderNum:this.orderNum ? this.orderNum : '',
              shopStoreId:this.shopStoreId ? this.shopStoreId : '',
              shareCardId:this.shareCardId ? this.shareCardId : '',
              longitude:this.$store.state.lng ?this.$store.state.lng:'' ,
              latitude:this.$store.state.lat?this.$store.state.lat:'',
            }
            var _this = this;
            getSignIn(_data).then(sec=>{
              _this.$http.getOrderOrder(_data,sec).then(res=>{
                res.data.consumeTime = toDate(res.data.consumeTime *1000);
                _this.imgs = res.data.storeImgs.split(',');
                _this.dataList = res.biSvipcardShare;
                _this.activeType = res.data.activeType;
                _this.shopId = res.data.shopId;
                _this.hasSvipcardActive = res.hasSvipcardActive;
                _this.showActive = res.bargainCount ? 1 : 0;
                _this.newShopId(res.data.shopId);
                // 0 无活动 1积分 2卡券  3svip卡消费 4 （优惠券+共享卡）、5（话呗+优惠券）
                if(_this.activeType ==0){
                  _this.couponType = '无活动';
                }else if(_this.activeType==1){
                  _this.couponType = '商家话呗活动';
                }else if(_this.activeType==2){
                  _this.couponType = '优惠券活动';
                }else if(_this.activeType==3){
                  _this.couponType = '卡主折扣';
                }else if(_this.activeType==4){
                  _this.couponType = '共享卡+优惠券双重优惠';
                }else if(_this.activeType==5){
                  _this.couponType = '商家活动+优惠券双重优惠';
                }else if(_this.activeType==6){
                  _this.couponType = '联盟打折卡';
                }else if(_this.activeType==7){
                  _this.couponType = '联盟打折卡+优惠券双重优惠';
                }
                if( _this.dataList.shareCardDiscount){
                  _this.btnShow = true;
                  if(_this.showActive ==1) {
                    _this.showCard = 0;
                    _this.showItem =1;
                  }else if(_this.showActive===0){
                    _this.showCard = 1;
                    _this.showItem =1;
                  }
                  _this.shareCardDiscount = floatTo.multiply(res.biSvipcardShare.shareCardDiscount ,10);
                  _this.commissionRate = floatTo.multiply(res.biSvipcardShare.commissionRate,100);
                }else{
                  _this.btnShow = false;
                  _this.showCard = 0;
                }
                _this.totalMoney = res.totalmoney;
                for(let i=0;i<res.lstSvipActiveStores.length;i++){
                  if(res.lstSvipActiveStores[i].discountInfo) {
                    res.lstSvipActiveStores[i].discountRate = res.data[i].discountInfo.discountRate;
                  }
                  if(res.lstSvipActiveStores[i].fullReduceInfo) {
                    res.lstSvipActiveStores[i].consumeMoney = res.lstSvipActiveStores[i].fullReduceInfo.consumeMoney;
                    res.lstSvipActiveStores[i].availableIntegral = res.lstSvipActiveStores[i].fullReduceInfo.availableIntegral;
                  }else{
                    res.lstSvipActiveStores[i].consumeMoney = '';
                  }
                  if( res.lstSvipActiveStores[i].shareCardDiscount) {
                    res.lstSvipActiveStores[i].shareCardDiscount = floatTo.multiply(res.lstSvipActiveStores[i].shareCardDiscount, 10);
                  }
                  if(JSON.stringify(res.lstSvipActiveStores[i].shareCard) =='{}'){
                    res.lstSvipActiveStores[i].hasCard  = 0;
                  }else{
                    res.lstSvipActiveStores[i].hasCard = 1;
                  }
                  var arr=[];var barr=[];
                  var newArr = res.lstSvipActiveStores[i].lstIntegralactive;
                  for(let k=0;k<newArr.length;k++){
                    //满减
                    if(newArr[k].discountType==2 && newArr[k].isDefault ==1){
                      arr.push(newArr[k]);
                    }else if(newArr[k].discountType==1 && newArr[k].isDefault ==1){
                      barr.push(newArr[k]);
                    }
                  }
                  res.lstSvipActiveStores[i].arr = arr;
                  res.lstSvipActiveStores[i].newArr = barr;
                }
                _this.dataArr = _this.lstSvipActiveStores;

                _this.dataArr = res.lstSvipActiveStores;
                _this.shopMes = res.data;
              })
            })
          },
          goStore(){
            var _this = this;
            if(this.$store.state.token){
              wx.navigateTo({
                url:`../../pages/shopRecDet/main?shopStoreId=${_this.shopStoreId}&distance=${0}&shopId=${_this.shopId}`
              })
            }else{
              _this.goLogin();
            }
          },
          scoreIt(par){
            this.starId = par;
          },
          closePage(){
            /*wx.switchTab({
              url:'../../../../pages/index/main'
            })*/
            wx.navigateBack({delta:1})
          },
          xiazai(){
            wx.navigateTo({
              url:'/pages/packageD/pages/downApp/main'
            })
            // wx.showModal({
            //   title: '提示',
            //   content: '具体详情，请下载助商通APP，每天领花呗，优惠乐不停',
            //   confirmColor:'#F60F51',
            //   success(res) {
            //     if (res.confirm) {
            //       console.log('用户点击确定')
            //     } else if (res.cancel) {
            //       console.log('用户点击取消')
            //     }
            //   }
            // })
          },
          closeInner(){
            this.showItem = 0;
            this.showCard = '';
            this.showActive = '';
          },
          goLogin(){
            const url = `../../../../pages/loginpage/main?orderNum=${this.orderNum}&shopStoreId=${this.shopStoreId}&shareCardId=${this.shareCardId}`;
            wx.navigateTo({url})
          },
          goShopDetail(){
            var _this = this;
            if(_this.$store.state.token){
              wx.navigateTo({
                url:`../../pages/shopRecDet/main?distance=0&shopStoreId=${_this.shopMes.shopStoreId}&shareid=${_this.shopMes.id}`
              })
            }else{
              _this.goLogin();
            }
          }
        },
        onShareAppMessage(res){
        var _this = this;
        let cuTitle,cuPath,cuImageUrl;
        if (res.from === 'button') {
          // 来自页面内转发按钮
          let sharemodel = res.target.dataset.sharemodel;
          let shareCard =  res.target.dataset.sharecard;
          if(sharemodel){
            cuTitle = `【${_this.shopMes.storeName}】使用共享会员卡付款，最低享受${_this.shareCardDiscount}折优惠`;
            cuPath  = `pages/packageB/pages/shopRecDet/main?distance=0&shopStoreId=${_this.shopMes.shopStoreId}&shopId=${_this.shopMes.shopId}&inviterId=${_this.$store.state.userLiId}`;
            cuImageUrl = `${this.imgs[0]}`;
          }
          if(shareCard){
            cuTitle = `【${_this.shopMes.storeName}】使用共享会员卡付款，最低享受${_this.shareCardDiscount}折优惠`;
            cuPath  = `pages/packageB/pages/shareCardDetail/main?distance=0&shopStoreId=${_this.shopMes.shopStoreId}&shareid=${_this.dataList.id}&inviterId=${_this.$store.state.userLiId}`;
            cuImageUrl = `${this.imgs[0]}`;
          }
          // if(cutDetail){
          //   cuTitle = `${round.retRound()}`;
          //   cuPath = `pages/packageC/pages/cutFree/main?status=4&bargainId=${this.bargainId}&bargainTasksId=${this.bargainTasksId}&storeId=${this.storeId}`;
          // }
        }
        return {
          title:cuTitle,
          path:cuPath,
          imageUrl:cuImageUrl,
          success:function(res){
            console.log('成功转发的消息',res)
          },
          fail:function(res){
            console.log('失败转发的消息',res)
          }
        }
      },
    }
</script>

<style lang="scss" scoped>
.page{
  width:100%;
  position: absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  background:rgba(242,242,242,1);
  .page_top{
    width:674rpx;
    height:168rpx;
    background:#fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:0 38rpx;
    margin-bottom:18rpx;
    .pa_top_le{
      .pa_le_top{
        font-size: 42rpx;
        font-weight: bold;
      }
      .pa_le_bot{
        font-size: 28rpx;
        color:rgba(135,135,135,1);
      }
    }
    .pa_top_ri{
      .share_de{
        height:48rpx;
        background:rgba(255,180,21,1);
        box-shadow:0px 1px 3px 0px rgba(206,11,47,0.43);
        border-radius:10rpx;
        float: right;
        line-height: 48rpx;
        margin:16rpx 0;
        display:flex;
        justify-content: space-around;
        align-items: center;
        color:#fff;
        font-size: 28rpx;
      }
    }
  }
  .all_shop_detail{
    border-bottom:2rpx solid rgba(229,229,229,1);
    padding-bottom:20rpx;
    background:#fff;
  }
  .shop_Detail{
    width:702rpx;
    padding:20rpx 24rpx;
    background:#fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .shop_all_le{
      display: flex;
      align-items: center;
      .shop_le{
        width:80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 16rpx;
        img{
          width:100%;
          height:100%;
          display: block;
          border-radius: 50%;
        }
      }
      .shop_ri{
         .shop_name{
           font-size: 36rpx;
           font-weight: bold;
         }
          .shop_address{
            font-size: 28rpx;
            color:rgba(135,135,135,1);
            width:540rpx;
            @include ovh;
          }
      }
    }
    .shop_all_ri{

    }
  }
  .score_inject{
    display: flex;
    justify-content: space-between;
    width: 710rpx;
    padding: 0 20rpx;
    .score_le {
      height: 46rpx;
      display: flex;
      align-items: center;
      font-size: 30rpx;

      .star {
        display: flex;

        span {
          color: #D1D1D1;
        }
      }

      .yesColor {
        color: #FEB623;
      }
    }
    .score_ri{
      height:46rpx;
      padding:0 20rpx;
      background:#F60F51;
      font-size: 28rpx;
      border-radius: 10rpx;
      color:#fff;
    }
  }
  .order_detail{
    width:710rpx;
    padding:20rpx;
    overflow: hidden;
    background:#fff;
    border-bottom:2rpx solid rgba(229,229,229,1);
    .eve_title{
      font-size: 30rpx;
      margin-bottom:30rpx;
    }
    .eve_eve{
      font-size: 28rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .eve_le{
        font-size:28rpx;
        color:#F60F51;
      }
      .eve_ri{
        font-size: 36rpx;
        font-weight: bold;
      }
    }
  }
  .total_detail{
    width:96%;
    background:#fff;
    padding:20rpx 2%;
    display: flex;
    justify-content: space-between;
    .total_le{
      font-size:30rpx;
    }
    .all_ri_de{
      display: flex;
      justify-content: space-around;
      .total_mid{
        font-size: 28rpx;
        color:#B2682D;
      }
      .total_ri{
        font-size: 28rpx;
        color:#fff;
        background:#F7094D;
        border-radius: 10rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        padding:0 20rpx;
        margin-left:10rpx;
      }
    }
  }
  .recruit_card{
    width:710rpx;
    padding:20rpx 20rpx;
    height:80rpx;
    display: flex;
    justify-content: space-between;
    background:#fff;
    .rec_le{
      width:528rpx;
      height:80rpx;
      background:linear-gradient(270deg,rgba(195,135,88,1),rgba(207,155,101,1),rgba(236,204,167,1));
      display: flex;
      align-items: center;
      padding-left:20rpx;
      font-size: 30rpx;
      color:#fff;
    }
    .rec_ri{
      width:182rpx;
      height:80rpx;
      background:#1B1818;
      color:#fff;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding:0 10rpx;
    }
  }
  .nearbyShop{
    padding:0 20rpx;
    width:710rpx;
    background:#fff;
    padding-top: 30rpx;
    .near_title{
      font-size: 36rpx;
      font-weight: bold;
    }
  }
  .shop_bot{
    width:100%;
    .shop_bot_title{
      font-size:36rpx;
      font-weight:bold;
      color:rgba(0,0,0,1);
      margin-bottom:36rpx;
    }
    .eve_shop_inner{
      width:100%;
      .eve_con{
        width:100%;
        height:190rpx;
        border-bottom:2rpx solid rgba(52,60,83,0.2);
        padding-bottom:56rpx;
        margin-top:30rpx;
        .eve_con_le{
          width:250rpx;
          height:190rpx;
          background: #f2f2f2;
          border-radius: 10rpx;
          float: left;
          position: relative;
          img{
            width:100%;
            height:100%;
            display: block;
            border-radius: 10rpx;
          }
          .isCarder_shop{
            position: absolute;
            left:-10rpx;
            top:-10rpx;
            width:90rpx;
            height:88rpx;
            display: block;
            img{
              width:100%;
              height:100%;
              display: block;
            }
          }
        }
        .eve_con_ri{
          float: left;
          width:434rpx;
          margin-left:16rpx;
          .ev_shopName{
            font-size: 32rpx;
            font-weight:400;
            @include jcsb;
            align-items: center;
            .ev_name{
              width:324rpx;
              @include ovh;
            }
            .ev_add{
              font-size:24rpx;
              color:rgba(52,60,83,0.6);
            }
          }
          .intro{
            height:30rpx;
            display: flex;
            align-items: center;
            margin-top:10rpx;
            .in_tit{
              font-size: 24rpx;
              line-height:30rpx;
              float: left;
              margin-right:14rpx;
            }
            .in_img{
              float: left;
              width:110rpx;
              height:30rpx;
              img{
                width:100%;
                height:100%;
                display: block;
              }
            }
          }
        }
      }
    }
    .int_cu{
      width:100%;
      height:30rpx;
      display: flex;
      align-items: center;
      margin:10rpx 0;
      .cu_img{
        width:24rpx;
        height:24rpx;
        float: left;
        margin-right:10rpx;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
      .cu_con{
        float: left;
        font-size: 24rpx;
      }
    }
    .int_bot_bot{

    }
  }
  .bot_btn{
    width:100%;
    height:100rpx;
    background:#F7094D;
    position: fixed;
    left:0;
    bottom: 0;
    right:0;
    line-height: 100rpx;
    text-align: center;
    color:#fff;
    font-size: 36rpx;
  }
  .pop_up{
    position: fixed;
    left:0;
    top:0;
    right:0;
    bottom:0;
    background:rgba(0,0,0,0.5);
    width:100vw;
    height:100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .all_con{
      position: absolute;
      top: 400rpx;
      .close_inner{
        position: absolute;
        right:-40rpx;
        top:-80rpx;
        width:54rpx;
        height:54rpx;
        z-index: 999;
        img{
          width:54rpx;
          height:54rpx;
          display: block;
        }
      }
    }
    .top_popup{
      width:560rpx;
      border-radius: 20rpx;
      padding:0 20rpx;
      /*position: relative;*/
      /*padding-bottom:20rpx;*/
      .img_mes{
        width:750rpx;
        height:782rpx;
        .text{
          position: absolute;
          width:100%;
          text-align: center;
          bottom:0rpx;
          font-size: 30rpx;
          color:#0A3277;
          font-weight: bold;
        }
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }

      .pop_con{
        width:100%;
        height:150rpx;
        display: flex;
        padding-top:136rpx;
        justify-content: space-between;
        .pop_con_le{
          width:150rpx;
          height:150rpx;
          background:purple;
          border-radius: 10rpx;
          img{
            width:100%;
            height:100%;
            display: block;
            border-radius: 10rpx;
          }
        }
        .pop_con_ri{
          width:400rpx;
          .ri_top_con{
            font-size: 26rpx;
          }
        }
      }
      .btn{
        width:100%;
        height:80rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin:20rpx 0;
        .btn_center{
           width:500rpx;
           height:80rpx;
           background:#F7094D;
           color:#fff;
           text-align: center;
           line-height: 80rpx;
           border-radius: 10rpx;
        }
      }
      .look_more{
        width:100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .pop_up_inner{
      width:600rpx;
      height:514rpx;
      background:#fff;
      border-radius: 20rpx;
      position: relative;
      .pop_up_top{
        width:100%;
        height:182rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom:20rpx;
        img{
          width:298rpx;
          height:182rpx;
        }
      }
      .pop_up_mid{
        .mid_top{
          width:100%;
          text-align: center;
          font-weight: bold;
          font-size: 38rpx;
        }
        .mid_bot{
          padding:0 60rpx;
          width:480rpx;
          font-size: 30rpx;

        }
      }
      .pop_up_bot{
        width:544rpx;
        padding:0 28rpx;
        height:80rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top:20rpx;
        .btn_le{
          width:250rpx;
          height:80rpx;
          background:#FEB623;
          border-radius: 10rpx;
          color:#fff;
          font-size: 36rpx;
          text-align: center;
          line-height: 80rpx;
        }
        .btn_ri{
          width:250rpx;
          height:80rpx;
          background:#F7094D;
          border-radius: 10rpx;
          color:#fff;
          font-size: 30rpx;
          text-align: center;
          line-height: 80rpx;
        }
      }
    }

  }
  .alert{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(12,12,12,.5);
    .alertContent{
      position: absolute;
      top: 100rpx;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 600rpx;
      .top_popup{
        .img_mes{
          display: block;
          width: 600rpx;
          height: 800rpx;
          position: relative;
          img{
            display: block;
            width: 600rpx;
            height: 800rpx;
          }
          .btns{
            position: absolute;
            width: 100%;
            height: 100rpx;
            left: 0;
            bottom: 50rpx;
            display: flex;
            .btnDIV{
              width: 50%;
              height: 100rpx;
            }
          }
        }
      }
      .close{
        width: 55rpx;
        height: 55rpx;
        position: absolute;
        top: -80rpx;
        right: -28rpx;
        z-index: 2;
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .shareCardFlag{
        background: #FFFFFF;
        border-radius: 20rpx;
        button{
          width: 250rpx;
          height: 80rpx;
        }
        .thumb{
          display: block;
          width: 150rpx;
          height: 150rpx;
          border-radius: 20rpx;
          background: #0d0d0f;
        }
      }
    }
  }
}
</style>
