<template>
    <div class="page">
      <div class="page_top" v-if="noticeIt">
        <i class="iconfont icon-X"></i><span>试试向左滑，可收藏、可分享</span>
      </div>

       <div class="svip_page">
          <!--大卡的样式-->
          <div class="new_eve_svip" v-if="showMaxCard"  v-for="(item,index) in dataList" :key="item.id">
            <div class="new_eve_top" @click="gopay(item)">
                <div class="new_eve_ci">
                  <div class="new_eve_le">
                    <div class="eve_new_title">
                      <img src="../../static/img/card_logo.png" alt="">
                    </div>
                    <span style="font-size:24rpx;color:#A46F23;">(累积使用：{{item.consumeAmount}}次)</span>
                  </div>
                  <div class="new_eve_ri">
                    <!--<img src="../../static/img/pepole.png" style="width:40rpx;height:40rpx;" alt="">-->
                    <div class="nick">持卡人：{{item.realName}}</div>
                  </div>
                </div>
                <div class="new_eve_title" style="color:#A46F23;">余额：{{item.money}}元</div>

                <div class="new_eve_mid">
                      <div class="dicount_style">
                        <span class="discount" style="color:#A46F23;">{{item.shareCardDiscount * 1000/100}}</span><span class="zhe" style="color:#A46F23;">折</span><span class="zhe_style">会员折扣</span>
                      </div>
                      <div class="eve_ri_mid" style="background: #F7094D;color:#fff;">
                         分享卡付款
                      </div>
                </div>
            </div>
            <div class="new_eve_bot">
               <div class="le_eve_le" v-if="item.collection==0" @click.stop="shoucan(item)">
                   <i class="iconfont icon-shoucang"></i><span>加入收藏</span>
               </div>

              <div class="le_eve_le" v-if="item.collection==1" @click.stop="shoucan(item)">
                <i class="iconfont icon-shoucang" style="color:#FDB300;"></i><span>取消收藏</span>
              </div>
               <div class="ri_eve_ri">
                  <div>分享赚佣金{{item.commissionRate *1000/10}}%</div>
                 <button @click="shareIt(item)"><i class="iconfont icon-fenxiang"></i><span>分享好友</span></button>
               </div>
            </div>
         </div>

          <!--小卡的样式-->
          <div  class="eve_new" v-if="showMinCard" v-for="(item,index) in dataList" :key="item.id" >
               <movable-area>
                 <movable-view out-of-bounds="true" direction="horizontal" :x="item"
                               inertia="true"
                               :productIndex="index"
                               @touchstart="handleTouchStart"
                               @touchend="handleTouchEnd"
                               @change="handleMovableChange">
                   <div class="eve_new_eve" @click="gopay(item)">
                     <div class="eve_use">
                       <div class="new_eve_le">
                          <div class="eve_new_title">
                            <img src="../../static/img/card_logo.png" alt="">
                          </div>
                          <span style="font-size:24rpx;color:#A46F23;">(累积使用：{{item.consumeAmount}}次)</span>
                       </div>
                       <div class="new_eve_ri">
                         <!--<img src="../../static/img/pepole.png" style="width:40rpx;height:40rpx;" alt="">-->
                         <div class="nick">持卡人：{{item.realName}}</div>
                       </div>
                     </div>
                     <div class="eve_balance">余额：{{item.money}}元</div>
                     <div class="eve_disCou">
                       <div class="all_le">
                         <div class="disCou_le">
                           <span style="font-size: 60rpx;color:#A46F23;margin-right:4rpx;">{{item.shareCardDiscount * 1000/100}}</span>
                           <span style="margin-right:20rpx;color:#A46F23;">折</span>
                           <span style="border:2rpx solid #A46F23;padding:0 6rpx;font-size: 24rpx;color:#A46F23;">会员折扣</span>
                         </div>
                       </div>
                       <div class="all_ri" style="background: #F7094D;color:#fff;">
                         分享卡付款
                       </div>
                     </div>
                   </div>
                 </movable-view>
               </movable-area>
               <div class="delete-btn">
                 <div class="eve_btn">
                   <div class="all_inner"  v-if="item.collection == 0"  @click.stop="shoucan(item)">
                     <div>加入</div>
                     <div>收藏</div>
                   </div>
                   <div class="all_inner"  v-if="item.collection != 0"  @click.stop="shoucan(item)">
                     <div>取消</div>
                     <div>收藏</div>
                   </div>
                 </div>
                 <div class="eve_btn eve_sec" @click.stop="shareIt(item)">
                   <div class="all_inner">
                     <div>分享赚</div>
                     <div>佣金{{item.commissionRate *1000/10}}%</div>
                   </div>
                 </div>
                 <div class="eve_btn eve_th" @click="gopay(item)">
                   <div class="all_inner">
                     <div>使用</div>
                     <div>此卡</div>
                   </div>
                 </div>
               </div>
           </div>
       </div>

       <!--弹出层-->
      <div class="sha_mask" v-if="showItMask"  @click="showItEve">
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
      <!--切换样式的地方-->
      <div class="switch_style">
          <div class="min_img" v-if="showMinCard" @click="showMin">
             <img src="../../static/img/min.png" alt="">
          </div>
          <div class="max_img" v-if="showMaxCard" @click="showMax">
             <img src="../../static/img/max.png" alt="">
          </div>
      </div>
    </div>
