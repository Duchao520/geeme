var apiAction = null, util = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ctx: null,
    shopName: null,
    shopScore: 5,
    address: null,
    tempFilePath: null,
    card: null,
    brandLogoKey: null,
    shopImgKey: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    this.data.sellerId = options.sellerId;
    this.data.card = wx.$take('card');
    this.data.userInfo = wx.$take('userInfo');
    this.data.ctx = wx.createCanvasContext('pic');
    this.downLoad()
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    apiAction = null;
    util = null;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  getBrand(){
    return new Promise(resolve => {
      app.getBrand((brand) => {
        resolve({brand})
      })
    })
    
  },

  downLoad() {

    this.getShopInfo().then(res => {
      this.data.brandLogoKey = res.brandLogoKey;
      this.data.shopImgKey= res.shopImgKey;
      this.data.shopName= res.shopName;
      this.data.shopScore= res.shopScore;
      this.data.address = res.address;

      this.downImg()
    })
    // app.getShopInfo(this.getShopInfo)
  },

  getShopInfo(){
    let {card} = this.data;
    let storeId, storeIdList = [];
    if (card.cardKindInfo.suitStore){
      storeIdList = card.cardKindInfo.suitStore.storeIdList;
    }
    if(storeIdList && storeIdList.length > 0){
      storeId = storeIdList[0].storeId;
    }else{
      storeId = wx.$getStorage('storeId');
    }
    return apiAction.getShopInfo(storeId).then(res => {
      return {
        brandLogoKey: res.brandLogo,
        shopImgKey: res.shopImg,
        shopName: res.shopName,
        shopScore: res.shopScore,
        address: res.address
      }
    })
  },
  

  downImg() {
    let { card, brandLogoKey, shopImgKey} = this.data,
      cardCover = card.cardKindInfo.cardCover
    wx.showLoading({
      title: '生成中',
    })
    return this.getQR().then(qrImg => {
      const promise1 = new Promise(resolve => {
        // 下载小程序码图片到本地
        wx.getImageInfo({
          src: util.getImageUrl(qrImg),
          success: res => {
            resolve({ qrCode: res.path })
          },
        })
      })
      const promise2 = new Promise(resolve => {
        // 下载卡片背景图到本地
        wx.getImageInfo({
          src: util.getImageUrl(cardCover),
          success: res => {
            resolve({ cardCover: res.path })
          },
        })
      })
      const promise3 = new Promise(resolve => {
        // 下载品牌logo图片到本地
        wx.getImageInfo({
          src: util.getImageUrl(brandLogoKey + '?x-oss-process=image/resize,m_fill,h_84,w_84' ),
          success: res => {
            resolve({ brandLogo: res.path})
          },
        })
      })
      const promise4 = new Promise(resolve => {
        // 下载品牌logo图片到本地
        wx.getImageInfo({
          src: util.getImageUrl(shopImgKey + '?x-oss-process=image/resize,m_fill,h_176,w_176' ),
          success: res => {
            resolve({ shopImg: res.path })
          },
        })
      })
      util.PromiseAll([promise1,promise2, promise3,promise4]).then(res => {
        this.data.pics = res;
        this.drawPic();
      })
    })
  },

  getQR() {
    let page, scene,{card,userInfo} = this.data,
      activityId = card.id,
      cardKindId = card.cardKindInfo.id,
      parentBrandCustomerId = userInfo.brandCustomerId,
      dateObj = new Date(),
      shareTime = Date.parse(dateObj) / 1000,
      splitTimes = card.shareInfo.splitTimes;
      
    page = 'pages/UIC/pages/ShareGiftCard/ShareGiftCard'
    scene = `${card.id},${cardKindId},${parentBrandCustomerId},${splitTimes},${shareTime}`
    console.log(page)
    console.log(scene)
    return apiAction.commonQrCode(page, scene,3600).then(data => {
      if (data.success) {
        return data.fileKey;
      }
    })
  },

  drawPic() {
    let { ctx,pics,card } = this.data;
    //填充白色背景
    ctx.setFillStyle('#fff');
    ctx.fillRect(0, 0, 343, 610);

    //画阴影边框
    ctx.setFillStyle('#ffffff')
    ctx.setShadow(0, 0, 10, '#AEB8E5')
    // 画商品图片
    ctx.drawImage(pics.cardCover, 28, 30, 283, 180)
    
    ctx.setShadow(0, 0, 0, '#fff')
    
    //画logo
    console.log(pics.brandLogo)
    this.drawRoundImage(ctx, 64, 65, 21, pics.brandLogo);
    ctx.setGlobalAlpha(1);
    
    

    //写卡名称
    ctx.setFontSize(18)
    ctx.setFillStyle('#fff');
    ctx.setGlobalAlpha(1);
    ctx.fillText(card.giftCardName, 92, 60)

    //画标签
    let cardName = '';
    switch(card.cardType){
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
    if(cardName){
      ctx.beginPath()
      ctx.setGlobalAlpha(0);
      this.plainRoundRectColor(ctx, 92, 71, 48, 18, 9, "#FFFFFF", 1);
      ctx.fill();
      this.fillTextAlign(ctx, 116, 72, 16, 12, cardName, 'center')
    }
    


    //绘制赠送金
    if (card.cardType == 1){
      ctx.setFontSize(12);
      const SEND_AWARD_WIDTH = ctx.measureText(`赠${card.cardKindInfo.cardGiftNum}元`).width;
      this.roundRectColor(ctx, 290 - SEND_AWARD_WIDTH, 151, SEND_AWARD_WIDTH + 10, 20, 10, "#FFFFFF");
      ctx.setFillStyle('#333333')
      this.fillTextAlign(ctx, 295 - SEND_AWARD_WIDTH / 2, 151, 20, 12, `赠${card.cardKindInfo.cardGiftNum}元`, 'center');
    }
    
    

    //绘制卡片售价
    ctx.setFillStyle('#FFFFFF')
    this.fillTextAlign(ctx, 300, 173, 26, 22, `¥${card.cardPrice}`, 'right');

    //卡片绘制完成，开始详情部分
    //礼品卡名称
    ctx.beginPath();
    ctx.setFillStyle('#484848');
    ctx.setFontSize(18);
    ctx.setTextAlign('left');
    ctx.fillText(card.giftCardName,30,247);

    //绘制礼品卡logo
    const CARD_NAME_WIDTH = ctx.measureText(card.giftCardName).width;
    ctx.drawImage('/images/button/gift_logo.png', 36 + CARD_NAME_WIDTH , 232,47 , 20)

    //享受权益
    let equity = '';
    if (card.cardKindInfo.totalCountLimit >= 0){
      equity = `所有服务${card.cardKindInfo.totalCountLimit}次`
    }else{
      if (card.cardKindInfo.listServiceCountInfo.length > 1){
        equity = `${card.cardKindInfo.listServiceCountInfo[1].serviceName} ${card.cardKindInfo.listServiceCountInfo[1].countLimit || '无限'}次`
      }else{
        equity = `${card.cardKindInfo.listServiceCountInfo[0].serviceName} ${card.cardKindInfo.listServiceCountInfo[0].countLimit || '无限'}次`
      }
    }
    ctx.setFillStyle('#999999');
    ctx.setFontSize(12);
    ctx.fillText('享受权益：',30,275);
    ctx.setFillStyle('#484848');
    ctx.fillText(equity,91,275);

    //已售数量
    ctx.setFillStyle('#999999');
    ctx.setFontSize(12);
    ctx.fillText('已售数量：', 30, 297);
    ctx.setFillStyle('#484848');
    ctx.fillText(`${card.getNum}张`, 91, 297);

    //门店价，优惠价
    let cardDiscountPrice = ''
    if(card.free){
      ctx.setFillStyle('#F52D56');
      ctx.setFontSize(12);
      ctx.fillText('¥', 30, 330);
      ctx.setFontSize(24);
      ctx.fillText('0', 40, 330);
      cardDiscountPrice = '0'
    }else{
      ctx.setFillStyle('#F52D56');
      ctx.setFontSize(12);
      ctx.fillText('¥', 30, 330);
      ctx.setFontSize(24);
      ctx.fillText(card.activityPrice, 40, 330);
      cardDiscountPrice = card.activityPrice;
    }
    

    const DISCOUNT_PRICE_WIDTH = ctx.measureText(cardDiscountPrice).width;
    ctx.setFontSize(12);
    ctx.setFillStyle('#999999');
    ctx.fillText(`¥${card.cardPrice}`,42 + DISCOUNT_PRICE_WIDTH,330);
    const STORE_PRICE_WIDTH = ctx.measureText(`¥${card.cardPrice}`).width;
    ctx.beginPath();
    ctx.setStrokeStyle('#999999');
    ctx.moveTo(41 + DISCOUNT_PRICE_WIDTH,326);
    ctx.lineTo(43 + DISCOUNT_PRICE_WIDTH + STORE_PRICE_WIDTH, 326);
    ctx.stroke();
    ctx.closePath();

    //小程序葵花码
    // ctx.setFillStyle('#333333');
    ctx.drawImage(pics.qrCode,227,350,100,100);

    //绘制门店信息模块
    ctx.setFillStyle('#ffffff');
    ctx.setShadow(0, 0, 20, '#eeeeee');
    this.roundRectColor(ctx, 15, 483, 313, 112, 8, "#ffffff");
    ctx.setShadow(0, 0, 0, '#fff');

    //门店图
    ctx.setFillStyle('#333333');
    ctx.drawImage(pics.shopImg, 27, 495, 88, 88)

    ctx.setFillStyle('#333333');
    ctx.setFontSize(14);
    this.drawSingleText(ctx,this.data.shopName, 123, 508, 170, 22);

    this.drawStar(ctx,this.data.shopScore);

    ctx.setFontSize(12);
    ctx.setFillStyle('#999999');
    this.fillDoubleText(ctx,this.data.address,123,555,17,189)
    
    ctx.draw(true, this.tempFile);

    
  },

  /**
   * 绘制水平垂直居中文本
   */
  fillTextAlign(ctx,x = 0,y = 0,h = 0,fontsize = 12,text = '',textAlign = 'center'){
    ctx.beginPath();
    ctx.setGlobalAlpha(0);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y+h);
    ctx.stroke();
    ctx.setGlobalAlpha(1);
    ctx.setFontSize(fontsize);
    ctx.setTextAlign(textAlign);
    ctx.fillText(text, x, y + h/4 * 3);
    ctx.closePath;
  },

  // 画星星
  drawStar(ctx,score = 5) {
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

  roundRectColor(ctx, x, y, w, h, r, color = '', opacity = '') {  //绘制圆角矩形（纯色填充）
    ctx.save();
    if (w < 2 * r) {
      r = w / 2;
    }
    if (h < 2 * r) {
      r = h / 2;
    }
    ctx.beginPath();
    if(color){
      ctx.setFillStyle(color);
      ctx.setStrokeStyle(color);
      ctx.setFillStyle(color);
    }
    
    ctx.setLineWidth(1);
    if (opacity){
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
    ctx.arcTo(rx, ry, rx, ry+rh , rr);
    ctx.arcTo(rx, ry+rh, rx+rw, ry+rh ,rr);
    ctx.arcTo(rx+rw,ry+rh, rx+rw, ry , rr);
    ctx.arcTo(rx + rw, ry ,rx, ry,rr);
    ctx.closePath();

  
    ctx.fill();
  },     

  drawRoundImage(ctx,x,y,r,imageUrl){
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, r,0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(imageUrl, x-r, y-r , 2*r, 2*r)
    ctx.restore()
  },

  drawSingleText(ctx, str, x, y, width, height) {
    let lineWidth = 0;
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > width) {
        ctx.fillText(str.substring(0, i) + '...', x, y); //绘制截取部分
        return;
      }
    };
    ctx.fillText(str, x, y)
  },
  
  /**
   * 绘制双行文本溢出
   */
  fillDoubleText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth){
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    var columnIndex = 0;   //行数
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        columnIndex++;
        if(columnIndex == 2){
          ctx.fillText(str.substring(lastSubStrIndex, i-3) + '...', leftWidth, initHeight);
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

  tempFile() {
    let that = this;
    wx.canvasToTempFilePath({
      width: 686,
      height: 1220,
      destWidth: 343,
      destHeight: 610,
      canvasId: 'pic',
      success(res) {
        wx.hideLoading();
        that.data.tempFilePath = res.tempFilePath;
        that.setData({ tempFilePath: res.tempFilePath })
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

