// pages/SC/hairdetails/hairdetails.js
const util = require('../../../../utils/util.js');
const myUtil = require('../../../../utils/myUtil.js')
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    tabList: ["简介", "作品", "评价", "相册"],
    show: 0,
    isFixed: false,
    // 具体参数
    shopId: 0,
    hairId: 0,
    userId: 0,
    // 发型师信息数据结构
    staffInfo: {},
    //服务数据结构
    likeList: [],
    // 作品信息
    worksInfo: {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      flag: false,
    },
    // 评价信息
    assessmentInfo: {
      avgScore: 0,
      list: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tags: [],
      tagId: -2, //当前选中的tag的id,
      flag: false,
      ifShowDefault: false,
    },
    scrollTop: null,
    isFixed: false,
  },
  onLoad(options) {
    if (options.scene) {
      const obj = util.sceneToJson(options.scene)
      this.data.hairId = obj.staffId
    } else {
      this.data.hairId = options.hairId
      this.brandId = options.brandId
    }

    if (options.tabIndex) {
      const tabIndex = Number(options.tabIndex)
      this.$setData({
        show: tabIndex
      })
    }
    this.$setData({
      isSelf:wx.$getStorage('staffId') == this.data.hairId
    })
    this.getStaffInfo(this.data.hairId)
  },
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  changeFix(e) {
    this.setData({
      isFixed: e.detail
    })
  },
  // 获取服务者详情
  getStaffInfo(hairId) {
    this.$post('/customer/getWeStaffDetail', {staffId:hairId, brandId:this.brandId}).then( data => {
      this.setData({
        staffInfo: data
      })
      this.data.userId = data.userId
      // 若初始tabIndex不等于0，则请求对应接口
      if (this.data.show != 0) {
        this.switchTab(null, this.data.show)
      }
    })
  },
  // 切换tab
  switchTab(e, tabIndex) {
    let index = e ? e.detail.index : tabIndex
    let staffInfo = this.data.staffInfo;
    this.setData({
      show: index
    })
    switch (index) {
        // 作品
      case 1:
        if (!this.data.worksInfo.list.length) {
          this.getDynamic4StaffHomePage()
        }
        break;
        // 评价
      case 2:
        if (!this.data.assessmentInfo.list.length) {
          this.getAssessmentList()
          this.getAssessmentTags()
        }
        break;
    }
  },

  // 获取作品
  getDynamic4StaffHomePage() {
    const params = {
      currentPage: this.data.worksInfo.currentPage,
      pageSize: this.data.worksInfo.pageSize,
      userId: this.data.userId,
      brandId:this.brandId
    }
    this.$post('/weGetDynamic4StaffHomePage', params).then( data => {
      this.setData({
        'worksInfo.list': data.weSimpleDynamicList ? this.data.worksInfo.list.concat(data.weSimpleDynamicList) : this.data.worksInfo.list,
        'worksInfo.total': data.total,
        'worksInfo.flag': false
      })
    })
  },

  // 获取评价列表
  getAssessmentList() {
    const {
      pageNum,
      pageSize,
      tagId
    } = this.data.assessmentInfo
    const params = {
      pageNum,
      pageSize,
      tagId,
      serverId: this.data.hairId,
      serverUserId: this.data.userId
    }
    // 评价列表
    wx.$showLoading()
    this.$post('/weGetStaffAssessmentList4StaffHomePage', params).then(data => {
      wx.$hideLoading()
      if (data.total == 0) {
        this.$setData({
          'assessmentInfo.ifShowDefault': true
        })
      } else {
        let list = pageNum == 1 ? data.staffAssessmentList : this.data.assessmentInfo.list.concat(data.staffAssessmentList)
        this.$setData({
          'assessmentInfo.list': list,
          'assessmentInfo.avgScore': data.avgScore,
          'assessmentInfo.total': data.total,
          'assessmentInfo.ifShowDefault': false
        })
      }
      this.data.assessmentInfo.flag = false
    })
  },

  // 获取评价标签统计
  getAssessmentTags() {
    this.$post('/weGetStaffAssessmentTagCount', {serverUserId:this.data.userId}).then( data => {
      if (data.tagCounts[0].num == 0) {
        this.$setData({
          'assessmentInfo.ifShowDefault': true
        })
      } else {
        this.$setData({
          'assessmentInfo.tags': data.tagCounts
        })
      }
    })
  },

  // 切换当前评价tagId
  changeTagId(e) {
    this.$setData({
      'assessmentInfo.tagId': e.currentTarget.dataset.id,
      'assessmentInfo.pageNum': 1,
      'assessmentInfo.list': []
    })
    this.getAssessmentList()
  },

  /**
   * 点击服务事件
   */
  clickGetLike(e) {
    wx.navigateTo({
      url: '/pages/IC/pages/productdetails/productdetails?productId=' + e.detail
    })
  },

  /**
   * 添加预约
   */
  addAppointment(e) {
    wx.removeStorageSync('appointment')
    let staffId = this.data.staffInfo.id;
    let storeId = this.data.staffInfo.shopId;
    if (util.addhair(staffId, storeId)) {
      this.$route('/pages/TC/pages/choosetime/choosetime')
    }
  },
  // 关注
  follow() {
    wx.$showLoading()
    const {
      focus,
      userId
    } = this.data.staffInfo
    const params = {
      attentive: !focus,
      beAttentiveUserId: userId
    }
    fetch.weStaffDynamicAttentive(params).then(data => {
      wx.$hideLoading()
      if (data.success) {
        this.$setData({
          'staffInfo.focus': !focus
        })
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  onReachBottom() {
    let info
    switch (this.data.show) {
      case 1:
        info = this.data.worksInfo
        if (info.currentPage * info.pageSize >= info.total) {
          return
        }
        if (info.flag) return
        info.flag = true
        info.currentPage++;
        this.getDynamic4StaffHomePage()
        break;
      case 2:
        info = this.data.assessmentInfo
        if (info.pageNum * info.pageSize >= info.total) {
          return
        }
        if (info.flag) return
        info.flag = true
        info.pageNum++;
        this.getAssessmentList()
        break;
    }
  },
  // 初始化画报
  initPic() {
    wx.$showLoading()
    this.ratio = 1

    const info = this.data.staffInfo
    // 获取头像信息
    const promise1 = new Promise(resolve => {
      wx.getImageInfo({
        src: util.getImageUrl(info.avatar),
        success: res => {
          this.data.picHeadPortrait = res
          resolve()
        }
      })
    })
    // 下载小程序码到本地
    const promise2 = new Promise(resolve => {
      const page = 'pages/SC/pages/hairdetails/hairdetails'  // 跳转的服务版的页面
      const scene = `staffId=${info.id}`
      apiAction.commonQrCode(page, scene).then(data => {
        wx.getImageInfo({
          src: util.getImageUrl(data.fileKey),
          success: res => {
            this.data.picQrcode = res
            resolve()
          }
        })
      })
    })
    // 下载动态主图们
    const promises = [promise1, promise2]
    this.data.picPhotos = []
    for (const v of info.showPhotos) {
      promises.push(new Promise(resolve => {
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
  },
  // 绘画canvas主函数
  drawCanvas(res) {
    const c = this.corr
    const ctx = wx.createCanvasContext('canvas')
    // 填充白色背景
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, c(375), c(667))
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
    ctx.fillText(this.data.staffInfo.sign || '', c(16), c(498), c(343))
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
  drawRoundRect(ctx) {
    const c = this.corr

    myUtil.drawRoundRect(c(17), c(136), c(342), c(166), c(8), ctx)
    ctx.setShadow(0, 0, c(10), 'rgba(174, 184, 229, 0.3)')
    ctx.setFillStyle('white')
    ctx.fill()
    ctx.setShadow(0, 0, 0, '#fff')
  },
  // 绘制头像
  drawHeadPortrait(ctx) {
    const c = this.corr

    ctx.save()
    ctx.beginPath()
    ctx.arc(c(188), c(110), c(65), 0, 2 * Math.PI)
    ctx.clip()
    const info = this.data.picHeadPortrait
    const {
      sx,
      sy,
      sWidth,
      sHeight
    } = myUtil.drawCoverImg(c(130), c(130), info.width, info.height)
    ctx.drawImage(info.path, sx, sy, sWidth, sHeight, c(123), c(45), c(130), c(130))
    ctx.restore()
  },
  // 绘制员工信息
  drawStaffInfo(ctx) {
    const c = this.corr
    const info = this.data.staffInfo

    // 昵称
    ctx.setFontSize(c(17))
    ctx.setFillStyle('#263238')
    ctx.setTextAlign('right')
    ctx.fillText(info.name, c(185), c(200))
    // 职位
    ctx.setFontSize(c(12))
    ctx.setFillStyle('#333')
    ctx.setTextAlign('left')
    ctx.fillText(info.levelName, c(190), c(200))
    // 品牌、店名
    if (info.city.indexOf('市') == info.city.length - 1) {
      info.city = info.city.substring(0, info.city.length - 1)
    }
    ctx.setFontSize(c(12))
    ctx.setFillStyle('#999')
    ctx.setTextAlign('center')
    const str = info.brandName + '  ' + info.city + info.shopName
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
    ctx.fillText(info.appointmentMount, c(99 + width), c(280))
    ctx.fillText(info.worksMount, c(165 + width), c(280))
    ctx.fillText(info.assessmentMount, c(233 + width), c(280))
  },
  // 画星星
  drawStar(ctx) {
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
    let score = this.data.staffInfo.score
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
    // 保留digits位小数
    var fixNum = function(num, digits) {
      if (num == 0) return num
      if (!num) return
      return Number(num).toFixed(digits)
    }
    ctx.fillText(fixNum(score, 1) + '分', c(215), c(256))
  },
  // 绘制动态主图
  drawPhotos(ctx) {
    const c = this.corr

    const SPACE = 3
    const WIDTH = 66
    const X_BASE = 16
    const Y = 324
    const RADIUS = 4

    const photos = this.data.picPhotos
    for (let i = 0; i < photos.length; i++) {
      ctx.save()
      myUtil.drawRoundRect(c(X_BASE + WIDTH * i + SPACE * i), c(Y), c(WIDTH), c(WIDTH), c(RADIUS), ctx)
      ctx.clip()
      const {
        sx,
        sy,
        sWidth,
        sHeight
      } = myUtil.drawCoverImg(c(WIDTH), c(WIDTH), c(photos[i].width), c(photos[i].height))
      ctx.drawImage(photos[i].path, sx, sy, sWidth, sHeight, c(X_BASE + WIDTH * i + SPACE * i), c(Y), c(WIDTH), c(WIDTH))
      ctx.restore()
    }
  },
  // 绘制擅长标签
  drawSkills(ctx) {
    const skills = this.data.staffInfo.skillList
    if (!skills || !skills.length) return
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
    let width_total = 0,
      rows = 1,
      y = Y_BASE
    let width_text, x
    for (let i = 0; i < skills.length; i++) {
      width_text = ctx.measureText(skills[i]).width
      if ((width_total + PADDING_2 + width_text + SPACE) > MAX_WIDTH) {
        rows++
        if (rows > 2) return
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
  drawQrcode(ctx) {
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