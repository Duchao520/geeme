<template>
  <transition  name="slide_down_up">
    <div class="out_mask" v-show="isShow">
    <section class="savePic">
      <div class="close" @click="close">
        <img src="@/assets/imgs/common/close.png"  alt="">
      </div>
      <div class="pic">
        <div class="vPoster">
          <img :src="poster" alt="">
        </div>
      </div>
      <button class="btn_save" @click="download">保存图片</button>
      <p class="slogan">保存图片到相册，分享给好友</p>
    </section>
    </div>
  </transition>
</template>

<script>
  import {reqSaveImage , postImgUrl} from "@/assets/js/jsBridge";
  import {getqrCode} from "@/assets/js/comm";
  export default {
    name: "vPoster",
    data() {
      return {
        ctx: '',
        width: '',
        height: '',
        canvas: '',
        poster: '',
        status: '',
        isShow: false,
        qrCode:'',
        detail: ''
      }
    },
    methods: {
      close() {
        var _self = this;
        _self.isShow = false;
      },
      clear(){
        var _self = this;
        this.status='';
      },
      show(){
        this.isShow = true;
      },
      get2D(detail) {
        var _self = this;
        _self.detail = detail;
        _self.clear();
        try {
          _self.wrapText();
          _self.canvas = document.createElement('canvas');
          _self.canvas.width = 750;
          _self.canvas.height = 1334;
          _self.width = 750;
          _self.height = 1334;
          _self.ctx = _self.canvas.getContext('2d');
          _self.ctx.clearRect(0, 0, _self.width, _self.height);
          _self.ctx.fillStyle = "#FFFFFF";
          _self.ctx.fillRect(0, 0, _self.width, _self.height);
          _self.status = _self.status + '1';
          _self.drawLogo();  //11
          // _self.drawShopName(_self.card.storeName);
          _self.drawStoreImgs(_self.detail.bargainImg);  //111
          _self.drawRoundRect(_self.ctx, 0, 1042, 360, 68, 34 , "#F60F51");  //11111111
          _self.drawTxt();  //111111
          // _self.drawPrice();
          setTimeout(() => {
            _self.drawPrice();   //111111111
          },300);
          _self.drawMiniCode(_self.detail.qrCode);
        } catch (e) {
          alert(e)
        }
      },
      drawLogo(){
        var _self = this;
        var image = new Image();
        image.crossOrigin = 'Anonymous';
        image.onload = function () {
          _self.ctx.drawImage(image, 22, 36, 274, 70);
          _self.status = _self.status + '1';
        };
        image.src = require('@/assets/imgs/common/zst_logo.png');
      },
      drawStoreImgs(imgSrc) {
        var _self = this;
        var image = new Image();
        imgSrc = imgSrc ? imgSrc.replace('https', 'http') : imgSrc;
        // image.setAttribute("crossOrigin", 'Anonymous');
        imgSrc = imgSrc + '!320x200'
        image.onload = function () {
          _self.drawRoundRectImg(_self.ctx, image, 24, 136, 700, 700, 10);
          _self.status = _self.status + '1';
        };
        image.setAttribute("crossOrigin", 'Anonymous');
        image.src = imgSrc ? imgSrc : defaultImg;
      },
      drawTitle() {
        var _self = this;
        _self.ctx.font = "30px MicrosoftYaHei";
        _self.ctx.fillStyle = '#000000';
        _self.ctx.wrapText(_self.detail.biBargain.title, 18, 870, 640, 48);
        _self.status  = _self.status + '1';
      },
      drawIcon() {
        var _self = this;
        var image = new Image();
        image.crossOrigin = 'Anonymous';
        _self.drawIconMes(26,1126,36,36,1);
        _self.drawIconMes(26,1176,36,36,2);
        _self.drawIconMes(26,1260,36,36,3);
      },
      drawIconMes(x, y, width, height,imgUrl){
        var _self = this;
        var image = new Image();
        image.crossOrigin = 'Anonymous';
        image.onload = function () {
          _self.ctx.drawImage(image, x, y, width, height);
          _self.status = _self.status + '1';
        };
        if(imgUrl==1) {
          image.src = require('@/assets/imgs/cardFriends/icon_store.png');
        }else if(imgUrl==2){
          image.src = require('@/assets/imgs/cardFriends/addressImg.png');
        }else if(imgUrl==3){
          image.src = require('@/assets/imgs/cardFriends/phoneImg.png');
        }
      },
      drawPrice() {
        var _self = this;
        var discount = _self.$accDiv(Number(_self.detail.biBargain.discount),10);
        var prentPrice = (_self.$accMul(_self.detail.biBargain.price, discount).toFixed(2));
        _self.ctx.font ="48px MicrosoftYaHei";
        _self.ctx.fillStyle = '#F7094D';
        var txt = Number(prentPrice) == 0 ? '砍价免费拿' : '￥' + prentPrice;
        _self.ctx.fillText(txt, 24, 970);
        //
        if(Number(prentPrice) != 0){
          var prentPriceWidth = _self.ctx.measureText(txt).width;
          var price = (_self.$accMul(_self.detail.biBargain.price,1)).toFixed(2);
          _self.ctx.font ="24px MicrosoftYaHei";
          _self.ctx.fillStyle = '#9A9DA5';
          _self.ctx.fillText('￥'+ price, 24 + prentPriceWidth, 970);
          var priceWidth = _self.ctx.measureText('￥'+ price).width;
          _self.ctx.fillStyle = '#cccccc';
          _self.ctx.moveTo(24 + prentPriceWidth, 962);
          _self.ctx.lineTo(24 + prentPriceWidth + priceWidth, 962);
          _self.ctx.stroke();
        }
        //
        //
        // _self.ctx.fillStyle = '#FFFFFF';
        // _self.ctx.moveTo(726, 988);
        // _self.ctx.lineTo(726, 1024);
        // _self.ctx.stroke();
        //
        _self.ctx.font='38px MicrosoftYaHei';
        _self.ctx.fillStyle = '#F7094D';
        _self.ctx.textAlign ='right';
        _self.ctx.fillText('共'+ _self.detail.shareNum +'份', 726, 970);

        _self.status  = _self.status + '1';
        setTimeout(() => {
          _self.drawTxt();
        },100)
      },
      drawTxt() {
        var _self = this;
        _self.ctx.font = "36px MicrosoftYaHei";
        _self.ctx.fillStyle = '#FFFFFF';
        _self.ctx.textAlign = 'left';
        _self.ctx.fillText('长按图片，扫码砍价', 18, 1088);

        var useNum = _self.detail.biBargain.helperNum;  //总共多少人
        _self.ctx.font = "20px MicrosoftYaHei";
        _self.ctx.fillStyle = '#FFFFFF';
        _self.ctx.textAlign ='left';
        if(useNum < 10) {
          _self.ctx.fillText('参与人数' + 10 + '人', 570, 1000);
        }else{
          _self.ctx.fillText('参与人数' + useNum + '人', 570, 1000);
        }


        _self.ctx.font="24px MicrosoftYaHei";
        _self.ctx.fillStyle = '#000000';
        _self.ctx.fillText(_self.detail.storeName, 70, 1154);


        _self.ctx.fillText(_self.detail.shopTel, 70, 1290);
        _self.ctx.wrapText( _self.detail.address, 70 , 1208 , 326 , 36);
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
        ctx.fillStyle = color;
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        /*ctx.save()
        ctx.setFillStyle(color)
        ctx.fillRect(x, y, width, height);*/
        _self.status  = _self.status + '1';
        setTimeout(() => {
          _self.drawRoundRectLeft(_self.ctx, 542, 980, 180, 30, 16,'#000000');
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
        ctx.fillStyle = color;
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        _self.status  = _self.status + '1';
      },


      /**
       * 在canvas原型上增加一个文本换行方法
       * */
      wrapText() {
        CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {
          if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
            return;
          }

          var context = this;
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
        };
      },

      drawMiniCode(imgSrc) {
        var _self = this;
        var image = new Image();
        // image.setAttribute("crossOrigin", 'Anonymous');
        imgSrc = imgSrc ? imgSrc.replace('https', 'http') : imgSrc;

        image.onload = function () {
          _self.ctx.drawImage(image, 432, 1024, 292, 292);
          _self.status = _self.status + '1';
        }
        image.setAttribute("crossOrigin", 'Anonymous');
        image.src = imgSrc ? imgSrc : defaultImg;
      },
      /**
       * 画圆图
       * @param ctx
       * @param img
       * @param x
       * @param y
       * @param r
       */
      circleImg(ctx, img, x, y, r) {
        ctx.save();
        var d = 2 * r;
        var cx = x + r;
        var cy = y + r;
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, x, y, d, d);
        ctx.restore();
      },
      /**
       * 画圆角矩形图片
       * @param ctx
       * @param img
       * @param x
       * @param y
       * @param width
       * @param height
       * @param r
       */
      drawRoundRectImg(ctx, img, x, y, width, height, r) {
        ctx.save();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + width, y, x + width, y + r, r); // draw right side and bottom right corner
        ctx.arcTo(x + width, y + height, x + width - r, y + height, r); // draw bottom and bottom left corner
        ctx.arcTo(x, y + height, x, y + height - r, r); // draw left and top left corner
        ctx.arcTo(x, y, x + r, y, r);
        ctx.clip();
        ctx.drawImage(img, x, y, width, height);
        ctx.restore();
      },
      exportImg() {
        var _self = this;
        try {
          _self.poster = _self.canvas.toDataURL("image/png");
        } catch (e) {
          alert(e)
        }
      },
      download() {
        var _self = this;
        var date = new Date();
        var url = _self.poster.split(',');
        var obj = {
          imageUrl: url[1],
          imageName: date.getTime()
        }
        reqSaveImage(obj);
      },
      share(){
        var url = this.poster.split(',')[1];
        if(url){
          postImgUrl(url);
        }else{
          alert('图片异常')
        }
      }
    },
    watch: {
      status() {
        var _self = this;
        if (_self.status == '11111111111111111') {
          _self.exportImg();
        }

      }
    }
  }
