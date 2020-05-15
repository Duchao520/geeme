<template>
    <div class="page">
        <div class="top_bac">
        </div>
        <div class="page_top">
          <div class="eve_vipcard">

            <div class="card_img">
              <img src="../../static/img/mySvipCard.png" alt="">
            </div>
            <div class="eve_le">
              <div class="eve_img">
                <img :src="shop.supplierLogo" alt="">
              </div>
            </div>
            <div class="eve_ri">
              <div class="ri_top_con">
                <div class="eve_ri_top">
                  {{shop.shopName}}
                </div>
                <div class="eve_mid_top">
                  {{shop.unitAddress}}
                </div>
              </div>
              <div class="eve_bot_top">
                <div class="vip_discount">
                  <div style="display: flex;">
                    <div style="margin-right:10rpx;font-size: 60rpx;background:linear-gradient(0deg,rgba(254,237,186,1) 0%, rgba(255,249,247,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;padding:2rpx 6rpx;line-height: 42rpx;">{{ card.discountRate * 1000/100}}</div>
                    <div style="font-size: 24rpx;"><span>折</span> <span style="font-size: 20rpx;border:2rpx solid #FFF;background:linear-gradient(0deg,rgba(254,237,186,1) 0%, rgba(255,249,247,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;padding:2rpx 6rpx;">会员折扣</span></div>
                  </div>
                </div>
                <span>余额：{{card.money}}元 </span>
              </div>
            </div>
          </div>

          <div class="creat_title"   v-if="activeType==2">
             创建共享卡
          </div>
          <div class="creat_title"   v-if="activeType==3">
             创建分享卡
          </div>

          <div class="set_card">
             <div class="set_card_le">
                <span style="float: left;" v-if="activeType==2">设置共享卡折扣</span>
                <span style="float: left;" v-if="activeType==3">设置分享卡折扣</span>
                <input type="text" v-model="discountData" @blur.prevent="disCount()">
                <span style="float: left;line-height: 52rpx;margin-right:10rpx;">折</span>
             </div>
             <div class="set_card_ri">
               （可设置范围{{minDis}} ~ {{maxDis}}）
             </div>
          </div>

          <div class="creat_mes">
            商家提供第三方折扣价为{{referenceRate}}折，建议设置<span style="color:#F7094D;">不低于</span>商家折扣
          </div>

          <div class="set_card">
            <div class="set_card_le">
              <span style="float: left;" v-if="activeType==2">设置共享卡佣金比例</span>
              <span style="float: left;" v-if="activeType==3">设置分享卡佣金比例</span>
              <input type="text" v-model="chagrData" @blur.prevent="chagrDa()">
              <span style="float: left;">%</span>
            </div>
            <div class="set_card_ri">
              （可设置范围10~99%）
            </div>
          </div>

          <div class="what_mon" @click="goShare">
             什么是共享卡佣金？
          </div>

          <div class="creat_btn" v-if="activeType==2" @click="sharebtn(0)">
            创建共享卡
          </div>
          <div class="creat_btn" v-if="activeType==3" @click="sharebtn(0)">
            创建分享卡
          </div>
        </div>
    </div>
</template>

