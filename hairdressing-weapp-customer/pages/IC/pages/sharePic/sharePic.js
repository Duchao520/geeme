// pages/IC/pages/sharePic/sharePic.js
const apiAction = require('../../../../utils/apiAction.js')
const util = require('../../../../utils/util.js')
const app = getApp()
Page({
  $name:'sharePic',
  data: {
    type: null,
    info: null,
    productImage: null, // 下载到本地的商品图片
    qrcodeImage: null, // 下载到本地的小程序码
    brandName: '', // 品牌名字
  },
  onLoad(options) {
    wx.showLoading()
    const {
      info,
      type
    } = this.$take('pic')
    if (info.city.endsWith('市')) {
      info.city = info.city.slice(0, -1)
    }
    info.score = info.score === 0 ? 5 : info.score
    // 生成小程序码
    const page = 'pages/IC/pages/productdetails/productdetails'
    let scene = `productId=${info.goodsId}`
    if (type == 'goods') {
      scene += '&isProduct=1'
    }
    apiAction.commonQrCode(page, scene).then(data => {
      info.qrcode = data.fileKey
      this.render(info)
    })
  },
  // 渲染wxml
  render(info) {
    app.getBrand(brand => {
      wx.hideLoading()
      this.$setData({
        brandName: brand.name,
        info
      })
    })
  },
  // 保存画报
  savePic() {
    wx.$showLoading()
    const info = this.data.info
    const promise1 = new Promise(resolve => {
      // 下载小程序码图片到本地
      wx.getImageInfo({
        src: util.getImageUrl(info.qrcode),
        success: res => {
          this.data.qrcodeImage = res.path
          resolve()
        },
      })
    })
    const promise2 = new Promise(resolve => {
      // 下载商品图片到本地
      wx.getImageInfo({
        src: util.getImageUrl(info.image),
        success: res => {
          this.data.productImage = res.path
          resolve()
        },
      })
    })
    Promise.all([promise1, promise2]).then(this.drawCanvas)
  },
  // 绘画canvas
  drawCanvas() {
    this.ratio = 1
    const c = this.corr
    const ctx = wx.createCanvasContext('canvas')
    // 填充白色背景
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, c(305), c(530))
    // 画商品图片
    ctx.drawImage(this.data.productImage, c(8), c(9), c(289), c(288))
    // 画星星
    this.drawStar(ctx)
    // 填充商品信息
    this.fillText(ctx)
    // 绘制小程序码
    ctx.drawImage(this.data.qrcodeImage, c(195), c(405), c(90), c(90))
    // 绘制“长按识别二维码”
    ctx.setFontSize(c(12))
    ctx.setFillStyle('#999')
    ctx.fillText('长按识别二维码', c(193), c(510))
    // 绘画
    ctx.draw(false, () => {
      wx.canvasToTempFilePath({
        canvasId: 'canvas',
        success: res => {
          wx.hideLoading()
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({
                title: '保存成功',
              })
            }
          })
        }
      })
    })
  },
  // 画星星
  drawStar(ctx) {
    const c = this.corr

    const STAR_WIDTH = 15 // 星星宽度(等同高度)
    const X_BASE = 20 // 起始x坐标
    const SPACE = 8 // 星星间隙
    const Y = 316 // y坐标

    // 填充灰色背景
    ctx.setFillStyle('#dad9e2')
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(c(X_BASE + STAR_WIDTH * i + SPACE * i), Y, STAR_WIDTH, STAR_WIDTH)
    }

    // 根据员工平均分填充红色背景
    ctx.setFillStyle('#f52d56')
    let score = this.data.info.score
    for (let i = 0; i < score; i++) {
      if (score - i >= 1) {
        ctx.fillRect(c(X_BASE + STAR_WIDTH * i + SPACE * i), Y, STAR_WIDTH, STAR_WIDTH)
      } else {
        ctx.fillRect(c(X_BASE + STAR_WIDTH * i + SPACE * i), Y, STAR_WIDTH * (score - i), STAR_WIDTH)
      }
    }

    for (let i = 0; i < 5; i++) {
      ctx.drawImage('star.png', c(X_BASE + STAR_WIDTH * i + SPACE * i), Y, STAR_WIDTH, STAR_WIDTH)
    }
  },
  // 填充商品title
  fillText(ctx) {
    const c = this.corr
    const TEXT_RECT_WIDTH = 260
    const X = 20

    ctx.setFillStyle('#484848')
    ctx.setFontSize(c(14))

    // 填充title
    const title = this.data.info.title
    let Y = 357
    // 判断是否需要换行
    let text_width = 0;
    let rows = 1;
    let text = '';
    for (const v of title) {
      text_width += ctx.measureText(v).width
      if (text_width >= c(TEXT_RECT_WIDTH)) {
        ctx.fillText(text, c(X), c(Y), c(TEXT_RECT_WIDTH))
        text_width = ctx.measureText(v).width
        text = v
        rows++
        Y = 375
        if (rows === 3) {
          break
        }
      } else {
        text += v
      }
    }
    // 最后根据rows判断是否还有text未填充
    if (rows <= 2) {
      ctx.fillText(text, c(X), c(Y), c(TEXT_RECT_WIDTH))
    }

    // 填充价格
    ctx.setFontSize(c(12))
    ctx.setFillStyle('#f52d56')
    ctx.fillText('¥', c(X), c(410))
    ctx.setFontSize(c(16))
    ctx.fillText(this.data.info.price, c(28), c(410))

    // 填充地址
    ctx.drawImage('address.png', c(X), c(425), c(9), c(12))
    ctx.setFontSize(c(12))
    ctx.setFillStyle('#999')
    ctx.fillText(this.data.brandName, c(31), c(435), c(150))
    ctx.fillText(this.data.info.city + this.data.info.shopName, c(31), c(452), c(150))
  },
  // 获取正确比例的数字
  corr(number) {
    return number * this.ratio
  },
})