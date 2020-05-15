<template>
  <div class="page">
    <div class="in_mask" v-if="visibleIt" @click="closeMask">
      <canvas class="canvas-hide" canvas-id="myCanvas" style="width:612rpx;height:1100rpx;display: none;"></canvas>
      <div class="savePic" @click="onUserSaveImageRight">
        <div>保存图片</div>
      </div>
    </div>
    <scroll-view scroll-y="true"
                 :scroll-into-view="toView"
                 :scroll-top="scrollTop"
                 @scroll="scroll">
      <div class="page_top">
        分享专属海报，关系自动绑定
      </div>
      <div class="banner_img">
        <swiper class="swiper"
                :indicator-dots="indicatorDots"
                :current="currentTab"
                :vertical="vertical"
                :autoplay="autoplay"
                :interval="interval"
                :duration="duration"
                next-margin="60rpx"
                previous-margin="60rpx"
                :circular="circular"
                :display-multiple-items="imgNum">
          <block v-for="(item,index) in images" :key="index">
            <swiper-item class="li1" @click="changeMes(item,index)">
              <img :src="item.imghref" alt="" class="slide-image">
              <div class="erweima">
                <img :src="imgHref" alt="">
              </div>
              <div class="img_top">
                <div class="img_title">1.微信扫码关注公众号2.下载助商通APP3.微信登录APP</div>
                <div class="img_inner">二维码有效期至{{expireDate}}</div>
              </div>
            </swiper-item>
          </block>
        </swiper>
      </div>
      <div class="divid_line">
        <img src="../../static/img/line.png" alt="">
      </div>

      <div class="divid_title" id="the-id">
        <div class="di_tit">邀请规则</div>
        <div class="di_inner">
          <div>1.专属海报中的二维码包含您的邀请信息</div>
          <div>2.A还有通过您的二维码海报下载APP并注册成助 商通会员后，也永久成为您</div>
          <div>3.如果A用户邀请了成员B为助商通会员，则B在助商通内线上消费,您都将获得30%的消费佣金奖励；如果B升级为VIP会员，您还能得到40元奖励 </div>
          <div>4.推广二维码保存为图片的有效期为动态生成30天，APP内使用不受有效期影响</div>
        </div>
      </div>
    </scroll-view>

    <div class="bot_btn">
      <div class="bot_le" @click="tapMove">查看邀请规则</div>
      <div class="bot_ri" @click="shareBann">分享专属海报</div>
    </div>
  </div>
</template>

