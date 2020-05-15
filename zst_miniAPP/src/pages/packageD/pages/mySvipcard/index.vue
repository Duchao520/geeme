<template>
    <div class="page">
      <!--我的卡-->
      <div class="page_vipCard" v-if="showGcol">
          <!--联盟打折卡-->
          <div class="alliance" v-if="showlianmeng==1">
            <img src="../../static/img/newSvipcard/back.png" alt="">
            <div class="text_mes">
              有效期至{{shareDiscountCardExpireTime}}
            </div>
          </div>
          <div v-if="showlianmeng==1" style="width:100%;height:12rpx;background:#E3E3E3;margin-top:30rpx;"></div>
          <div class="top_title">
             我充值的卡
          </div>
          <div class="eve_vipcard"
               v-for="item in svipCard"
               :key="item.id"
               @click="gosvipDe(item)"
               :style="{'background':bgColorValue}">
            <div class="vip_discount">
              <img src="../../static/img/mySvipCard.png" alt="">
            </div>
             <div class="eve_le">
                <div class="eve_img">
                  <img :src="item.storeLogo" alt="">
                </div>
             </div>
             <div class="eve_ri">
                  <div class="all_le">
                      <div class="ri_top_con">
                        <div class="eve_ri_top">
                           {{item.storeName}}
                        </div>
                        <div class="eve_mid_top">
                          {{item.unitAddress}}
                        </div>
                      </div>
                      <div class="new_con">
                           <span style="font-size: 60rpx;background:linear-gradient(0deg,rgba(254,237,186,1) 0%, rgba(255,249,247,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{{item.discountRate * 1000/100 ?item.discountRate * 1000/100:0}}</span>
                           <span style="font-size: 30rpx;margin-right:10rpx;color:#FF946E;background:linear-gradient(0deg,rgba(254,237,186,1) 0%, rgba(255,249,247,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">折</span>
                           <span style="font-size: 24rpx;border:2rpx solid #FFF;background:linear-gradient(0deg,rgba(254,237,186,1) 0%, rgba(255,249,247,1) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;padding:0 4rpx;">会员折扣</span>
                      </div>
                  </div>
                  <div class="eve_bot_top">
                     <span style="margin-right:20rpx;">余额：{{item.money}}元 </span>
                     <span v-if="item.activeType==2 && item.shareCardCount!=0">共享卡：{{item.shareCardCount}}张</span>
                     <span v-if="item.activeType==3 && item.shareCardCount!=0">分享卡：{{item.shareCardCount}}张</span>
                  </div>
             </div>
          </div>
      </div>
      <!--收藏的卡-->
      <div class="new_page_vipCard" v-if="!showGcol">
        <div class="page_top" v-if="noticeIt">
          <i class="iconfont icon-X" @click="closeNotice"></i><span>长按卡片可取消收藏</span>
        </div>
        <div class="eve_vipcard"
             style="border:1px solid rgba(196, 235, 255, 1);"
             v-for="item in svipCard"
             :key="item.id"
             @click="goShareCard(item)"
             @longpress="longPress(item)">
          <div class="card_Type" style="width:160rpx;height:42rpx;">
            <img style="width:100%;height:100%;display: block;" src="../../static/img/newSvipcard/card_logo.png" alt="">
          </div>
          <div class="eve_le">
            <div class="eve_img">
              <img :src="item.storeLogo" alt="">
            </div>
          </div>
          <div class="eve_ri">

            <div class="all_le">
              <div class="ri_top_con">
                <div class="eve_ri_top" style="color:#353535;">
                   {{item.storeName}}
                </div>
                <div class="eve_mid_top" style="color:#A46F23;">
                  {{item.address}}
                </div>
              </div>

              <div class="new_con">
                <span style="font-size: 60rpx;color:#A46F23;">{{item.shareCardDiscount * 1000/100 ? item.shareCardDiscount * 1000/100:0}}</span>
                <span style="font-size: 30rpx;margin-right:10rpx;color:#A46F23;">折</span>
                <span style="font-size: 24rpx;border:2rpx solid #A46F23;color:#A46F23;padding:0 4rpx;">会员折扣</span>
              </div>
            </div>

            <div class="eve_bot_top">
              <div style="color:#A46F23;font-size: 28rpx;">余额：{{item.money}}元 </div>
              <div style="background:rgba(255,255,255,0.2);border-radius:10rpx;color:#A46F23;font-size: 24rpx;line-height: 44rpx;padding:2rpx 12rpx;display: flex;"  @click.stop="shareIt(item)">
                 <i class="iconfont icon-fenxiang" style="margin-right:10rpx;"></i><span style="font-size: 24rpx;color:#A46F23;">分享赚佣金{{item.commissionRate *1000/10 }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bot_btn">
        <div class="all_btn">
          <div class="all_btn_btn" @click="getMyCard(1)">
               <div class="le_bot_btn">
                  <div class="inner_btn" :class="showGcol?'godColour':'nogodColour'">
                     我的卡  共{{svipMaincardCount}}张
                  </div>
               </div>
            </div>
          <div class="all_btn_btn" @click="getMyCard(2)">

            <div class="ri_bot_btn">
              <div class="inner_btn" :class="showGcol?'nogodColour':'godColour'">
                  收藏的卡
                  共{{svipcardShareuserCount}}张
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--弹出层-->
      <div class="sha_mask" v-if="showItMask" :animation="slide_up1"  @click="showItEve">
        <div class="sha_bot" @click.stop>
          <div class="sha_bot_top">
            <div class="sha_bot_inner">
              <div class="eve_inner"  @click.stop>
                <button class="eve_img" open-type="share" style="background:#4AB218;">
                  <i class="iconfont icon-wechat" style="font-size: 60rpx;"></i>
                </button>
                <div class="eve_tit">
                  分享给好友
                </div>
              </div>

              <div class="eve_inner" @click.stop="faceScan">
                <div class="eve_img" style="background:#F60F51;">
                  <i class="iconfont icon-qr-code"></i>
                </div>
                <div class="eve_tit">
                  面对面扫码
                </div>
              </div>

              <div class="eve_inner" @click.stop="postGene(currentPar)">
                <div class="eve_img" style="background:#00A0E9;">
                  <i class="iconfont icon-zhaopian-cuxiantiao-fill"></i>
                </div>
                <div class="eve_tit">
                  生成海报
                </div>
              </div>
            </div>
          </div>
          <div class="sha_bot_bot" @click="closeMask">
            取消
          </div>
        </div>
      </div>
      <!--微信小程序二维码分享按钮-->
      <div class="ewm_mask" v-if="showEwm">

        <div class="sha_bot">
          <div class="close_ewm" @click="closeEwm">
            <img src="/static/img/close.png" alt="">
          </div>
          <div class="sha_tit_top">
            <div class="tit_img">
              <img :src="currentPar.storeLogo" alt="">
            </div>
            <div class="tit_tit">{{currentPar.storeName}}</div>
          </div>

          <div class="sha_tit_mid">
            <div class="ewm_img">
              <img :src="qrCode" alt="">
            </div>
          </div>
          <div class="sha_tit_bot">
            微信扫码卡主付款享{{currentPar.shareCardDiscount * 1000/100}}折
          </div>
        </div>
      </div>
      <!--生成海报-->
      <div class="creatPos_mask"  v-if="showPos">
        <canvas class="canvas-hide" canvas-id="myCanvas" :style="{width: width +'px', height: height + 'px'}"></canvas>
        <div class="sha_bot">
          <div class="close_ewm" @click="closePos">
            <img src="/static/img/close.png" alt="">
          </div>
          <div class="poster_img">
            <div class="inner_pos">
              <img :src="bjtempFilePath" alt="">
            </div>

            <div class="save_img" @click="saveImgs">
              <div class="save_inner">
                保存图片
              </div>
            </div>
            <div class="save_tex">保存图片到相册，分享给好友</div>
          </div>
        </div>
      </div>
      <div class="back_index" @click="backIndex">
        <img src="/static/img/common/back_index.png" alt="">
      </div>
      <no-data :showNoData = "noData" :noticeMes="conNot"/>

    </div>
</template>

<script>
    import { getSignIn ,base64src,base64Name , getQuery ,toDate,getYeMoDa} from '@/common/js/comm';
    import noData from '@/components/noData';
    import { mapMutations } from 'vuex'
    import { BGCOLORVALUE }  from '@/store/mutation-types'
    import address from '@/images/addressImg.png'
    import phone from '@/images/phoneImg.png'
    import Tips from '@/common/js/tips';
    export default {
        name: "index",
        data(){
          return {
            showGcol:true,
            svipCard:[],
            noData:false,
            conNot:'',
            bgColorValue:'',

            showItMask:false,
            showEwm:false,
            showPos:false,
            width:375,
            height:667,
            currentPar:'',
            qrCode:'',
            bjtempFilePath:'',
            shareid:'',
            shopStoreId:'',
            images:[],

            svipMaincardCount:'',
            svipcardShareuserCount:'',
            noticeIt:true,
            pageFrom:'',
            allienceDiscountCard:{},
            showlianmeng:0,
            shareDiscountCardExpireTime:''
          }
        },
        components:{
           noData
        },
        onShow(){
          let parder = getQuery();
          this.pageFrom = parder.pageFrom ? parder.pageFrom:'';
          if(!((this.pageFrom).indexOf('isCarder')>-1)) {
            let par = this.$store.state.collection;  //1
            this.getCarder(par);
          }
        },
        mounted(){
          this.getCarder(1);   //1
          this.changethem();
        },
        methods:{
          ...mapMutations({
            bgColorVa:'BGCOLORVALUE'
          }),
          closeNotice(){
            this.noticeIt = false;
          },
          backIndex(){
            wx.switchTab({
              url:'/pages/index/main'
            })
          },
          longPress(par){
            var _this = this;
            wx.showModal({
              title: '提示',
              content: '确认取消收藏该卡?',
              success (res) {
                if (res.confirm) {
                  _this.shoucan(par)
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })

          },
          shoucan(par){
            var _this =this;
            var collectState =0;
            var _data = {
              token:_this.$store.state.token,
              collection:collectState,
              shopStoreId:par.shopStoreId,
              shareCardId:par.svipcardshareId
            }
            getSignIn(_data).then(res=>{
              var sec = res;
              _this.$http.collectionPag(_data,sec).then((res)=>{
                if(res.state ==1) {
                  if(collectState ==1){
                    Tips.toast('收藏成功','success');
                  }else{
                    Tips.toast('已取消收藏','none')
                  }
                  this.getCarder(2);
                }else{
                  Tips.toast(`${res.msg}`,'none');
                }
              })
            })
          },
          changethem(){
            let bgColor = [
              {'bgColor':'linear-gradient(270deg,rgba(221,64,81,1),rgba(221,64,81,1),rgba(220,61,78,1));'},
              {'bgColor':'linear-gradient(270deg,rgba(195,135,88,1),rgba(207,155,101,1),rgba(236,204,167,1))'},
              {'bgColor':'linear-gradient(270deg,rgba(35,158,128,1),rgba(96,194,166,1),rgba(118,219,225,1))'},
              {'bgColor':'linear-gradient(270deg,rgba(207,18,65,1),rgba(237,55,102,1),rgba(255,131,131,1))'},
              {'bgColor':'linear-gradient(270deg,rgba(101,6,15,1),rgba(177,32,61,1),rgba(207,90,83,1))'}
              ];
            var index = Math.floor((Math.random()*bgColor.length));
            this.bgColorVa(`${bgColor[0].bgColor}`);
            this.bgColorValue = this.$store.state.bgColorValue;
          },
          getMyCard(par){
            var _this = this;
            if(par ==1){
              _this.showGcol = true;
              _this.getCarder(1);
            }else{
              _this.showGcol = false;
              _this.getCarder(2);
            }
          },
          getCarder(par){
            var _this = this;
            var _data = {
              token:_this.$store.state.token,
              cardType:par
            }
            getSignIn(_data).then(sec=>{
              _this.$http.getCardBag(_data,sec).then(res=>{
                 if(res.state ==1) {
                   _this.svipMaincardCount = res.svipMaincardCount;
                   _this.svipcardShareuserCount = res.svipcardShareuserCount;
                   if(res.allienceDiscountCard) {
                     if (JSON.stringify(res.allienceDiscountCard) === '{}') {
                       _this.showlianmeng = 0;
                       _this.shareDiscountCardExpireTime = '';
                     } else {
                       _this.shareDiscountCardExpireTime = res.allienceDiscountCard.shareDiscountCardExpireTime ? getYeMoDa(Number(res.allienceDiscountCard.shareDiscountCardExpireTime) * 1000) : '';
                       _this.allienceDiscountCard = res.allienceDiscountCard;
                       _this.showlianmeng = 1
                     }
                   }
                   if (res.data.length != 0) {
                     _this.noData = false;
                     _this.conNot = '';
                     var cardList = res.data;
                     for (let i = 0; i < cardList.length; i++) {
                       cardList[i].money = (cardList[i].money / 100).toFixed(2)
                     }
                     _this.svipCard = [];
                     _this.svipCard = res.data;
                   }else{
                     _this.svipCard = [];
                     _this.noData = true;
                     _this.conNot = '您当前还没有会员卡';
                   }
                 }
              })
            })
          },
          gosvipDe(item){
             wx.navigateTo({
                url:`/pages/packageD/pages/svipCardDetail/main?id=${item.id}`
             })
          },
          goShareCard(item){
              wx.navigateTo({
                url:`/pages/packageB/pages/shareCardDetail/main?shareid=${item.svipcardshareId}&shopStoreId=${item.shopStoreId}&distance=${item.distance}`
              })
          },
          shareIt(par){
            this.currentPar = {};
            this.currentPar = par;
            console.log('看看当前页面的数据',this.currentPar);
            this.showItMask = true;
            this.shopStoreId = par.shopStoreId;
            this.shareid =par.svipcardshareId;
            this.images = par.storeImgs.split(',');
            this.slideupshow(this, 'slide_up1', -200, 1);
            var _this = this;
            _this.getMinMes(par);
          },
          postGene(par){
            this.showPos = true;
            var _this = this;
            _this.currentPar = par;
            Tips.loading('生成中...');
            var ctx= wx.createCanvasContext('myCanvas');
            ctx.setFillStyle('#ffffff');
            ctx.fillRect(0, 0, _this.width, _this.height);
            wx.downloadFile({
              url: 'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/9/16/aff44efea53e27a2d5fb471408db026f.png',
              success(res) {
                console.log(res);
                if(res.statusCode== 200){
                  ctx.drawImage(res.tempFilePath, 0 , 0, _this.width, _this.height);
                  ctx.setFontSize(14);
                  ctx.fillStyle="#ffffff";
                  ctx.fillText(`你的好友 ${_this.$store.state.nickCname} 分享给您一张会员共享卡`,30,30);
                  ctx.save();
                  _this.downloadLogoFile(par.storeLogo,ctx);
                }
              }
            })
          },
          downloadLogoFile(imghref,ctx){
            var _this = this;
            wx.downloadFile({
              url: imghref,
              success(res){
                if(res.statusCode== 200) {
                  _this.shopLogo = res.tempFilePath;
                  ctx.setFontSize(13);
                  ctx.fillStyle="#000000";
                  ctx.fillText(`${_this.currentPar.storeName}`, 100, 110);

                  ctx.setFontSize(12);
                  ctx.fillStyle="#666666";
                  // ctx.fillText(`${_this.currentPar.address}`, 100, 140);
                  _this.wrapText(ctx,`${_this.currentPar.address}`,100,136,136,20)



                  ctx.font = 'normal bold 70rpx sans-serif';
                  var grd = ctx.createLinearGradient(30, 10, 120, 10);
                  ctx.setFillStyle('#613817');
                  if((String(_this.currentPar.shareCardDiscount*10)).indexOf('.') >-1) {
                    ctx.fillText(`${_this.currentPar.shareCardDiscount * 1000 / 100}`, 230, 140);
                  }else{
                    ctx.fillText(`${_this.currentPar.shareCardDiscount * 1000 / 100}`, 280, 140);
                  }

                  ctx.setFontSize(12);
                  ctx.setFillStyle('#613817');
                  ctx.fillText(`折`,330,140);

                  //持卡人
                  console.log(_this.currentPar);
                  ctx.setFontSize(15);
                  ctx.fillStyle="#353535";
                  _this.wrapText(ctx,`共享人：${_this.currentPar.realName}(${_this.currentPar.username})`,30,210,340,20)

                  ctx.arc(60, 120, 30, 0 , Math.PI * 2, false);
                  ctx.fill();
                  ctx.clip();
                  ctx.drawImage(_this.shopLogo, 30 , 90, 60, 60);
                  _this.dowloadEwmFile(_this.qrCode,ctx)

                }
              },
              fail(res){
                return res;
              }
            })
          },
          dowloadEwmFile(imghref,ctx){
            var _this = this;
            wx.downloadFile({
              url: imghref,
              success(res){
                if(res.statusCode == 200){
                  ctx.restore();
                  ctx.drawImage(res.tempFilePath, 204 , 514, 120, 120);
                  ctx.draw(true,_this.canvaToimg);
                }
              }
            })
          },
          getMinMes(){
            var _this = this;
            var _data = {
              token:_this.$store.state.token,
              sharecardId:_this.shareid,
              distance:_this.currentPar.distance,
              shopStoreId:_this.shopStoreId
            }
            getSignIn(_data).then(sec=>{
              _this.$http.getMinMes(_data,sec).then(res=>{
                if(res.state==1){
                  _this.qrCode = res.data.qrCode;
                }else{
                  Tips.toast(`${res.msg}`,'none');
                }
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
        },
        onShareAppMessage(res){
          if (res.from === 'button') {
            console.log('啦啦啦德玛西亚',res.target);
          }
          return {
            title:`【${this.currentPar.storeName}】点击卡主付款,最低享受${this.currentPar.shareCardDiscount * 1000/100}折优惠`,
            path:`pages/packageB/pages/shareCardDetail/main?distance=${this.distance}&shareid=${this.shareid}&shopStoreId=${this.shopStoreId}&inviterId=${this.$store.state.userLiId}`,
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
  position: absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  margin:auto;
  width:100%;
  height:100%;
  background:#fff;
  .back_index{
    position: fixed;
    width:116rpx;
    height:116rpx;
    display: block;
    right:40rpx;
    bottom:104rpx;
    z-index:6;
    img{
      width:100%;
      height:100%;
      display: block;
    }
  }
  .page_top{
    width:100%;
    height:90rpx;
    background:#FFDDAA;
    display: flex;
    align-items: center;
    font-size: 30rpx;
    color:#8B4302;
    i{
      padding:0 30rpx;
    }
  }
  .sha_mask{
    width:100vw;
    height:100vh;
    background:rgba(0,0,0,0.2);
    position: fixed;
    left:0;
    top:0;
    z-index: 6;
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
    z-index: 7;
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
    z-index: 8;
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
  .bot_btn{
    position: fixed;
    left:0;
    right:0;
    top:0;
    width:750rpx;
    height:90rpx;
    background:#fff;
    box-shadow: 0 -3px 5px rgba(0,0,0,0.06);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 4;
    .all_btn{
      width:456rpx;
      height:100%;
      /*background:#ff6700;*/
      display: flex;
      justify-content: space-between;
      align-items: center;
      .all_btn_btn{
        display: flex;
        align-items: center;
        flex-direction: column;
        .le_bot_btn{
          height:70rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-bottom:12rpx;
          .inner_btn{
            height:64rpx;
            font-size: 30rpx;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .inner_btn_bot{
            width:89rpx;
            height:2rpx;
            background:#fff;
        }
        .godColour{
          border-bottom:6rpx solid #F60F51;
          color:#F60F51;
        }
        .nogodColour{
          color:#8D8E98;
          border-bottom:6rpx solid #ffffff;
        }
      }

      .ri_bot_btn{
        height:70rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-bottom:12rpx;
        .inner_btn{
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 30rpx;
        }
      }
    }
  }
  .page_vipCard{
    padding-top:100rpx;
    .alliance{
      width:710rpx;
      margin:0 20rpx;
      height:280rpx;
      background:#ff6700;
      border-radius: 20rpx;
      position: relative;
      .text_mes{
        position: absolute;
        color:#fff;
        font-size: 24rpx;
        left:132rpx;
        bottom:7rpx;
        background: #000;
        border-radius: 30rpx;
        padding:0 26rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
    .top_title{
      padding:0 20rpx;
      padding-top:40rpx;
      font-size: 36rpx;
      font-weight:bold;
      color:#000;
    }
    .eve_vipcard{
      width:710rpx;
      height:220rpx;
      border-top-right-radius: 10rpx;
      border-top-left-radius: 10rpx;
      padding-top:20rpx;
      margin:22rpx 20rpx;
      position: relative;
      box-shadow: 0 0 20px 4px rgba(224, 168, 122, 0.2);
      .vip_discount{
        position: absolute;
        right:24rpx;
        top:0rpx;
        width:59rpx;
        height:58rpx;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          display: block;
          width:100%;
          height:100%;
        }
      }
      .card_Type{
        position: absolute;
        right:6rpx;
        top:10rpx;
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
        .all_le{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom:20rpx;
          .new_con{
            color:#fff;
            padding-right:30rpx;
          }
        }
        .ri_top_con{
          display: flex;
          justify-content: center;
          flex-direction: column;
          height:100rpx;
          /*margin-bottom:20rpx;*/
          width:230rpx;
          .eve_ri_top{
            color:#ffffff;
            font-size: 36rpx;
            width:250rpx;
            @include ovh();
          }
          .eve_mid_top{
            width:250rpx;
            padding-right:24rpx;
            @include ovh();
            color:#ffffff;
            font-size: 24rpx;
          }
        }
        .eve_bot_top{
          display: flex;
          justify-content: space-between;
          padding-right:30rpx;
          span{
            font-size: 28rpx;
            color:#fff;
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
  }
  .new_page_vipCard{
    width:710rpx;
    margin:0 20rpx;
    padding-top:100rpx;
    .eve_vipcard{
      width:708rpx;
      height:198rpx;
      padding:20rpx 0;
      background:linear-gradient(270deg,rgba(255,197,90,1),rgba(255,206,99,1),rgba(255,221,114,1));
      border-radius:20rpx 20rpx 0 0;
      border:1px solid rgba(224, 168, 122, 1);
      margin:22rpx 0;
      position: relative;
      box-shadow: 0 0 20px 4px rgba(224, 168, 122, 0.2);
      .vip_discount{
        position: absolute;
        right:24rpx;
        top:0;
        width:116rpx;
        height:54rpx;
        background:#172222;
        z-index: 99;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10rpx;
        div{
          overflow: hidden;
          span{
            color:#fff;
          }
        }
      }
      .card_Type{
        position: absolute;
        right:30rpx;
        font-weight: bold;
        top:6rpx;
        font-size: 30rpx;
        color:#A46F23;
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
        .all_le{
          display: flex;
          justify-content: space-between;
          .new_con{
            color:#fff;
            padding-right:30rpx;
          }
        }
        .ri_top_con{
          display: flex;
          justify-content: center;
          flex-direction: column;
          height:100rpx;
          margin-bottom:20rpx;
          .eve_ri_top{
            color:#BF7740;
            font-size: 36rpx;
            width:250rpx;
            @include ovh();
          }
          .eve_mid_top{
            width:250rpx;
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
          span{
            font-size: 28rpx;
            color:#fff;
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
  }
}


</style>
