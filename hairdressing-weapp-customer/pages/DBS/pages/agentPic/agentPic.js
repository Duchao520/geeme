var apiAction = null, util = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ctx: null,
    productImage: '',
    brandLogoKey: null,
    goods: null,
    sellerId: null,
    pics: null,
    shopName: null,
    shopScore: 5,
    address: null,
    tempFilePath: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    this.data.sellerId = options.sellerId;
    this.downLoad()
    this.data.ctx = wx.createCanvasContext('pic');
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    apiAction = null;
    util = null;
    app = null;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  downLoad(){
    
    app.getShopInfo(this.getShopInfo)
  },

  getShopInfo(shopInfo){
    console.log(shopInfo)
    this.data.goods = wx.$getStorage('goods');
    this.data.shopName = shopInfo.shopName;
    this.data.shopScore = shopInfo.shopScore;
    this.data.address = shopInfo.address;
    this.data.brandLogoKey = shopInfo.brandLogo;
    let thumb = this.data.goods.cycleImageList[0];
    return this.getQR().then(qrImg => {
      const promise1 = new Promise(resolve => {
        // 下载小程序码图片到本地
        wx.getImageInfo({
          src: util.getImageUrl(qrImg),
          success: res => {
            resolve({qrCode: res.path})
          },
        })
      })
      const promise2 = new Promise(resolve => {
        // 下载商品图片到本地
        wx.getImageInfo({
          src: util.getImageUrl(thumb),
          success: res => {
            resolve({thumb: res.path})
          },
        })
      })
      const promise3 = new Promise(resolve => {
        // 下载商品图片到本地
        wx.getImageInfo({
          src: util.getImageUrl(shopInfo.shopImg),
          success: res => {
            resolve({ shopLogo: res.path })
          },
        })
      })
      const promise4 = new Promise(resolve => {
        // 下载商品图片到本地
        wx.getImageInfo({
          src: util.getImageUrl(this.data.brandLogoKey),
          success: res => {
            resolve({ brandLogo: res.path })
          },
        })
      })
      util.PromiseAll([promise1, promise2, promise3, promise4]).then(res => {
        this.data.pics = res;
        this.drawPic();
      })
    })
  },

  getQR(){
    let page,scene;
    if (this.data.goods.goodsType == 1){
      page = 'pages/IC/pages/productdetails/productdetails'
      scene = `productId=${this.data.goods.goodsId}&SId=${this.data.sellerId}&isP=1`
    }else if(this.data.goods.goodsType == 2){
      page = 'pages/IC/pages/productdetails/productdetails'
      scene = `productId=${this.data.goods.goodsId}&SId=${this.data.sellerId}`
    }else{
      page = 'pages/VIP/pages/VipCardDetail/VipCardDetail'
      scene = `id=${this.data.goods.goodsId}&SId=${this.data.sellerId}`
    }
    return apiAction.commonQrCode(page, scene).then(data => {
      if(data.success){
        return data.fileKey;
      }
    })
  },

  drawPic(){
    let {ctx,goods} = this.data;
    //填充白色背景
    ctx.setFillStyle('#fff');
    ctx.fillRect(0, 0, 343, 610);
    if (goods.goodsType == 3){
      //画阴影边框
      ctx.setFillStyle('#ffffff')
      ctx.setShadow(0, 0, 10, '#AEB8E5')
      // 画商品图片
      ctx.drawImage(this.data.pics.thumb, 28, 30, 283, 180)

      ctx.setShadow(0, 0, 0, '#fff')

      //画logo
      this.drawRoundImage(ctx, 64, 65, 21, this.data.pics.brandLogo);
      ctx.setGlobalAlpha(1);



      //写卡名称
      ctx.setFontSize(18)
      ctx.setFillStyle('#fff');
      ctx.setGlobalAlpha(1);
      ctx.fillText(goods.goodsName, 92, 60)

      //画标签
      let cardName = '';
      switch (goods.cardType) {
        case 0:
          cardName = '身份卡';
          break;
        case 1:
          cardName = '储值卡';
          break;
        case 2:
          cardName = '次卡'
          break;
        case 3:
          cardName = '时间卡';
          break;
        default:
          cardName = '';
      }
      if (cardName) {
        ctx.beginPath()
        ctx.setGlobalAlpha(0);
        this.plainRoundRectColor(ctx, 92, 71, 48, 18, 9, "#FFFFFF", 1);
        ctx.fill();
        this.fillTextAlign(ctx, 116, 72, 16, 12, cardName, 'center')
      }



      //绘制赠送金
      if (goods.cardType == 1) {
        ctx.setFontSize(12);
        const SEND_AWARD_WIDTH = ctx.measureText(`赠${goods.cardGiftNum}元`).width;
        this.roundRectColor(ctx, 290 - SEND_AWARD_WIDTH, 151, SEND_AWARD_WIDTH + 10, 20, 10, "#FFFFFF");
        ctx.setFillStyle('#333333')
        this.fillTextAlign(ctx, 295 - SEND_AWARD_WIDTH / 2, 151, 20, 12, `赠${goods.cardGiftNum}元`, 'center');
      }



      //绘制卡片售价
      ctx.setFillStyle('#FFFFFF')
      this.fillTextAlign(ctx, 300, 173, 26, 22, `¥${goods.price}`, 'right');

      //写商品标题
      ctx.setTextAlign('left');
      ctx.setFontSize(16)
      ctx.setFillStyle('#333333');
      ctx.setGlobalAlpha(1);
      this.drawText(ctx, this.data.goods.goodsName, 30, 240, 100, 319)

      //写价格
      ctx.setFontSize(13);
      ctx.setFillStyle('#F52D56');
      ctx.fillText('¥', 30, 270);

      ctx.setFontSize(30);
      ctx.fillText(this.data.goods.price, 38, 278);

    }else{

      // 画商品图片
      ctx.drawImage(this.data.pics.thumb, 0, 0, 343, 343)

      //画已售背景
      this.roundRectColor(ctx,262,303,68,20,10,'#000',0.3);

      //写已售
      ctx.setFontSize(11)
      ctx.setFillStyle('#fff');
      ctx.setGlobalAlpha(1);
      ctx.fillText('已售 ' + this.data.goods.sellCount, 271, 317)

      //写商品标题
      ctx.setTextAlign('left');
      ctx.setFontSize(16)
      ctx.setFillStyle('#333333');
      ctx.setGlobalAlpha(1);
      this.drawText(ctx, goods.goodsName, 17, 374, 100, 190)

      //写价格
      ctx.setFontSize(13);
      ctx.setFillStyle('#F52D56');
      ctx.fillText('¥', 17, 450);

      ctx.setFontSize(30);
      ctx.fillText(this.data.goods.price, 25, 450);
    }

    

    //小程序葵花码
    // ctx.setFillStyle('#333333');
    ctx.drawImage(this.data.pics.qrCode, 227, 350, 100, 100);

    //绘制门店信息模块
    ctx.setFillStyle('#ffffff');
    ctx.setShadow(0, 0, 20, '#eeeeee');
    this.roundRectColor(ctx, 15, 483, 313, 112, 8, "#ffffff");
    ctx.setShadow(0, 0, 0, '#fff');

    //门店图
    ctx.setFillStyle('#333333');
    ctx.drawImage(this.data.pics.shopLogo, 27, 495, 88, 88)

    ctx.setFillStyle('#333333');
    ctx.setFontSize(14);
    this.drawSingleText(ctx, this.data.shopName, 123, 508, 170, 22);

    this.drawStar(ctx, this.data.shopScore);

    ctx.setFontSize(12);
    ctx.setFillStyle('#999999');
    this.fillDoubleText(ctx, this.data.address, 123, 555, 17, 189)

    // //画阴影边框
    // ctx.setFillStyle('#ffffff')
    // ctx.setShadow(0, 0, 10, '#eeeeee')
    // ctx.fillRect(16, 470, 313, 112)

    // ctx.setFillStyle('#ccc');
    // ctx.setShadow(0, 0, 0, '#fff')
    // ctx.drawImage(this.data.pics.shopLogo, 26, 482, 88, 88)

    // ctx.setFillStyle('#333333');
    // ctx.setFontSize(16);
    // this.drawSingleText(ctx,this.data.shopName,128,500,104,22)

    // ctx.setFillStyle('#999999');
    // ctx.setFontSize(12);
    // this.drawSingleText(ctx, this.data.address, 128, 552, 104, 22)

    // //画星星
    // this.drawStar(ctx);

    // ctx.setFillStyle('#F52D56');
    // ctx.setFontSize(12);
    // ctx.fillText('3.5分',198,527);

    // ctx.setFillStyle('#ccc');
    // ctx.fillRect(240, 490, 80, 80);
    // ctx.drawImage(this.data.pics.qrCode, 240, 490, 80, 80)

    ctx.draw(true,this.tempFile);
  },

  // 画星星
  drawStar(ctx, score = 5) {
    const c = this.corr

    const STAR_WIDTH = 12 // 星星宽度(等同高度)
    const X_BASE = 123 // 起始x坐标
    const SPACE = 4 // 星星间隙
    const Y = 524 // y坐标

    // 填充灰色背景
    ctx.setFillStyle('#dad9e2')
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(c(X_BASE + STAR_WIDTH * i + SPACE * i), Y, STAR_WIDTH, STAR_WIDTH)
    }

    // 根据员工平均分填充红色背景
    ctx.setFillStyle('#f52d56')
    for (let i = 0; i < score; i++) {
      if (score - i >= 1) {
        ctx.fillRect(c(X_BASE + STAR_WIDTH * i + SPACE * i), Y, STAR_WIDTH, STAR_WIDTH)
      } else {
        ctx.fillRect(c(X_BASE + STAR_WIDTH * i + SPACE * i), Y, STAR_WIDTH * (score - i), STAR_WIDTH)
      }
    }

    for (let i = 0; i < 5; i++) {
      ctx.drawImage('/images/button/star.png', c(X_BASE + STAR_WIDTH * i + SPACE * i), Y, STAR_WIDTH, STAR_WIDTH)
    }
  },


  drawRoundImage(ctx, x, y, r, imageUrl) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(imageUrl, x - r, y - r, 2 * r, 2 * r)
    ctx.restore()
  },

  plainRoundRectColor(ctx, x, y, w, h, r, color = '', opacity = '') {           //绘制镂空圆角矩形
    let rx = x + 1,
      ry = y + 1,
      rw = w - 2,
      rh = h - 2,
      rr = r - 1
    // ctx.save();
    if (w < 2 * r) {
      r = w / 2;
    }
    if (h < 2 * r) {
      r = h / 2;
    }
    ctx.beginPath();
    if (color) {
      ctx.setFillStyle(color);
      ctx.setStrokeStyle(color);
      ctx.setFillStyle(color);
    }

    ctx.setLineWidth(1);
    if (opacity) {
      ctx.setGlobalAlpha(opacity);
    }

    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();

    ctx.moveTo(rx + rr, ry);
    ctx.arcTo(rx, ry, rx, ry + rh, rr);
    ctx.arcTo(rx, ry + rh, rx + rw, ry + rh, rr);
    ctx.arcTo(rx + rw, ry + rh, rx + rw, ry, rr);
    ctx.arcTo(rx + rw, ry, rx, ry, rr);
    ctx.closePath();


    ctx.fill();
  },  

  /**
   * 绘制水平垂直居中文本
   */
  fillTextAlign(ctx, x = 0, y = 0, h = 0, fontsize = 12, text = '', textAlign = 'center') {
    ctx.beginPath();
    ctx.setGlobalAlpha(0);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + h);
    ctx.stroke();
    ctx.setGlobalAlpha(1);
    ctx.setFontSize(fontsize);
    ctx.setTextAlign(textAlign);
    ctx.fillText(text, x, y + h / 4 * 3);
    ctx.closePath;
  },  

  roundRectColor(ctx, x, y, w, h, r,color = '',opacity = '') {  //绘制圆角矩形（纯色填充）
    ctx.save();
    if (w < 2 * r) {
      r = w / 2;
    }
    if (h < 2 * r) {
      r = h / 2;
    }
    ctx.beginPath();
    if (color) {
      ctx.setFillStyle(color);
      ctx.setStrokeStyle(color);
      ctx.setFillStyle(color);
    }

    ctx.setLineWidth(1);
    if (opacity) {
      ctx.setGlobalAlpha(opacity);
    }
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.fill();
    ctx.closePath();
  },

  drawSingleText(ctx,str,x,y,width,height){
    let lineWidth = 0;
    for(let i = 0;i< str.length; i++){
      lineWidth += ctx.measureText(str[i]).width;
      if(lineWidth > width){
        ctx.fillText(str.substring(0, i) + '...', x, y); //绘制截取部分
        return;
      }
    };
    ctx.fillText(str,x,y)
  },

  /**
   * 绘制双行文本溢出
   */
  fillDoubleText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    var columnIndex = 0;   //行数
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        columnIndex++;
        if (columnIndex == 2) {
          ctx.fillText(str.substring(lastSubStrIndex, i - 3) + '...', leftWidth, initHeight);
          titleHeight += 30;
          return titleHeight;
        }
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 17; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },

  drawText: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 24; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },
  corr(number) {
    return number * 1
  },

  tempFile(){
    let that = this;
    wx.canvasToTempFilePath({
      width: 686,
      height: 1220,
      destWidth: 686,
      destHeight: 1220,
      canvasId: 'pic',
      success(res){
        that.data.tempFilePath = res.tempFilePath;
        that.setData({ tempFilePath: res.tempFilePath})
      }
    })
  },
  saveImg() {
    let that = this;
    // 获取用户是否开启用户授权相册
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: that.data.tempFilePath,
                success() {
                  wx.showToast({
                    title: '保存成功'
                  })
                },
                fail() {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              })
            },
            fail() {
              // 如果用户拒绝过或没有授权，则再次打开授权窗口
              //（ps：微信api又改了现在只能通过button才能打开授权设置，以前通过openSet就可打开，下面有打开授权的button弹窗代码）
              that.setData({
                openSet: true
              })
            }
          })
        } else {
          // 有则直接保存
          wx.saveImageToPhotosAlbum({
            filePath: that.data.tempFilePath,
            success() {
              wx.showToast({
                title: '保存成功'
              })
            },
            fail() {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  }
})

