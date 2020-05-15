<template>
    <div class="page">
      <div class="top_bac">
      </div>
       <div class="all_page_con">
         <div class="eve_vipcard">
           <div class="card_Type" style="width:160rpx;height:42rpx;">
             <img style="width:100%;height:100%;display: block;" src="../../static/img/newSvipcard/share_card.png" alt="" v-if="nomajorData.activeType == 2">
             <img style="width:100%;height:100%;display: block;" src="../../static/img/newSvipcard/card_logo.png" alt="" v-else-if="nomajorData.activeType == 3">
           </div>
           <div class="eve_le">
             <div class="eve_img">
               <img :src="nomajorData.storeLogo" alt="">
             </div>
           </div>
           <div class="eve_ri">
             <div class="ri_top_con">
               <div class="eve_ri_top" style="color:#353535;">
                  {{nomajorData.storeName}}
               </div>
               <div class="eve_mid_top" style="color:#A46F23;">
                   <span>{{nomajorData.address}}</span>
                   <!--<span style="margin-right:20rpx;">会员折扣：{{nomajorData.shareCardDiscount * 1000/100}}折</span><span>分享佣金：{{nomajorData.commissionRate* 1000/10}}%</span>-->
               </div>
               <div class="eve_bot_top" style="vertical-align:bottom">
                 <div class="eve_sh_ri" style="line-height: 56rpx;">
                   <span style="font-size: 60rpx;">{{nomajorData.shareCardDiscount * 1000/100}}</span>
                   <span style="font-size: 30rpx;margin-right:20rpx;color:#fff;">折</span>
                   <span style="font-size: 24rpx;border:2rpx solid #D09242;color:#fff;padding:2rpx 4rpx;">会员折扣</span>
                 </div>
                 <span style="line-height: 80rpx;color:#353535;">分享佣金：{{nomajorData.commissionRate* 1000/10}}%</span>
               </div>
             </div>
           </div>
         </div>
         <div class="eve_title" style="display: flex;justify-content: space-between;align-items: center">
            <span>数据统计</span>
           <div class="eve_ri_con" style="font-size: 24rpx;color:#9A9DA5;"  @click="getvipHis">
             查看详情
           </div>
         </div>
         <div class="eve_con">
            <div class="eve_le_con">
              累计消费   {{nomajorData.consumeAmount}}次
            </div>
         </div>
         <div class="eve_con" style="margin-bottom:40rpx;">
            <div class="eve_le_con">
              累计收益  {{mainCardProfits}}元
            </div>

         </div>

         <div class="eve_title" v-if="nomajorData.activeType == 2">
           分享赚方式一
         </div>
         <div class="top_inner" v-if="nomajorData.activeType == 2">
           <div class="ico_inn">
              <i style="color:#fff;margin-right:10rpx;" class="iconfont icon-dianpu"></i>
             <span style="font-size: 20rpx;color:#fff;">发布到门店</span>
           </div>
           <div class="no_notice">
             <span style="width:480rpx;">温馨提示：发布到门店，可让更多的人使用您的共享卡，每个门店每人仅限发送一张</span>
             <span class="btn_right" v-if="nomajorData.state == 0 || nomajorData.state ==3" @click="cancelSC(1)">发布到门店</span>
             <span class="btn_right" v-if="nomajorData.state == 1" @click="cancelSC(0)">撤销发布</span>
           </div>
         </div>


         <div class="eve_title" v-if="nomajorData.activeType==2" style="margin-top: 136rpx">
           分享赚方式二
         </div>
         <div class="eve_title" v-if="nomajorData.activeType==3" style="margin-top: 60rpx">
           分享赚方式一
         </div>
         <div class="top_inner" style="background: #55AE21;">
           <div class="ico_inn">
             <i style="color:#fff;margin-right:10rpx;" class="iconfont icon-wechat"></i>
             <span style="font-size: 20rpx;color:#fff;">分享给微信好友</span>
           </div>
           <div class="no_notice">
             <span>温馨提示：让好友受益，让自己赚钱,只限发送微信好友</span>
             <button class="no_re_btn" style="background:linear-gradient(0deg,rgba(85,174,33,1),rgba(116,209,52,1));padding:0;margin-left:16rpx;" open-type="share"><i>去分享</i></button>
           </div>
         </div>

         <div class="dele_sh_card"  @click="deleteSCard">
              删除共享卡
         </div>
       </div>

    </div>
