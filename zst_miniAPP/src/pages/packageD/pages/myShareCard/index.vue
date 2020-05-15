<template>
    <div class="page">
       <div class="my_sh_top">
         <div class="eve_vipcard">
           <div class="eve_le">
             <div class="eve_img">
               <img :src="supplierLogo" alt="">
             </div>
           </div>
           <div class="eve_ri">
             <div class="ri_top_con">
               <div class="eve_ri_top">
                  {{shopName}}
               </div>
               <div class="eve_mid_top">
                {{unitAddress}}
               </div>
             </div>
           </div>
         </div>
       </div>

      <div class="my_sh_bot">
          <div class="eve_sh"  v-for="(item,index) in mycreatData" :key="index"  @click="gotogShare(item)">
              <div class="eve_sh_top">
                  <div class="eve_sh_le">
                      创建时间：{{item.createTime}}
                  </div>
                  <div class="eve_sh_ri">
                    <div class="card_Type" style="width:160rpx;height:42rpx;">
                      <img style="width:100%;height:100%;display: block;" src="../../static/img/newSvipcard/share_card.png" alt="" v-if="item.activeType == 2">
                      <img style="width:100%;height:100%;display: block;" src="../../static/img/newSvipcard/card_logo.png" alt="" v-else-if="item.activeType == 3">
                    </div>
                  </div>
              </div>
              <div class="eve_sh_bot">
                  <div class="eve_sh_le">
                      <div style="color:#353535;">分享佣金：{{item.commissionRate}}% </div>
                      <div style="color:#353535;">累计使用：{{item.receiveCount}}次</div>
                  </div>
                  <div class="eve_sh_ri">
                    <span style="font-size: 60rpx;">{{item.shareCardDiscount}}</span>
                    <span style="font-size: 30rpx;margin-right:20rpx;">折</span>
                    <span style="font-size: 24rpx;border:2rpx solid #D09242;color:#fff;">会员折扣</span>
                  </div>
              </div>
          </div>
         <div class="no_more" v-if="noMore">{{notice_mes}}</div>
      </div>

      <div class="bot_btn" @click="addShare">
        <i class="iconfont icon-jia"></i>
        <div>新增卡主共享卡</div>
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
            supplierLogo:'',
            shopName:'',
            unitAddress:'',
            id:'',

            dataList:{
              token:'',
              mainCardNO:'',
              pageNum:1,
              pageSize:20,
            },
            mycreatData:[],
            noMore:false,
            notice_mes:'',
            cardDiscount:'',
            discountOffset:'',
            mainCardDiscountOfStatProfit:'',
            shareCardDiscountRateLimit: ''
          }
        },
        mounted(){
            var par = getQuery();
            if(par.mainCardNO) {
              this.dataList.mainCardNO = par.mainCardNO.replace(/\s+/g, "");
            }else{
              this.dataList.mainCardNO = par.mainCardNO;
            }
            this.id = par.id;
            this.supplierLogo  = par.supplierLogo;
            this.shopName  = par.shopName;
            this.unitAddress  = par.unitAddress;
            this.cardDiscount = par.cardDiscount;
            this.discountOffset = par.discountOffset;
            this.mainCardDiscountOfStatProfit =par.mainCardDiscountOfStatProfit;
          this.shareCardDiscountRateLimit = par.shareCardDiscountRateLimit;
            this.getShareList(this.dataList);
        },
        methods:{
          getShareList(par){
             var _this = this;
             par.token = _this.$store.state.token;
             var _data = par;
             getSignIn(_data).then(sec=>{
               _this.$http.getShaCard(_data,sec).then(res=>{
                 if(res.data.length ==0 && this.mycreatData.length !=0){
                   wx.hideLoading()
                   _this.noMore = true;
                   _this.notice_mes ='没有更多数据了~';
                 }
                 var vData = res.data;
                 for(let i=0;i<vData.length;i++){
                   vData[i].createTime = toDate(vData[i].createTime * 1000);
                   vData[i].shareCardDiscount = ((vData[i].shareCardDiscount)*1000)/100;
                   vData[i].commissionRate = ((vData[i].commissionRate)*1000)/10;
                 }
                 this.mycreatData = this.mycreatData.concat(res.data);
               })
             })
          },
          addShare(){
            var bool = floatTo.multiply(Number(this.mainCardDiscountOfStatProfit), 10) <= floatTo.subtract(floatTo.multiply(Number(this.shareCardDiscountRateLimit), 10), Number(this.discountOffset));
            if(bool) {
              wx.redirectTo({
                url: `/pages/packageD/pages/creatVipCard/main?id=${this.id}`
              })
            }else{
              Tips.toast(`主卡折扣大于${floatTo.subtract(floatTo.multiply(Number(this.shareCardDiscountRateLimit),10),Number(this.discountOffset))}无法设置共享卡`,'none');
            }
          },
          gotogShare(par){
            wx.redirectTo({
              url:`/pages/packageD/pages/togShareDetail/main?mainId=${this.id}
              &id=${par.id}
              &mainCardNO=${this.dataList.mainCardNO}
              &discountOffset=${this.discountOffset}
              &mainCardDiscountOfStatProfit=${this.mainCardDiscountOfStatProfit}
              &shareCardDiscountRateLimit=${this.shareCardDiscountRateLimit}`
            })
          }
        },
      async onReachBottom() {
        this.dataList.pageNum ++;
        Tips.loading();
        if(this.notice_mes == '没有更多数据了~'){
          return
        }
        this.getShareList(this.dataList);
      },
    }
