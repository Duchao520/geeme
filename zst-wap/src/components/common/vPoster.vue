<template>
  <div class="vPoster">
    <img :src="poster" alt="">
  </div>
</template>

<script>
  import {reqSaveImage , postImgUrl} from "@/assets/js/jsBridge";
  import defaultImg from '@/assets/imgs/common/defaultGoods.png';

  export default {
    name: "vPoster",
    props: ['card'],
    data() {
      return {
        ctx: '',
        width: '',
        height: '',
        canvas: '',
        poster: '',
        status: ''
      }
    },
    methods: {
      clear() {
        var _self = this;
        _self.poster = "";
        _self.status = '';
        _self.ctx.clearRect(0, 0, _self.width, _self.height);
      },
      get2D() {
        var _self = this;
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
          _self.drawLogo(_self.card.storeLogo);
          _self.drawShopName(_self.card.storeName);
          _self.drawStoreImgs(_self.card.storeImgs.split(',')[0]);
          _self.drawDiscount(Number(_self.card.shareCardDiscount * 100 / 10).toFixed(1), _self.card.nick, _self.card.consumeAmount, _self.card.address, _self.card.phone);
          _self.drawIcon();
          _self.drawMiniCode(_self.card.qrCode);
        } catch (e) {
          alert(e)
        }
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
      drawLogo(imgSrc) {
        try {
          var _self = this;
          var x = _self.width / 2 - 75;
          var y = 50;
          var r = 75;
          var image = new Image();
          imgSrc = imgSrc ? imgSrc.replace('https', 'http') : imgSrc;
          // image.crossOrigin = 'Anonymous';
          image.onload = function () {
            _self.circleImg(_self.ctx, image, x, y, r);
            _self.status = _self.status + '1';
          };

          image.onerror = function (e) {
            alert('加载失败' + JSON.stringify(e))
          }
          image.setAttribute("crossOrigin", 'Anonymous');
          image.src = imgSrc ? imgSrc : defaultImg;
        } catch (e) {
          alert(e);
        }
      },
      drawStoreImgs(imgSrc) {
        var _self = this;
        var x = _self.width / 2 - 355;
        var y = 295;
        var width = 710;
        var height = 439;
        var image = new Image();
        imgSrc = imgSrc ? imgSrc.replace('https', 'http') : imgSrc;
        // image.setAttribute("crossOrigin", 'Anonymous');
        imgSrc = imgSrc + '!320x200'
        image.onload = function () {
          _self.drawRoundRectImg(_self.ctx, image, x, y, width, height, 10);
          _self.status = _self.status + '1';
        };
        image.setAttribute("crossOrigin", 'Anonymous');
        image.src = imgSrc ? imgSrc : defaultImg;
      },
      drawShopName(shopName) {
        var _self = this;
        _self.ctx.textAlign = "center";
        _self.ctx.font = "36px MicrosoftYaHei";
        _self.ctx.fillStyle = "#000000";
        _self.ctx.fillText(shopName, 375, 253);
        _self.status = _self.status + '1';
      },
      drawDiscount(discount, nick, count, address, phone) {
        var _self = this;
        _self.ctx.textAlign = "left";
        _self.ctx.font = "72px MicrosoftYaHei ";
        _self.ctx.fillStyle = "#F7094D";
        _self.ctx.fillText(discount, 36, 857);

        _self.ctx.textAlign = "left";
        _self.ctx.font = "36px MicrosoftYaHei ";
        _self.ctx.fillStyle = "#F7094D";
        _self.ctx.fillText('折', 145, 857);

        _self.ctx.textAlign = "right";
        _self.ctx.font = "30px MicrosoftYaHei ";
        _self.ctx.fillStyle = "#8D8E98";
        var txt = '持卡人：' + nick;
        _self.ctx.fillText(txt, 710, 855);

        _self.ctx.textAlign = "left";
        _self.ctx.font = "30px MicrosoftYaHei ";
        _self.ctx.fillStyle = "#8D8E98";
        txt = '累计使用：' + count + '次';
        _self.ctx.fillText(txt, 36, 895);

        _self.drawRoundRect(_self.ctx, 0, 965, 370, 101, 50);

        _self.ctx.textAlign = "center";
        _self.ctx.font = "36px MicrosoftYaHei ";
        _self.ctx.fillStyle = "#FFFFFF";
        txt = '长按图片识别二维码';
        _self.ctx.fillText(txt, 185, 1030);

        _self.ctx.textAlign = 'left';
        _self.ctx.font = "30px MicrosoftYaHei";
        _self.ctx.fillStyle = "#000000";
        _self.ctx.wrapText(address, 64, 1139, 314, 48);

        _self.ctx.textAlign = 'left';
        _self.ctx.font = "30px MicrosoftYaHei";
        _self.ctx.fillStyle = "#000000";
        _self.ctx.fillText(phone, 64, 1238);


        _self.status = _self.status + '1';
      },
      drawIcon() {
        var _self = this;
        var image = new Image();
        image.crossOrigin = 'Anonymous';
        image.onload = function () {
          _self.ctx.drawImage(image, 15, 1109, 40, 40);
          _self.status = _self.status + '1';
        };
        image.src = require('@/assets/imgs/common/icon_address.png');

        var image_2 = new Image();
        image.crossOrigin = 'Anonymous';
        image_2.onload = function () {
          _self.ctx.drawImage(image_2, 15, 1208, 40, 40);
          _self.status = _self.status + '1';
        };
        image_2.src = require("@/assets/imgs/common/icon_phone.png");
      },
      drawMiniCode(imgSrc) {
        var _self = this;
        var image = new Image();
        // image.setAttribute("crossOrigin", 'Anonymous');
        imgSrc = imgSrc ? imgSrc.replace('https', 'http') : imgSrc;

        image.onload = function () {
          _self.ctx.drawImage(image, 400, 963, 324, 324);
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

      drawRoundRect(ctx, x, y, width, height, r) {
        ctx.save();
        ctx.moveTo(x, y);
        ctx.arcTo(x + width, y, x + width, y + r, r); // draw right side and bottom right corner
        ctx.arcTo(x + width, y + height, x + width - r, y + height, r); // draw bottom and bottom left corner
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y);
        ctx.fillStyle = "#F60F51";
        ctx.fill();
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
        /*// 生成一个a元素
        var a = document.createElement('a');
        // 创建一个单击事件
        var event = new MouseEvent('click');

        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        a.download = '123';
        // 将生成的URL设置为a.href属性
        a.href = _self.poster;

        // 触发a的单击事件
        a.dispatchEvent(event);*/
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
        if (_self.status == '11111111') {
          _self.exportImg();

        }

      }
    }
  }
</script>

<style lang="scss" scoped>
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
</style>