</template>

<script>
    import { getSignIn , getQuery , toDate ,base64src,base64Name} from '@/common/js/comm';
    import Tips from '@/common/js/tips'
    import address from '@/images/addressImg.png'
    import phone from '@/images/phoneImg.png'
    import floatTo from '@/common/js/floatTo'
    export default {
        name: "index",
        data(){
          return {
            sharecardId:'',
            nomajorData:'',
            state:'',
            mainCardNO:'',
            mainId:'',

            distance:'',
            id:'',
            shopStoreId:'',

            mainCardProfits:'',
            inviterId:'',
            shareCardDiscount:'',
            mainCardDiscount:'',

            images:[],


            showItMask:false,
            showEwm:false,
            showPos:false,
            width:375,
            height:667,
            currentPar:'',
            qrCode:'',
            bjtempFilePath:'',
            discountOffset:'',
            mainCardDiscountOfStatProfit:'',
            shareCardDiscountRateLimit: ''
        }
        },
        mounted(){
          var par = getQuery();
          this.sharecardId = par.id;
          this.mainCardNO = par.mainCardNO;
          this.mainId = par.mainId;
          this.inviterId = par.inviterId;
          this.discountOffset = par.discountOffset
          this.mainCardDiscountOfStatProfit = par.mainCardDiscountOfStatProfit;
          this.shareCardDiscountRateLimit = par.shareCardDiscountRateLimit;
          this.Detail();
        },
        methods:{
          getvipHis(){
            wx.navigateTo({
              url:`/pages/packageD/pages/shareCardHistory/main?id=${this.id}&goTogHis=1`
            })
          },
          Detail() {
            var _this = this;
            var _data;
            _data = {
              token:_this.$store.state.token,
              sharecardId: _this.sharecardId,
            };
            getSignIn(_data).then(sec => {
              _this.$http.getnoCard(_data,sec).then(res=>{
                _this.nomajorData = res.data;
                _this.images = _this.nomajorData.storeImgs.split(',');
                _this.cardNO = res.data.shareCardNO;
                _this.distance = res.data.distance;
                _this.id = res.data.id;
                _this.mainCardDiscount = res.data.mainCardDiscount;
                _this.shareCardDiscount = res.data.shareCardDiscount;
                _this.shopStoreId = res.data.shopStoreId;
                _this.mainCardProfits = floatTo.divide(res.data.mainCardProfits,100);
              })
            })
          },
          cancelSC(par) {
            this.state = par;
            var _this = this;
            var _data = {
              token: _this.$store.state.token,
              sharecardId: _this.sharecardId,
              state: _this.state,
            }
            getSignIn(_data).then(sec => {
              _this.$http.getCancel(_data, sec).then(res => {
                if (res.state == 1) {
                  Tips.toast('操作成功','none');
                  _this.Detail();
                }else if(res.state ==3){

                } else{
                  Tips.toast(res.msg,'none');
                  return false;
                }
              })
            })
          },
          deleteSCard() {
            var _this = this;
            var _data = {
              token: _this.$store.state.token,
              sharecardId: _this.sharecardId,
            };
            Tips.confirm('确认删除当前共享卡？').then(res=>{
              getSignIn(_data).then(sec => {
                _this.$http.deleteCancel(_data ,sec).then(res => {
                  if (res.state === 1) {
                    Tips.toast('删除成功','none');
                    wx.redirectTo({
                        url:`/pages/packageD/pages/myShareCard/main?id=${this.mainId}&mainCardNO=${this.mainCardNO}
                        &supplierLogo=${_this.nomajorData.storeLogo}
                        &shopName=${_this.nomajorData.storeName}
                        &unitAddress=${_this.nomajorData.address}
                        &cardDiscount=${_this.mainCardDiscount}
                        &discountOffset=${_this.discountOffset}
                        &mainCardDiscountOfStatProfit=${_this.mainCardDiscountOfStatProfit}
                        &shareCardDiscountRateLimit=${_this.shareCardDiscountRateLimit}`,
                    })

                  }
                })
              })
            })


          },
          //自动唤行
          wrapText(context,text, x, y, maxWidth, lineHeight) {
            if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
              return;
            }

            var canvas = context.canvas;
            if (typeof maxWidth == 'undefined') {
              maxWidth = (canvas && canvas.width) || 300;
            }
            if (typeof lineHeight == 'undefined') {
              lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight);
            }

            // 字符分隔为数组
            var arrText = text.split('');
            var line = '';
            var second_height = y + lineHeight;
            var ry = y;

            for (var n = 0; n < arrText.length; n++) {
              var testLine = line + arrText[n];
              var metrics = context.measureText(testLine);
              var testWidth = metrics.width;
              if (testWidth > maxWidth && n > 0) {
                ry += lineHeight;
                if (ry > second_height) {
                  line = line.slice(0, -1);
                  line = line + ' ...';
                  context.fillText(line, x, y);
                  return;
                }
                context.fillText(line, x, y);
                line = arrText[n];
                y += lineHeight;
              } else {
                line = testLine;
              }
            }
            context.fillText(line, x, y);
          },

          showItEve(){
            this.showItMask = false;
          },
          closeMask(){
            this.showItMask = false;
          },
          faceScan(){
            this.showEwm = true;
          },
          closeEwm(){
            this.showEwm = false;
          },
          closePos(){
            this.showPos = false;
          },
          //绘制canvas

          //下载logo图片到本地  并且绘制
          canvaToimg(){
            var _this = this;
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: 375,
              height: 667,
              destWidth: 375,
              destHeight: 667,
              canvasId: "myCanvas",
              success: function(e) {
                _this.bjtempFilePath = e.tempFilePath;  // 拿到要保存的图片路径
                Tips.loaded();
              },
              fail: function(e) {
                console.log(e);
              }
            })
          },
          saveImgs(){
            var _this = this;
            wx.saveImageToPhotosAlbum({
              filePath: _this.bjtempFilePath,
              success(result) {
                if(result.errMsg == "saveImageToPhotosAlbum:ok"){
                  Tips.toast('保存成功','none')
                }
              },
              fail(res){
                Tips.toast('保存失败','none');
              }
            })

          },
          slideupshow(that,param,px,opacity){
            var animation = wx.createAnimation({
              duration: 800,
              timingFunction: 'ease',
            });
            animation.translateY(px).opacity(opacity).step()
            //将param转换为key
            var json = '{"' + param + '":""}'
            json = JSON.parse(json);
            json[param] = animation.export()
            //设置动画
            that.animationData = json;
          },

        },
      onShareAppMessage(res){
        if (res.from === 'button') {
          // 来自页面内转发按钮
        }
        return {
          title:`【${this.nomajorData.storeName}】点击卡主付款,最低享受${this.shareCardDiscount * 1000/100}折优惠`,
          path:`pages/packageB/pages/shareCardDetail/main?distance=${this.distance}&shareid=${this.id}&shopStoreId=${this.shopStoreId}&inviterId=${this.$store.state.userLiId}`,
          imageUrl:`${this.images[0]}`,
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
  right:0;
  .top_bac{
    position: absolute;
    top:0;right:0;
    left:0;
    width:100%;
    height:256rpx;
    background:#F7094D;
  }
  .sha_mask{
    width:100vw;
    height:100vh;
    background:rgba(0,0,0,0.2);
    position: fixed;
    left:0;
    top:0;
    z-index: 1;
    .sha_bot{
      position: absolute;
      width:100%;
      bottom:0;
      left:0;
      height:334rpx;
      background:#fff;
      border-radius:20rpx 20rpx 0 0;
      .sha_bot_top{
        width:100%;
        height:232rpx;
        border-bottom:2rpx solid rgba(229,229,229,1);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius:20rpx 20rpx 0 0;
        .sha_bot_inner{
          width:630rpx;
          height:233rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .eve_inner{
            display: flex;
            align-items: center;
            flex-direction: column;
            .eve_img{
              width:100rpx;
              height:100rpx;
              border-radius: 50%;
              margin-bottom:30rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              i{
                color:#fff;
                font-size: 48rpx;
              }
              img{
                width:100%;
                height:100%;
                display: block;
              }
            }
            .eve_tit{
              font-size: 24rpx;
              color:#8D8E98;
            }
          }
        }
      }
      .sha_bot_bot{
        width:100%;
        height:98rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        color:#8D8E98;
        font-size: 36rpx;
      }
    }
  }
  .ewm_mask{
    width:100vw;
    height:100vh;
    background:rgba(0,0,0,0.3);
    position: fixed;
    left:0;
    top:0;
    z-index: 2;
    .sha_bot{
      position: absolute;
      width:100%;
      bottom:0;
      left:0;
      height:848rpx;
      background:#fff;
      border-radius:20rpx 20rpx 0 0;
      .close_ewm{
        position: absolute;
        right:36rpx;
        top:-80rpx;
        width:54rpx;
        height:54rpx;
        img{
          width:100%;
          height:100%;
          display: block;
        }

      }
      .sha_tit_top{
        width:630rpx;
        padding:0 60rpx;
        height:80rpx;
        display: flex;
        align-items: center;
        margin-bottom:96rpx;
        margin-top:40rpx;
        .tit_img{
          width:80rpx;
          height:80rpx;
          background:#ff6700;
          border-radius: 50%;
          margin-right:40rpx;
          img{
            width:100%;
            height: 100%;
            display:block;
            border-radius: 50%;
          }
        }
        .tit_tit{
          font-size:36rpx;
        }
      }
      .sha_tit_mid{
        width:100%;
        height:450rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .ewm_img{
          width:450rpx;
          height:450rpx;
          background:yellowgreen;
          img{
            width:100%;
            height:100%;
            display: block;
          }
        }
      }
      .sha_tit_bot{
        width:100%;
        text-align: center;
        color:#AF7651;
        font-size:36rpx;
        margin-top:56rpx;
      }
    }
  }
  .creatPos_mask{
    width:100vw;
    height:100vh;
    background:rgba(0,0,0,0.3);
    position: fixed;
    left:0;
    top:0;
    z-index: 2;
    .canvas-hide{
      position: fixed;
      left:-375px;
      top:0;
    }
    .sha_bot{
      position: absolute;
      width:100%;
      bottom:0;
      left:0;
      height:1046rpx;
      background:#EEEEEE;
      border-radius:20rpx 20rpx 0 0;
      .close_ewm{
        position: absolute;
        right:36rpx;
        top:-80rpx;
        width:54rpx;
        height:54rpx;
        img{
          width:100%;
          height:100%;
          display: block;
        }

      }
    }
    .poster_img{
      width:100%;
      height:780rpx;
      margin-top:50rpx;
      .inner_pos{
        width:426rpx;
        margin:0 162rpx;
        background:#fff;
        border-radius: 10rpx;
        height:100%;
        margin-bottom:40rpx;
        img{
          width:100%;
          height:100%;
          display: block;
          border-radius: 10rpx;
        }
      }
      .save_img{
        width:100%;
        height:90rpx;
        display: flex;
        justify-content: center;
        align-items:center;
        margin-bottom:16rpx;
        .save_inner{
          width:470rpx;
          height:90rpx;
          background:#F7094D;
          font-size: 40rpx;
          color:#FFFFFF;
          line-height: 90rpx;
          text-align:center;
          border-radius: 6rpx;
        }
      }
      .save_tex{
        width:100%;
        text-align: center;
        font-size: 30rpx;
        color:#8D8E98;
      }
    }
  }
  .all_page_con{
    width:710rpx;
    margin:0 20rpx;
    margin-top:58rpx;
    .eve_vipcard{
      width:708rpx;
      height:198rpx;
      background:linear-gradient(270deg,rgba(255,197,90,1),rgba(255,206,99,1),rgba(255,221,114,1));
      border-radius:20rpx 20rpx 0px 0px;
      margin:22rpx 0;
      position: relative;
      box-shadow: 0 0 20px 4px rgba(224, 168, 122, 0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom:40rpx;
      .card_Type{
        position: absolute;
        border-radius:18rpx;
        top:20rpx;
        right:40rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30rpx;
        font-weight: bold;
        color:#fff;
        background:linear-gradient(85deg,rgba(213,156,57,1) 0.2685546875%, rgba(247,236,162,1) 53.1005859375%, rgba(206,144,46,1) 96.8994140625%);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
      }
      .eve_le{
        padding:0 26rpx 0 28rpx;
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
        padding-top:60rpx;
        float: left;
        width:554rpx;
        .ri_top_con{
          display: flex;
          justify-content: center;
          flex-direction: column;
          margin-bottom:20rpx;
          .eve_ri_top{
            color:#BF7740;
            font-size: 36rpx;
          }
          .eve_mid_top{
            width:530rpx;
            padding-right:24rpx;
            @include ovh();
            color:#BF7740;
            font-size: 24rpx;
          }
        }
        .eve_bot_top{
          display: flex;
          justify-content: space-between;
          padding-right:24rpx;
          .eve_sh_ri{
            font-size: 30rpx;
            font-weight: bold;
          }
          span{
            font-size: 28rpx;
            color:rgba(255,246,218,1);
            background:linear-gradient(0deg,rgba(114,66,27,1) 0%, rgba(208,146,66,1) 100%);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
          }
          .eve_btn{
            font-size: 20rpx;
            padding:6rpx 40rpx;
            background:#F60F51;
            border-radius: 20rpx;
          }
        }
      }
    }
    .top_inner{
      width:220rpx;
      height: 74rpx;
      background:#5EA0D9;
      border-radius:16rpx;
      position: relative;
      .ico_inn{
        display: flex;
        align-items: center;
        line-height: 38rpx;
        padding-left:10rpx;
      }
    }
    .eve_title{
      font-weight:bold;
      color:rgba(0,0,0,1);
      font-size: 34rpx;
      margin-bottom:30rpx;
      overflow: hidden;
    }
    .eve_con{
      width:100%;
      font-size: 30rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom:20rpx;
      overflow: hidden;
      .eve_ri_con{
        color:rgba(154,157,165,1);
        font-size:24rpx;
      }
    }
    .no_rele{
      width:100%;
      height:60rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .no_re_btn{
      height:60rpx;
      background:rgba(246,15,81,1);
      box-shadow:0 1px 3px 0 rgba(206,11,47,0.43);
      border-radius:30rpx;
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: 24rpx;
      width:170rpx;
      i{
        line-height:60rpx;
        color:#fff;
        align-items: center;
        margin-right:8rpx;
      }
      div{
        color:#fff;
        margin-left:-8rpx;
      }
    }
    .no_notice{
      position: absolute;
      left:0;
      top: 20rpx;
      width:670rpx;
      font-size: 24rpx;
      margin-top:20rpx;
      padding:20rpx;
      background:rgba(255,247,233,1);
      border-radius: 10rpx;
      line-height:48rpx;
      margin-bottom:40rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn_right{
        background:linear-gradient(0deg,rgba(94,160,217,1),rgba(136,195,247,1));
        box-shadow:0px 2px 5px 0px rgba(210,210,210,0.54);
        border-radius:25px;
        font-size: 24rpx;
        color:rgba(255,255,255,1);
        padding:4rpx 26rpx;
      }
    }
    .dele_sh_card{
      width:100%;
      height:80rpx;
      margin-top:138rpx;
      background:rgba(246,15,81,1);
      box-shadow:0 1px 3px 0 rgba(206,11,47,0.43);
      border-radius:10rpx;
      margin-bottom:40rpx;
      text-align: center;
      line-height:80rpx;
      color:#fff;
      font-size: 36rpx;
    }
  }
}
</style>