<script>
    import { getSignIn , getQuery , toDate} from '@/common/js/comm';
    import floatTo from '@/common/js/floatTo'
    import Tips from '@/common/js/tips'

    export default {
        name: "index",
        data(){
          return {
            id:'',
            card:'',
            shop:'',

            majorData:'',
            // 折扣范围
            minDis:'',
            maxDis:'',
            nomajorData:'',
            discountData:'',
            chagrData:'',
            state:'',
            referenceRate:'',
            discountOffset:'',
            mainCardDiscountOfStatProfit:'',
            shareCardDiscountRateLimit: '',
            activeType:''
          }
        },
        mounted(){
          var par = getQuery();
          this.id = par.id;
          this.majorCard();
        },
        methods:{
          goShare(){
            wx.navigateTo({
              url:'/pages/packageA/pages/howCreat/main'
            })
          },
          majorCard(){
            var _this = this;
            var _data = {
              token:_this.$store.state.token,
              maincardId:_this.id,
            }
            getSignIn(_data).then(sec=>{
              _this.$http.getMajorCard(_data,sec).then(res=>{
                _this.majorData = res.data;
                _this.card = res.data.card;
                _this.card.money = ((res.data.card.money*100/10000).toFixed(2));
                _this.activeType = res.data.card.activeType;
                console.log(  _this.activeType);
                _this.shop = res.data.shop;
                _this.discountOffset = res.data.discountOffset;
                _this.shareCardDiscountRateLimit = res.data.shareCardDiscountRateLimit;
                _this.mainCardDiscountOfStatProfit = res.data.card.mainCardDiscountOfStatProfit;
                _this.minDis = floatTo.add((res.data.card.mainCardDiscountOfStatProfit) *1000/100,res.data.discountOffset);
                _this.maxDis = floatTo.multiply(res.data.shareCardDiscountRateLimit,10);
                _this.referenceRate = res.data.active.referenceRate *1000/100;
              })
            })

          },
          sharebtn(par){
            var _this = this;
            this._this = par;
            if(_this.discountData ===''){
              Tips.toast('请输入折扣价','none');
              return false;
            }
            if(_this.chagrData === ''){
              Tips.toast('请输入佣金比率','none');
              return false;
            }
            var _data = {
              token:_this.$store.state.token,
              maincardId:_this.id,
              shareCardDiscount: _this.discountData*100/1000,
              commissionRate:_this.chagrData*100/10000,
              state:String(_this.state),
              activeType:_this.activeType
            }
            getSignIn(_data).then(sec=>{
              _this.$http.postDisCount(_data,sec).then(res=>{
                if(res.state === 1){
                  wx.redirectTo({
                        url:`/pages/packageD/pages/myShareCard/main?id=${this.id}&mainCardNO=${res.data.mainCardNO}
                        &supplierLogo=${_this.shop.supplierLogo}
                        &shopName=${_this.shop.shopName}
                        &unitAddress=${_this.shop.unitAddress}
                        &cardDiscount=${res.data.mainCardDiscount}
                        &discountOffset=${_this.discountOffset}
                        &mainCardDiscountOfStatProfit=${_this.mainCardDiscountOfStatProfit}
                        &shareCardDiscountRateLimit=${_this.shareCardDiscountRateLimit}`
                  })
                }else{
                  Tips.toast(`${decodeURIComponent(res.msg)}`,'none')
                }
              })

            })
          },
          noMajorCardDetail(){
            var _this = this;
            var _data = {
              token:this.$store.state.token,
              sharecardId:this.id,
            };
            getSignIn(_data).then(sec=>{
              _this.$http.getnoCard(_data,sec).then(res=>{
                console.log('副卡返回的数据',res);
              })
            })
          },
          disCount(){
            var _self=this;
            var reg =/^[0-9]+([.]{1}[0-9]{1,2})?$/;
            if(!reg.test(this.discountData)){
              Tips.toast('请输入整数或则俩位小数','none');
              _self.discountData ='';
              return false;
            }
            // 主卡的折扣  9.8
            if(!(_self.minDis <= this.discountData && this.discountData <=_self.maxDis)){
              if(_self.minDis > this.discountData){
                Tips.toast(`请设置数值大于等于${_self.minDis}`,'none');
                _self.discountData ='';
                return false;
              }
              if(this.discountData > _self.maxDis){
                Tips.toast(`请设置数值小于等于${_self.maxDis}`,'none');
                _self.discountData ='';
                return false;
              }

            }
          },
          chagrDa(){
            var _self=this;
            var reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
            if(!reg.test(this.chagrData)){
              Tips.toast('请输入整数或则俩位小数','none');
              _self.chagrData ='';
              return false;
            }
            if(!(this.chagrData >= 10 &&this.chagrData <100)){
              if(!(this.chagrData > 10)){
                Tips.toast('佣金比例不能小于10','none');
                _self.chagrData ='';
                return false;
              }else if(!(this.chagrData <100)){
                Tips.toast('佣金比例需要小于100','none');
                _self.chagrData ='';
                return false;
              }
            }
          }
        }
    }