<script>
  import { getSignIn , getQuery} from '@/common/js/comm';
  export default {
    name: "index",
    data(){
      return {
        indicatorDots: false,
        vertical: false,
        autoplay: false,
        interval: 3000,
        duration: 1000,
        circular:true,
        imgNum:1,
        currentTab:1,
        images:[],
        imgHref:'',
        expireDate:'',
        scrollTop:'',
        visibleIt:false,
        bjtempFilePath:'',
      }
    },
    mounted(){
      this.getBanner();
    },
    methods:{
      getBanner(){
        var _this = this;
        var _data = {
          token:this.$store.state.token,
          terminalType:0,
        }
        getSignIn(_data).then(sec=>{
          _this.$http.getPageBanner(_data,sec).then(res=>{
            console.log('1111',res);
            var domain = res.imgDomain;
            // domain =domain.replace('http','https');
            var imgs = res.listKtCarousel;
            for(let i=0;i<imgs.length;i++){
              imgs[i].imghref = `${domain}${imgs[i].imghref}`
            }
            _this.images = imgs;
            _this.imgHref = res.expQrurl;
            _this.expireDate = res.expireDate;
          })
        })
      },
      changeMes(par,ind){
        console.log(par);
        var _this = this;
        _this.currentTab = ind;
        const ctx = wx.createCanvasContext('myCanvas');
        ctx.setFillStyle('#ffffff');
        ctx.fillRect(0, 0, 355, 600)
        wx.downloadFile({
          url:`${par.imghref}`,
          success(res1) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            console.log('111111',_this.imgHref);
            if (res1.statusCode === 200) {
              wx.downloadFile({
                url:`${_this.imgHref}`,
                success(res2) {
                  if (res2.statusCode === 200) {
                    ctx.drawImage(res1.tempFilePath , 0, 0, 306, 504);
                    ctx.drawImage(res2.tempFilePath,97,362,112,112);
                    ctx.fillStyle="#000000";
                    let metrics = ctx.measureText('1.微信扫码关注公众号2.下载助商通APP3.微信登录APP');
                    if(metrics) {
                      let mwid = metrics.width;
                      let y1 = (306 / 2) - (mwid / 2);
                      let metrics2 = ctx.measureText(`二维码有效期至${_this.expireDate}`);
                      let mwid2 = metrics2.width;
                      let y2 = (306 / 2) - (mwid2 / 2);
                      ctx.fillText('1.微信扫码关注公众号2.下载助商通APP3.微信登录APP', y1, 520);
                      ctx.fillText(`二维码有效期至${_this.expireDate}`,y2,540);
                      ctx.draw();
                    }

                    wx.canvasToTempFilePath({
                      x: 0,
                      y: 0,
                      width: 306,
                      height: 550,
                      canvasId: "myCanvas",
                      success: function(e) {
                        console.log('1111',e)
                        _this.bjtempFilePath = e.tempFilePath;  // 拿到要保存的图片路径
                      },
                      fail: function(e) {
                        console.log(e);
                      }
                    })

                  }
                }
              })

            }
          }
        })
        this.visibleIt = true;

      },
      //有个小bug 滚动到某个位置,回不来了,擦
      tapMove(e){
        this.scrollTop = 314;
      },
      scroll(e) {

      },
      closeMask(){
        this.visibleIt = false;
      },
      onUserSaveImageRight() {
        var _this = this;
        if (!wx.saveImageToPhotosAlbum) {
          return wx.showModal({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
          })
        }
        wx.getSetting({
          success: function (res) {
            res.authSetting["scope.writePhotosAlbum"] ? (console.log("1-已经授权《保存图片》权限"), _this.saveImg()) : wx.authorize({
              scope: "scope.writePhotosAlbum",
              success: function () {
                console.log("用户对相册-授权成功"), _this.saveImg();
              },
              fail: function () {
                wx.showModal({
                  title: "提示",
                  content: "请您授权保存到系统相册",
                  showCancel: !1,
                  success: function (res) {
                    res.confirm && wx.openSetting({
                      success: function (res) {
                        res.authSetting["scope.writePhotosAlbum"] ? setTimeout(function () {
                          _this.saveImg();
                        }, 500) : wx.showModal({
                          title: "提示",
                          content: "您未授权，无法将海报保存到相册，你可以截屏得到海报，或者再次点击'保存海报'按钮并授权",
                          showCancel: !1
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      },

      saveImg() {
        var filePath = this.bjtempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: filePath,
          success: function (res) {
            console.log(res);
            wx.showToast({
              title: "保存成功",
              icon: "success",
              duration: 1500
            });
          },
          fail: function () {
            wx.showToast({
              title: "保存失败",
              icon: "fail",
              duration: 1500
            });
          }
        })
      }
    },

  }
</script>

<style lang="scss" scoped>
  .page{
    width:100%;

    .in_mask{
      z-index: 333;
      position: fixed;
      width:100vw;
      height:100vh;
      background:rgba(0,0,0,0.4);
      display:flex;
      justify-content: center;
      align-items: center;
      .savePic{
        width:100%;
        height:72rpx;
        color:#fff;
        font-size: 30rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        div{
          width:324rpx;
          height:72rpx;
          background:linear-gradient(180deg,rgba(255,137,139,1),rgba(247,9,77,1));
          text-align: center;
          line-height: 72rpx;
          border-radius: 12rpx;
        }
      }
    }
    .page_top{
      width:100%;
      text-align: center;
      font-size:30rpx;
      color: rgba(0,0,0,0.6);
    }
    .banner_img{
      width:100%;
      height:1200rpx;
      margin-bottom:36rpx;
      swiper{
        height:1200rpx;
      }
      .slide-image{
        width:612rpx;
        height:1110rpx;
      }
      .li1{
        position: relative;

        .erweima{
          position: absolute;
          left:0;right:0;
          bottom:138rpx;
          margin:0 auto;
          width:224rpx;
          height:224rpx;
          background:#fff;
          overflow: auto;
          img{
            width:100%;
            height:100%;
            display: block;
            overflow: auto;
          }
        }
        .img_top{
          position: absolute;
          bottom:-20rpx;
          left:0rpx;
          width:612rpx;
          height:100rpx;
          z-index: 222;
          div{
            width:100%;
            font-size:28rpx;
            text-align: center;
          }
          .img_title{
            font-size: 24rpx;
          }
        }
      }
    }
    .divid_line{
      width: 100%;
      height: 12rpx;
      display:flex;
      justify-content: center;
      align-items: center;
      margin-bottom:16rpx;
      img{
        width:704rpx;
        height: 12rpx;
        display: block;
      }
    }
    .divid_title{
      width:710rpx;
      height:40rpx;
      margin:0 20rpx;
      .di_tit{
        margin:30rpx 0;
      }
      .di_inner{
        width:100%;
        font-size: 30rpx;
        padding-bottom:100rpx;
        div{
          margin-bottom:26rpx;
        }
      }
    }
    .bot_btn{
      position: fixed;
      bottom:0;
      left:0;
      width:710rpx;
      padding:0 20rpx;
      height:100rpx;
      background:#fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 222;
      div{
        width:324rpx;
        height:72rpx;
        line-height: 72rpx;
        text-align: center;
        border-radius: 20rpx;
        color:#fff;
      }
      .bot_le{
        background:linear-gradient(180deg,rgba(255,175,37,1),rgba(255,144,0,1));
      }
      .bot_ri{
        background:linear-gradient(180deg,rgba(255,137,139,1),rgba(247,9,77,1));
      }
    }
  }
</style>