</script>

<style lang="scss" scoped>
  .page{
    background:rgba(242,242,242,1);
    width:100%;
    height:100%;
    position: absolute;
    top:0;
    bottom:0;
    .no_more{
      width:100%;
      height:90rpx;
      text-align: center;
      line-height: 90rpx;
      background:#F6F6F6;
    }
    .my_sh_top{
      width:100%;
      height:200rpx;
      background:#fff;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top:4rpx;
      .eve_vipcard{
        width:708rpx;
        border-radius: 10rpx;
        margin:22rpx 0;
        position: relative;
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
            background:#ff6700;
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
              color:#000;
              font-size: 36rpx;
            }
            .eve_mid_top{
              width:530rpx;
              padding-right:24rpx;
              @include ovh();
              color:#000;
              font-size: 24rpx;
            }
          }
        }
      }
    }
    .my_sh_bot{
      width:680rpx;
      margin:0 35rpx;
      margin-top:72rpx;
      .eve_sh{
        width:640rpx;
        height:180rpx;
        background:linear-gradient(270deg,rgba(255,197,90,1),rgba(255,206,99,1),rgba(255,221,114,1));
        border:1px solid rgba(196, 235, 255, 1);
        border-radius:20rpx 20rpx 0 0;
        margin-bottom:40rpx;
        padding:0 20rpx;
        padding-top:20rpx;
        .eve_sh_top{
          display: flex;
          justify-content: space-between;
          align-items: center;
          color:#fff;
          margin-bottom:20rpx;
          .eve_sh_le{
            font-size: 24rpx;
            color:#A46F23;
          }
          .eve_sh_ri{
            background:linear-gradient(85deg,rgba(213,156,57,1) 0.2685546875%, rgba(247,236,162,1) 53.1005859375%, rgba(206,144,46,1) 96.8994140625%);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            font-size: 30rpx;
            font-weight: bold;
            }
          }
        }
        .eve_sh_bot{
          display: flex;
          justify-content: space-between;
          align-items: center;
            .eve_sh_le{
               color:#fff;
              font-size: 28rpx;
            }
          .eve_sh_ri{
            span{
              background:linear-gradient(0deg,rgba(114,66,27,1) 0%, rgba(208,146,66,1) 100%);
              -webkit-background-clip:text;
              -webkit-text-fill-color:transparent;
            }
          }
        }
      }
    }
    .bot_btn{
       width:100%;
      display:flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      i{
        font-size: 60rpx;
        color:#F60F51;
      }
      div{
        font-size: 30rpx;
      }
    }

</style>