</script>

<style lang="scss" scoped>
  .slide_down_up-enter-active {
    animation: slideInUp .2s;
  }

  .slide_down_up-leave-active {
    animation: slideOutDown .2s;
  }
  .vPoster {
    width: 100%;
    height: 100%;

    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: .1rem;
    }
  }
  .out_mask{
    position: fixed;
    z-index: 99;
    top:0;
    left:0;
    right: 0;
    bottom: 0;
    background:rgba(0,0,0,0.3);
  }
  .savePic{
    position: fixed;
    left:0;
    bottom:0;
    background: #EEEEEE;
    height: 10.46rem;
    box-sizing: border-box;
    z-index: 99;
    width:100%;
    .close{
      position: absolute;
      right:0.1rem;
      top:-0.8rem;
      width:0.55rem;
      height:0.55rem;
      img{
        display: block;
        width:100%;
        height:100%;
      }
    }
    .pic{
      width: 4.27rem;
      height: 7.59rem;
      box-shadow:0 .11rem .35rem 0 rgba(194,194,194,0.41);
      border-radius: .2rem;
      margin: 0 auto;
      background: #FFFFFF;
      margin-bottom: .41rem;
      margin-top:0.6rem;
    }
    .btn_save{
      display: block;
      width: 4.71rem;
      height: .91rem;
      border-radius: .07rem;
      background: #F7094D;
      font-size: .41rem;
      color: #FFFFFF;
      margin: 0 auto;
      margin-bottom: .16rem;
    }
    .slogan{
      color: #8D8E98;
      font-size: .3rem;
      text-align: center;
    }
  }
</style>