</script>

<style lang="scss" scoped>
.page{
  width:100%;
  position: relative;
  .top_bac{
    position: absolute;
    top:0;right:0;
    left:0;
    width:100%;
    height:256rpx;
    background:#1C2D4A;
  }
  .page_top{
    width:710rpx;
    padding:0 20rpx;
    padding-top:36rpx;
    .eve_vipcard{
      width:708rpx;
      height:198rpx;
      background:linear-gradient(270deg,rgba(221,64,81,1),rgba(221,64,81,1),rgba(220,61,78,1));
      border-radius:20rpx 20rpx 0 0;
      margin:22rpx 0;
      position: relative;
      box-shadow: 0 0 20px 4px rgba(224, 168, 122, 0.2);
      .card_img{
        position: absolute;
        top:0;
        right:34rpx;
        width:59rpx;
        height:58rpx;
        img{
          display: block;
          width:100%;
          height:100%;
        }
      }
      .card_Type{
        position: absolute;
        width:140rpx;
        height:34rpx;
        background:#556EEB;
        border-radius:18rpx;
        right:-12rpx;
        bottom:27rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20rpx;
        color:#fff;
      }
      .eve_le{
        padding:24rpx 26rpx 0 28rpx;
        float: left;
        .eve_img{
          width:100rpx;
          height:100rpx;
          background:#fff;
          border-radius: 50%;
          img{
            width:100%;
            height:100%;
            display: block;
            border-radius: 50%;
          }
        }
      }
      .eve_ri{
        padding-top:24rpx;
        float: left;
        width:554rpx;
        .ri_top_con{
          display: flex;
          justify-content: center;
          flex-direction: column;
          height:100rpx;
          margin-bottom:20rpx;
          .eve_ri_top{
            color:#ffffff;
            font-size: 36rpx;
          }
          .eve_mid_top{
            width:530rpx;
            padding-right:24rpx;
            @include ovh();
            color:#ffffff;
            font-size: 24rpx;
          }
        }
        .eve_bot_top{
          display: flex;
          justify-content: space-between;
          padding-right:24rpx;
          span{
            font-size: 28rpx;
            color:#fff;
          }
          .eve_btn{
            font-size: 20rpx;
            padding:6rpx 40rpx;
            background:#DD0F3A;
            border-radius: 20rpx;
          }
        }
      }
    }
    .creat_title{
      width:100%;
      font-weight:bold;
      color:rgba(0,0,0,1);
      font-size:36rpx;
      margin-top:60rpx;
    }
    .set_card{
      width:100%;
      display:flex;
      justify-content: space-between;
      align-items: center;
      margin-top:58rpx;
      .set_card_le{
        font-size: 30rpx;
        font-weight:400;
        input{
          width:106rpx;
          height:30rpx;
          /*background:#ff6700;*/
          border-bottom:2rpx solid rgba(154,157,165,1);
          float: left;
          margin:0 10rpx;
          text-align: center;
        }
      }
      .set_card_ri{
        font-size: 24rpx;
        color:rgba(154,157,165,1);

      }
    }
    .creat_mes{
      width:100%;
      height:38rpx;
      font-size: 24rpx;
      color:rgba(154,157,165,1);
      text-align: center;
      line-height: 38rpx;
      background:rgba(255,247,233,1);
      padding:4rpx 0;
      border-radius: 20rpx;
      margin-top:20rpx;
      margin-bottom:64rpx;
    }
    .what_mon{
      width:100%;
      margin-top:34rpx;
      text-decoration:underline;
      color:rgba(254,20,87,1);
      font-size: 24rpx;
      margin-bottom:140rpx;
    }
    .creat_btn{
      width:100%;
      height:80rpx;
      background:rgba(246,15,81,1);
      box-shadow:0 1px 3px 0 rgba(206,11,47,0.43);
      border-radius:20rpx;
      text-align: center;
      line-height:80rpx;
      font-size:36rpx;
      font-weight:400;
      color:rgba(255,255,255,1);
    }

  }
}
</style>
