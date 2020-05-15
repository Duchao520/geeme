// pages/UIC/pages/appointmentCode/appointmentCode.js
const app = getApp()
const fetch = require('../../../../utils/fetch.js')
const config = require('../../../../config/index.js')
const util = require('../../../../utils/util.js')
const myUtil = require('../../../../utils/myUtil.js')
Page({
  data: {
    userId:null,
    nickName:null,
    headPortrait:null,
    qrcode:null,
    storeInfo:null,
    success:false,
    picInfo:null,   // 画报信息
    picHeadPortrait:null,  // 画报-本地头像
    picPhotos:null,   // 画报-动态主图列表
    picQrcode:null,  // 画报-本地小程序码
  },
  onLoad(options) {
    this.$setData({
      storeInfo: wx.$getStorage('storeInfo')
    })
    wx.showLoading()
    app.getUserInfo( userInfo => {
      const {nickName, headPortrait, userId} = userInfo
      fetch.getAppointmentQrCode().then(data => {
        wx.hideLoading()
        this.$setData({
          nickName,
          headPortrait,
          userId,
          qrcode: data.success ? config.ImageUrl + data.fileKey : null, // 加上config.ImageUrl下载到本地
          success:data.success
        })
      })
    })
  },
  // 保存预约码
  save(){
    wx.downloadFile({
      url:this.data.qrcode,
      success(res){
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(){
            wx.showToast({
              title: '保存成功',
            })
          }
        })
      }
    })
  },
  // 初始化画报
  initPic(){
    wx.$showLoading()
    this.ratio = 1
    fetch.weGetStaffInfoForShare().then( data => {
      this.$setData({
        picInfo:data
      })
      // 获取头像信息
      const promise1 = new Promise( resolve => {
        wx.getImageInfo({
          src: util.getImageUrl(data.image),
          success:res => {
            this.data.picHeadPortrait = res
            resolve()
          }
        })
      })
      // 下载小程序码到本地
      const promise2 = new Promise( resolve => {
        wx.getImageInfo({
          src: util.getImageUrl(this.data.qrcode),
          success: res => {
            this.data.picQrcode = res
            resolve()
          }
        })
      })
      // 下载动态组图们
      const promises = [promise1, promise2]
      this.data.picPhotos = []
      for (const v of data.showPhotos) {
        promises.push( new Promise(resolve => {
          wx.getImageInfo({
            src: util.getImageUrl(v),
            success: res => {
              this.data.picPhotos.push(res)
              resolve()
            }
          })
        }))
      }
      Promise.all(promises).then(this.drawCanvas)
    })
  },
  // 绘画canvas主函数
  drawCanvas(res){
    const c = this.corr
    const ctx = wx.createCanvasContext('canvas')
    // 填充白色背景
    ctx.setFillStyle('white')
    ctx.fillRect(0,0,c(375), c(667))
    // 绘制圆角矩形
    this.drawRoundRect(ctx)
    // 头像
    this.drawHeadPortrait(ctx)
    // 员工信息
    this.drawStaffInfo(ctx)
    // 动态主图列表
    this.drawPhotos(ctx)
    // 擅长标签
    this.drawSkills(ctx)
    // 签名
    ctx.setFillStyle('#666')
    ctx.setFontSize(c(14))
    ctx.setTextAlign('left')
    ctx.fillText(this.data.picInfo.sign || '', c(16), c(498), c(343))
    // 小程序码及提示文字
    this.drawQrcode(ctx)
    // 最终渲染
    ctx.draw(false, () => {
      wx.canvasToTempFilePath({
        canvasId: 'canvas',
        success: res => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.$hideLoading()
              wx.showToast({
                title: '保存成功',
              })
            }
          })
        }
      })
    })
  },
  // 绘制圆角矩形
  drawRoundRect(ctx){
    const c = this.corr

    myUtil.drawRoundRect(c(17), c(136), c(342), c(166), c(8), ctx)
    ctx.setShadow(0, 0, c(10), 'rgba(174, 184, 229, 0.3)')
    ctx.setFillStyle('white')
    ctx.fill()
    ctx.setShadow(0, 0, 0, '#fff')
  },
  // 绘制头像
  drawHeadPortrait(ctx){
    const c = this.corr

    ctx.save()
    ctx.beginPath()
    ctx.arc(c(188), c(110), c(65), 0, 2 * Math.PI)
    ctx.clip()
    const info = this.data.picHeadPortrait
    const { sx, sy, sWidth, sHeight } = myUtil.drawCoverImg(c(130), c(130), info.width, info.height)
    ctx.drawImage(info.path, sx, sy, sWidth, sHeight, c(123), c(45), c(130), c(130))
    ctx.restore()
  },
  // 绘制员工信息
  drawStaffInfo(ctx){
    const c = this.corr
    const info = this.data.picInfo

    // 昵称
    ctx.setFontSize(c(17))
    ctx.setFillStyle('#263238')
    ctx.setTextAlign('right')
    ctx.fillText(info.nickName, c(185), c(200))
    // 职位
    ctx.setFontSize(c(12))
    ctx.setFillStyle('#333')
    ctx.setTextAlign('left')
    ctx.fillText(info.levelName, c(190), c(200))
    // 品牌、店名
    if(info.storeCity.indexOf('市') == info.storeCity.length - 1){
      info.storeCity = info.storeCity.substring(0, info.storeCity.length - 1)
    }
    ctx.setFontSize(c(12))
    ctx.setFillStyle('#999')
    ctx.setTextAlign('center')
    const str = info.brandName + '  ' + info.storeCity + info.storeName
    ctx.fillText(str, c(187.5), c(230), c(342))
    const strWidth = ctx.measureText(str).width
    ctx.drawImage('address.png', c(187.5 - strWidth / 2 - 12), c(219), c(9), c(13))
    // 星星、分数
    this.drawStar(ctx)
    // 预约、作品、评价
    const width = ctx.measureText('预约').width
    ctx.setFillStyle('#333')
    ctx.fillText('预约', c(99), c(280))
    ctx.fillText('作品', c(165), c(280))
    ctx.fillText('评价', c(233), c(280))
    ctx.setFillStyle('#999')
    ctx.fillText(info.appointmentCount, c(99 + width), c(280))
    ctx.fillText(info.workCount, c(165 + width), c(280))
    ctx.fillText(info.assessmentCount, c(233 + width), c(280))
  },
  // 画星星
  drawStar(ctx){
    const c = this.corr

    const STAR_WIDTH = 13
    const X_BASE = 113
    const SPACE = 4
    const Y = 244

    // 填充灰色背景
    ctx.setFillStyle('#dad9e2')
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(c(X_BASE + STAR_WIDTH * i + SPACE * i), Y, STAR_WIDTH, STAR_WIDTH)
    }

    // 根据员工平均分填充红色背景
    ctx.setFillStyle('#f52d56')
    let score = this.data.picInfo.score
    for (let i = 0; i < score; i++){
      if (score - i >= 1){
        ctx.fillRect(c(X_BASE + STAR_WIDTH * i + SPACE * i), Y, STAR_WIDTH, STAR_WIDTH)
      }else{
        ctx.fillRect(c(X_BASE + STAR_WIDTH * i + SPACE * i), Y, STAR_WIDTH * (score - i), STAR_WIDTH)
      }
    }

    for(let i=0; i < 5; i++){
      ctx.drawImage('star.png', c(X_BASE + STAR_WIDTH * i + SPACE * i), Y, STAR_WIDTH, STAR_WIDTH)
    }
    // 保留digits位小数
    var fixNum = function (num, digits) {
      if (num == 0) return num
      if (!num) return
      return Number(num).toFixed(digits)
    }
    ctx.fillText(fixNum(score, 1) + '分', c(215), c(256))
  },
  // 绘制动态主图
  drawPhotos(ctx){
    const c = this.corr

    const SPACE = 3
    const WIDTH = 66
    const X_BASE = 16
    const Y = 324
    const RADIUS = 4

    const photos = this.data.picPhotos
    for (let i = 0; i < photos.length; i++){
      ctx.save()
      myUtil.drawRoundRect(c(X_BASE + WIDTH * i + SPACE * i), c(Y), c(WIDTH), c(WIDTH), c(RADIUS), ctx)
      ctx.clip()
      const { sx, sy, sWidth, sHeight } = myUtil.drawCoverImg(c(WIDTH), c(WIDTH), c(photos[i].width), c(photos[i].height))
      ctx.drawImage(photos[i].path, sx, sy, sWidth, sHeight, c(X_BASE + WIDTH * i + SPACE * i), c(Y), c(WIDTH), c(WIDTH))
      ctx.restore()
    }
  },
  // 绘制擅长标签
  drawSkills(ctx){
    const skills = this.data.picInfo.skills
    if(!skills || !skills.length) return
    const c = this.corr

    const X_BASE = 6
    const Y_BASE = 410
    const PADDING = 16
    const PADDING_2 = PADDING * 2
    const SPACE = 10
    const HEIGHT = 22
    const MAX_WIDTH = 375 - 16 * 2 + 10 // X_BASE为了方便计算向左移动了10，所以这里加10

    ctx.setStrokeStyle('#ebebeb')
    ctx.setFillStyle('#5a5a5a')
    ctx.setTextAlign('center')
    ctx.setLineWidth(1)
    let width_total = 0, rows = 1, y = Y_BASE
    let width_text, x
    for(let i=0; i<skills.length; i++){
      width_text = ctx.measureText(skills[i]).width
      if ((width_total + PADDING_2 + width_text + SPACE) > MAX_WIDTH){
        rows++
        if(rows > 2) return
        width_total = 0
        y += 32
      }
      x = X_BASE + SPACE + width_total
      myUtil.drawRoundRect(c(x), c(y), c(width_text + PADDING_2), c(HEIGHT), c(HEIGHT / 2), ctx)
      ctx.stroke()
      ctx.fillText(skills[i], c(x + PADDING + width_text / 2), c(y + 12 + 4))
      width_total += (PADDING_2 + width_text + SPACE)
    }
  },
  // 绘制预约码及提示文字
  drawQrcode(ctx){
    const c = this.corr

    ctx.drawImage(this.data.picQrcode.path, c(31), c(529), c(110), c(110))
    ctx.setFillStyle('#999')
    ctx.setFontSize(c(14))
    ctx.fillText('长按扫码，', c(151), c(575))
    ctx.fillText('快速预约我的服务', c(151), c(600))
  },
  // 调整比例，高清绘制(?)
  corr(number) {
    return number * this.ratio
  },
})