</template>

<script>
    import { getSignIn , getQuery , base64src ,base64Name} from '@/common/js/comm';
    import { mapMutations } from 'vuex'
    import { SHARECARDID , ISCOUPON ,ISSELECTCARD , ISSVIPCARD}  from '@/store/mutation-types'
    import Tips from '@/common/js/tips';
    import address from '@/images/addressImg.png'
    import phone from '@/images/phoneImg.png'
    export default {
        name: "index",
        data(){
          return {
            par:{
              token:'',longitude:'',latitude:'',distance:'',shopStoreId:'',pageNum:1,pageSize:10,
            },

            dataList:[],

            animationData:{},
            animation:'',

            currentPar:{},
            showItMask:false,
            showEwm:false,
            showPos:false,
            width:375,
            height:667,

            // canvas
            logoImg:'',
            bjtempFilePath:'',
            shopLogo:'',
            qrCode:'',

            currentItemId:0,
            images:[],
            scrollTop:'',
            yesAnmation:true,

            indicatorDots: false,
            autoplay: false,
            interval: 3000,
            duration: 1000,
            current:0,

            imgNum:2,
            imgNum_sec:3,
            totalMoney:'',
            noticeIt:true,
            inviterId:'',

            currentData:'',
            otherNum:1,
            shareCId:'',
            pageIndex:'',

            showMinCard:true,
            showMaxCard:false
          }
        },
        mounted(){
          var par = getQuery();
          this.par.longitude = par.longitude ? par.longitude :'';
          this.par.latitude = par.latitude ? par.latitude :'';
          this.par.distance = par.distance ? par.distance:'';
          this.par.shopStoreId = par.shopStoreId ? par.shopStoreId:'';
          this.par.token = this.$store.state.token;
          this.totalMoney = par.totalMoney ? par.totalMoney :'';
          this.inviterId = par.inviterId ? par.inviterId :'';
          this.pageIndex = par.pageIndex ? par.pageIndex :'';
          //调用动画
          this.getList(this.par);
        },
        methods:{
          ...mapMutations({
            shareCardId:'SHARECARDID',
            isCoupon:'ISCOUPON',
            isSelectCard:'ISSELECTCARD',
            isSvipCard:'ISSVIPCARD'
          }),
          showMin(){
            console.log(1);
             this.showMinCard =false;
             this.showMaxCard =true;
          },
          showMax(){
            console.log(2);
            this.showMinCard =true;
            this.showMaxCard =false;
          },
          currectChange(e){
            let num = e.target.current;
            this.scrollTop = 110 * num;
          },
          scroll(e){
            let num = Math.ceil(e.target.scrollTop/110);
            if(e.target.scrollTop/110 < num){
               this.current = num;
            }
          },
          gopay(par){
            var _this = this ;
            _this.shareCardId(par.id);
            _this.isCoupon(0);
            _this.isSelectCard(3);
            if(_this.pageIndex.indexOf('shopRecDet')>-1){
              wx.redirectTo({
                url:`../../pages/payMoney/main?sharecardId=${par.id}&shopStoreId=${par.shopStoreId}&totalMoney=${_this.totalMoney}&identification=svipCard&inviterId=${_this.inviterId}`
              })
            }else{
              wx.navigateBack({
                delta: 1
              })
            }
          },
          closeNotice(){
             this.noticeIt = false;
          },
          getList(data){
            var _this = this;
            getSignIn(data).then(sec=>{
                _this.$http.recomShare(data,sec).then(res=>{
                  if(res.state ==1) {
                    for (let i = 0; i < res.data.length; i++) {
                      res.data[i].money = (res.data[i].money * 100 / 10000).toFixed(2);
                    }
                    _this.dataList = res.data;
                    _this.currentData = res.data[0];
                  }else{
                    Tips.toast(decodeURIComponent(res.msg),'none');
                  }
                })
            })
          },
          shoucan(par){
            var _this =this;
            var collectState;
            if(par.collection == 1){
              collectState = '0';
            }else{
              collectState = '1';
            }
            var _data = {
              token:_this.$store.state.token,
              collection:collectState,
              shopStoreId:_this.par.shopStoreId,
              shareCardId:par.id,
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
                  _this.dataList = [];
                  _this.getList(_this.par);
                }else{
                  Tips.toast(`${res.msg}`,'none')
                }
              })
            })
          },
          shareIt(par){
              console.log('获取参数' , par);
              this.currentPar = {};
              this.currentPar = par;
              this.currentPar = par;
              this.showItMask = true;
              var _this = this;
              _this.getMinMes();
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
              sharecardId:_this.currentPar.id,
              distance:_this.currentPar.distance,
              shopStoreId:_this.currentPar.shopStoreId
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
              destWidth: 1125,
              destHeight: 2001,
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
          // 一系列动画函数  滑动渐入渐出
        },
        onShareAppMessage(res){
          this.images = this.currentPar.storeImgs.split(',');
          let inviterId = this.$store.state.userLiId;
          if (res.from === 'button') {
            console.log('啦啦啦德玛西亚',res.target);
          }
          return {
            title:`【${this.currentPar.storeName}】点击卡主付款,最低享受${this.currentPar.shareCardDiscount * 1000/100}折优惠`,
            path:`pages/packageB/pages/shareCardDetail/main?distance=${this.par.distance}&shareid=${this.currentPar.id}&shopStoreId=${this.currentPar.shopStoreId}&inviterId=${inviterId}`,
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
  height:100%;
  background:#f6f6f6;
  position: absolute;
  left:0;
  right:0;
  bottom:0;
  top:0;
  .switch_style{
    width:90rpx;
    height:90rpx;
    position: fixed;
    bottom:106rpx;
    right:32rpx;
    border-radius: 50%;
    z-index: 99;
    .min_img{
      width:90rpx;
      height:90rpx;
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
    .max_img{
      width:90rpx;
      height:90rpx;
      img{
        width:100%;
        height:100%;
        display: block;
      }
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
    z-index: 996;
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
    z-index: 997;
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
    z-index: 999;
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
  .svip_page{
    width:710rpx;
    overflow: hidden;
    margin:42rpx 20rpx;
    swiper{
      height:390rpx;
    }
    .new_eve_svip{
      width:680rpx;
      height:340rpx;
      margin:0 15rpx;
      background:#ffffff;
      border-radius: 20rpx;
      box-shadow:0rpx 5rpx 20rpx 4rpx rgba(101,101,101,0.25);
      margin-bottom:26rpx;
      opacity: 1;

      .new_eve_top{
        width:600rpx;
        height:220rpx;
        background:linear-gradient(90deg,rgba(255,221,114,1),rgba(255,197,90,1));
        border:1px solid rgba(255, 213, 106, 1);
        box-shadow:0px 2px 10px 0px rgba(200,163,73,0.5);
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
        padding:0 40rpx;
        padding-top:40rpx;
        position: relative;
        .notice{
          position: absolute;
          right:42rpx;
          top:26rpx;
          font-weight: bold;
          font-size: 30rpx;
          color:rgba(240,211,134,1);
          background:linear-gradient(85deg,rgba(213,156,57,1) 0.2685546875%, rgba(247,236,162,1) 53.1005859375%, rgba(206,144,46,1) 96.8994140625%);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }
        .new_eve_title{
          font-size: 30rpx;
          color:#fff;
        }
        .new_eve_ci{
          font-size: 24rpx;
          color:#fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .new_eve_le {
            display: flex;
            align-items: center;
            .eve_new_title {
              width:150rpx;
              height:44rpx;
              margin-right: 10rpx;
              img{
                width:100%;
                height:100%;
                display: block;
              }
            }
          }
          .new_eve_ri{
            display: flex;
            font-size: 24rpx;
            color:#fff;
            line-height: 40rpx;
            .nick{
              margin-left:8rpx;
              max-width:204rpx;
              @include ovh;
              align-items: center;
              color:#A46F23;
            }
          }
        }
        .dicount_style{
            color:#fff;
            .discount{
               font-size: 60rpx;
               margin-right:4rpx;
            }
           .zhe{
             font-size: 28rpx;
           }
           .zhe_style{
             /*color:#fff;*/
             border:2rpx solid #A46F23;
             font-size: 24rpx;
             margin-left:10rpx;
             padding:0 10rpx;
             color:#A46F23;
           }
        }
        .new_eve_mid{
           display:flex;
           justify-content: space-between;
           align-items: center;
           width:600rpx;
           height:56rpx;
           position: absolute;
           bottom:20rpx;
           left:0;
           padding:0 40rpx;
          .eve_le_mid{
             font-size: 24rpx;
             color:#fff;
          }
          .eve_ri_mid{
             width:218rpx;
             height:56rpx;
             background:linear-gradient(85deg,rgba(213,156,57,1),rgba(247,236,162,1),rgba(206,144,46,1));
             border-radius: 10rpx;
             color:#90390F;
             font-size:24rpx;
             text-align: center;
             line-height: 56rpx;
          }
        }
      }
      .new_eve_bot{
        width:600rpx;
        height:80rpx;
        background:#fff;
        border-bottom-left-radius: 20rpx;
        border-bottom-right-radius: 20rpx;
        padding:0 40rpx;
        display: flex;
        justify-content: space-between;
        .le_eve_le{
          line-height: 80rpx;
          display: flex;
           i{
             color:#D2D2D2;
             margin-right:10rpx;
           }
          span{
            font-size: 24rpx;
            color:#8D8E98;
          }
        }
        .ri_eve_ri{
          display: flex;
          align-items: center;
          div{
            font-size: 24rpx;
            color:#8D8E98;
            margin-right:10rpx;
          }
          button{
            height:50rpx;
            display: flex;
            color:#fff;
            background:rgba(210,210,210,1);
            border-radius:10rpx;
            font-size: 24rpx;
            line-height: 50rpx;
            align-items: center;
            i{
              font-size: 24rpx;
              margin-right:4rpx;
            }
          }
        }
      }
    }
    .eve_new{
      width:680rpx;
      margin:0 15rpx;
      background:linear-gradient(90deg,rgba(255,221,114,1),rgba(255,197,90,1));
      border:1px solid rgba(255, 213, 106, 1);
      box-shadow:0px 2px 10px 0px rgba(200,163,73,0.5);
      border-top-left-radius: 20rpx;
      border-top-right-radius: 20rpx;
      box-shadow:0rpx 5rpx 20rpx 4rpx rgba(101,101,101,0.25);
      margin-bottom:20rpx;
      position: relative;
      .eve_new_eve{
        width:600rpx;
        height:172rpx;
        background:linear-gradient(90deg,rgba(255,221,114,1),rgba(255,197,90,1));
        border:1px solid rgba(255, 213, 106, 1);
        box-shadow:0px 2px 10px 0px rgba(200,163,73,0.5);
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
        padding:24rpx 40rpx;
        position: relative;
        .eve_title{
          position: absolute;
          right:60rpx;
          top:22rpx;
          font-size: 24rpx;
          color:#fff;
        }
        .eve_balance{
          font-size:30rpx;
          color:#A46F23;
        }
        .eve_use{
          font-size: 24rpx;
          color:#fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom:10rpx;
          .new_eve_le {
            display: flex;
            align-items: center;
            .eve_new_title {
              width:150rpx;
              height:44rpx;
              margin-right: 10rpx;
              img{
                width:100%;
                height:100%;
                display: block;
              }
            }
          }
          .new_eve_ri{
            display: flex;
            font-size: 24rpx;
            color:#fff;
            line-height: 40rpx;
            .nick{
              margin-left:8rpx;
              max-width:204rpx;
              @include ovh;
              align-items: center;
              color:#A46F23;
            }
          }
        }
        .eve_disCou{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .all_le {
            display: flex;
            align-items: center;
            .disCou_le {
              color:#fff;
            }
            .disCou_ri {
              font-size: 22rpx;
              color:#fff;
              border:2rpx solid  #ffffff;
              padding:0 10rpx;
              margin-left:10rpx;
            }
          }
          .all_ri{
            width:218rpx;
            height:56rpx;
            background:linear-gradient(85deg,rgba(213,156,57,1),rgba(247,236,162,1),rgba(206,144,46,1));
            border-radius:10rpx;
            color:#90390F;
            font-size: 24rpx;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
      movable-area {
        height: 200rpx;
        width: 326rpx;
        padding-bottom:20rpx;
      }
      movable-view {
        height: 200rpx;
        width: 680rpx;
        background: #fff;
        padding-bottom:20rpx;
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
        z-index: 99;
      }
      .delete-btn {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 354rpx;
        background: #E66671;
        border-top-right-radius: 20rpx;
        display: flex;
        justify-content: space-around;
        .eve_btn{
           width:118rpx;
           background:#FDB300;
           display: flex;
           justify-content: center;
           align-items: center;
          .all_inner{
            div{
              width:100%;
              text-align: center;
              color:#fff;
              font-size: 24rpx;
            }
          }
        }
        .eve_sec{
          background:#FFA035;
        }
        .eve_th{
          background:#ED752E;
          border-top-right-radius: 20rpx;
        }
      }
    }

    .eve_svip{
      width:710rpx;
      height:200rpx;
      background:linear-gradient(0deg,rgba(169,110,255,1),rgba(128,195,250,1));
      border:1px solid rgba(196, 235, 255, 1);
      border-radius:10rpx;
      position: relative;
      margin:20rpx 0;
      margin-bottom:30rpx;
      .eve_dis{
        position: absolute;
        right:20rpx;
        top:-10rpx;
        width:116rpx;
        height:54rpx;
        color:#fff;
        background:rgba(85,110,235,1);
        border-radius:10rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .eve_text{
        position: absolute;
        right:26rpx;
        top:52rpx;
        font-size:20rpx;
        color:#fff;
      }
      .add_collect{
        position: absolute;
        bottom:12rpx;
        right:166rpx;
        width:136rpx;
        height:46rpx;
        background:#8E5AED;
        color:#fff;
        font-size: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 24rpx;
      }
      .sha_page{
          position: absolute;
          bottom:12rpx;
          right:12rpx;
          width:136rpx;
          height:46rpx;
          background:#8E5AED;
          color:#fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24rpx;
          line-height: 46rpx;
         span{
           font-size: 24rpx;
         }
         i{
          font-size:24rpx;
           margin-right: 10rpx;
         }
      }
      .eve_title{
        padding:0 30rpx;
        font-size:36rpx;
        color:#fff;
        margin-top:10rpx;
        /*margin-bottom:30rpx;*/
      }
    }



    .eve_con{
      display: flex;
      justify-content: space-between;
      color:#fff;
      font-size:24rpx;
      padding:0 30rpx;
    }
    .eve_le{
      color:#fff;
      font-size:24rpx;
      padding:0 30rpx;
    }
    .eve_ri{
      color:#fff;
      font-size:24rpx;
      padding:0 30rpx;
    }
    .eve_per{
      color:#fff;
      font-size:24rpx;
      padding:0 30rpx;
      padding-top:12rpx;
    }
  }
}
</style>
