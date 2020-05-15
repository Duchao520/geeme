<template>
  <div class="poster" v-show="isShow">
    <section>
      <img src="/static/img/close.png" alt="" class="close" @click="hide">
      <img :src="img" alt="" class="posterImg">
      <button class="btn_save" @click="saveImgs">保存图片</button>
      <p class="text-center fz-30 fc-8D8E98">保存图片到相册，分享给好友</p>
      <canvas class="canvas-hide" canvas-id="myCanvas" :style="{width: width +'px', height: height + 'px'}"></canvas>
    </section>
  </div>
</template>

<script>
  import address from '@/images/addressImg.png'
  import phone from '@/images/phoneImg.png'
  import store from '@/images/icon_store.png'
  import {base64src} from "@/common/js/comm";
  import floatTo from '@/common/js/floatTo';
  import Tips from '@/common/js/tips'

  export default {
    name: "poster",
    props: ['detail'],
    data() {
      return {
        isShow: 0,
        width: 375,
        height: 667,
        ctx: '',
        canvas: '',
        img: '',
        status: ''
      }
    },
    mounted() {
      // this.get2D();
    },
    watch: {
      status(){
        if(this.status == '11111111111'){
          this.canvas.draw(true,this.canvaToimg);
          Tips.loaded();
        }
      }
    },
    methods: {
      show(){
        var _self = this;
        _self.isShow = 1;
      },
      hide(){
        var _self = this;
        _self.isShow = 0;
      },
      //自动唤行
      wrapText(context, text, x, y, maxWidth, lineHeight) {
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
      get2D() {
        var _self = this;
        if(!_self.img){
          Tips.loading('生成中...');
          _self.canvas = wx.createCanvasContext('myCanvas');
          _self.canvas.clearRect(0, 0, _self.width, _self.height);
          _self.canvas.fillStyle = "#FFFFFF";
          _self.canvas.fillRect(0, 0, _self.width, _self.height);
          _self.drawLogo();
          _self.drawThumb();
          _self.drawQr();

          _self.drawRoundRect(_self.canvas, 0, 521, 180, 34, 17 , "#F60F51");
          setTimeout(() => {
            _self.drawPrice();
          },300)
        }
      },
      drawLogo() {
        var _self = this;
        wx.downloadFile({
          url: 'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/2/f3f0fed8ab5c68a2a78e822028ceb6b1.png',
          success(res) {
            if (res.statusCode == 200) {
              var logo = res.tempFilePath;
              _self.canvas.drawImage(logo, 11, 18, 137, 35);
              _self.status  = _self.status + '1';
            }
          },
          fail(res) {
            return res;
          }
        })
      },
      drawThumb() {
        var _self = this;
        console.log(_self.detail);
        wx.downloadFile({
          url: _self.detail.bargainImg,
          success(res) {
            if (res.statusCode == 200) {
              var img = res.tempFilePath;
              _self.canvas.drawImage(img, 12, 68, 350, 350);
              _self.status  = _self.status + '1';
            }
          },
          fail(res) {
            return res;
          }
        })
      },
      drawTitle() {
        var _self = this;
        _self.canvas.setFontSize(15);
        _self.canvas.fillStyle = '#000000';
        _self.wrapText(_self.canvas, _self.detail.biBargain.title, 9, 433, 320, 24);
        _self.status  = _self.status + '1';

      },

      drawPrice() {
        var _self = this;
        var prentPrice = (floatTo.multiply(_self.detail.biBargain.price, floatTo.divide(_self.detail.biBargain.discount,10))).toFixed(2);
        _self.canvas.setFontSize(24);
        _self.canvas.fillStyle = '#F7094D';
        var txt = Number(prentPrice) == 0 ? '砍价免费拿' : '￥' + prentPrice;
        _self.canvas.fillText(txt, 12, 485);

        if(Number(prentPrice) != 0){
          var prentPriceWidth = _self.canvas.measureText(txt).width;
          var price = (floatTo.multiply(_self.detail.biBargain.price,1)).toFixed(2);
          _self.canvas.setFontSize(12);
          _self.canvas.fillStyle = '#9A9DA5';
          _self.canvas.fillText('￥'+ price, 24 + prentPriceWidth, 485);
          var priceWidth = _self.canvas.measureText('￥'+ price).width;
          _self.canvas.setStrokeStyle('#cccccc');
          _self.canvas.moveTo(24 + prentPriceWidth, 481);
          _self.canvas.lineTo(24 + prentPriceWidth + priceWidth, 481);
          _self.canvas.stroke();
        }


        _self.canvas.setStrokeStyle('#FFFFFF');
        _self.canvas.moveTo(363, 494);
        _self.canvas.lineTo(363, 514);
        _self.canvas.stroke();

        _self.canvas.setFontSize(19);
        _self.canvas.fillStyle = '#F7094D';
        _self.canvas.setTextAlign('right');
        _self.canvas.fillText('共'+ _self.detail.shareNum +'份', 363, 485);

        _self.status  = _self.status + '1';
        setTimeout(() => {
          _self.drawTxt();
        },100)
      },

      drawTxt() {
        var _self = this;
        _self.canvas.setFontSize(18);
        _self.canvas.fillStyle = '#FFFFFF';
        _self.canvas.setTextAlign('left');
        _self.canvas.fillText('长按图片，扫码砍价', 9, 544);

        var useNum = _self.detail.biBargain.helperNum;  //总共多少人
        _self.canvas.setFontSize(10);
        _self.canvas.fillStyle = '#FFFFFF';
        _self.canvas.setTextAlign('left');
        if(useNum < 10) {
          _self.canvas.fillText('参与人数' + 10 + '人', 285, 500);
        }else{
          _self.canvas.fillText('参与人数' + useNum + '人', 285, 500);
        }


        _self.canvas.setFontSize(12);
        _self.canvas.fillStyle = '#000000';
        _self.canvas.fillText(_self.detail.storeName, 35, 577);


        _self.canvas.fillText(_self.detail.shopTel, 35, 645);

        _self.wrapText(_self.canvas, _self.detail.address, 35 , 604 , 163 , 18);
        _self.status  = _self.status + '1';

        setTimeout(() => {
          _self.drawTitle();
        },200);

        setTimeout(() => {
          _self.drawIcon();
        },200)
      },

      drawRoundRect(ctx, x, y, width, height, r,color) {
        var _self = this;
        ctx.save();
        ctx.beginPath()
        ctx.moveTo(x, y);
        ctx.arcTo(x + width, y, x + width, y + r, r); // draw right side and bottom right corner
        ctx.arcTo(x + width, y + height, x + width - r, y + height, r); // draw bottom and bottom left corner
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y);
        ctx.setFillStyle(color);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        /*ctx.save()
        ctx.setFillStyle(color)
        ctx.fillRect(x, y, width, height);*/
        _self.status  = _self.status + '1';
        setTimeout(() => {
          _self.drawRoundRectLeft(_self.canvas, 271, 490, 90, 15, 8,'#000000');
        },200)
      },
      drawRoundRectLeft(ctx, x, y, width, height, r,color) {
        var _self = this;
        ctx.save();
        ctx.beginPath()
        ctx.moveTo(x + width*0.5, y);
        ctx.arcTo(x, y, x, y + r, r); // draw right side and bottom right corner
        ctx.arcTo(x, y + height, x + r, y + height, r); // draw bottom and bottom left corner
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x+width, y + r);
        ctx.arcTo(x+width, y,x+width-r,y,r);
        ctx.lineTo(x + width*0.5, y);
        ctx.setFillStyle(color);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        /*ctx.restore()
        ctx.setFillStyle(color);
        ctx.fillRect(x, y, width, height);*/
        _self.status  = _self.status + '1';
      },
      drawQr() {
        var _self = this;
        wx.downloadFile({
          url: _self.detail.qrCode,
          success(res) {
            if (res.statusCode == 200) {
              var img = res.tempFilePath;
              _self.canvas.drawImage(img, 216, 512, 146, 146);
              _self.status  = _self.status + '1';
            }
          },
          fail(res) {
            return res;
          }
        })
      },

      drawIcon() {
        var _self = this;
        base64src(store,'01').then(res => {
          _self.canvas.drawImage(res,13,563,18,18);
          _self.status  = _self.status + '1';

        });
        base64src(address,'02').then(res1 => {
          _self.canvas.drawImage(res1,13,588,18,18);
          _self.status  = _self.status + '1'

        });
        base64src(phone,'03').then(res2 => {
          _self.canvas.drawImage(res2,13,630,18,18);
          _self.status  = _self.status + '1'
        });

      },

      //下载logo图片到本地  并且绘制
      canvaToimg() {
        var _this = this;
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 375,
          height: 667,
          destWidth: 750,
          destHeight: 1334,
          canvasId: "myCanvas",
          success: function (e) {
            _this.img = e.tempFilePath;  // 拿到要保存的图片路径
            console.log(_this.img);
          },
          fail: function (e) {
            console.log(e);
          }
        })
      },
      saveImgs(){
        var _this = this;
        if(_this.img){
          wx.saveImageToPhotosAlbum({
            filePath: _this.img,
            success(result) {
              if(result.errMsg == "saveImageToPhotosAlbum:ok"){
                Tips.toast('保存成功','none');
                _this.hide();
              }
            },
            fail(res){
              Tips.toast('保存失败','none');
            }
          })
        }

      },
    },
    onUnload(){
      this.ctx='';
      this.canvas='';
      this.img='';
      this.status= '';
      this.isShow = 0;
    }
  }
</script>

<style lang="scss" scoped>
  .poster{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(12,12,12,.5);
    z-index: 50;
    section{
      width: 100%;
      height: 1046rpx;
      border-radius:20rpx 20rpx 0 0;
      position: absolute;
      bottom: 0;
      left: 0;
      background:rgba(238,238,238,1);
      box-sizing: border-box;
      padding: 81rpx 0 0;
      .close{
        display: block;
        width: 55rpx;
        height: 55rpx;
        position: absolute;
        top: -69rpx;
        right: 28rpx;
      }
      .posterImg{
        display: block;
        width: 427rpx;
        height: 759rpx;
        background: #FFFFFF;
        box-shadow:0rpx 11rpx 35rpx 0 rgba(194,194,194,0.41);
        border-radius: 20rpx;
        margin: 0 auto;
        margin-bottom: 41rpx;
      }
      .btn_save{
        display: block;
        width: 471rpx;
        height: 91rpx;
        background: #F7094D;
        border-radius: 7rpx;
        margin: 0 auto;
        font-size: 40rpx;
        color: #FFFFFF;
        margin-bottom: 16rpx;
      }

      .canvas-hide{
        position: absolute;
        left: -999rpx;
      }
    }
  }
</style>
