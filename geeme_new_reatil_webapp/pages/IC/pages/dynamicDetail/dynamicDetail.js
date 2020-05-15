// pages/IC/pages/dynamicDetail/dynamicDetail.js
var apiAction,util,myUtil,app;
Page({
  $name:'dynamicDetail',
  data: {
    // 详情信息
    dynamics: [],
    // 本用户头像
    avatar: '',
    ifShowSharePop: false, // 是否弹出分享弹框
    qrcode: null, // 分享画报-小程序码
    headPortrait:null,  // 分享画报-员工头像
    mainPhoto:null,   // 分享画报-主图相关信息
    picDynamic:null,  // 分享画报-当前绘制的动态
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    myUtil = require('../../../../utils/myUtil.js');
    app = getApp();
    let id
    if(options.scene){
      const obj = util.sceneToJson(options.scene)
      id = obj.id
      this.isShare = true
    }else{
      id = options.id
    }
    this.getDynamicDetailById(id).then(data => {
      if(this.isShare){
        app.setShopInfo(data.storeId)
      }
      if (wx.$getStorage('authorization')) {
        app.getUserInfo(userInfo => {
          this.setData({
            dynamics: [data],
            avatar: userInfo.storeHeadIcon
          })
        })
      }else{
        this.$setData({
          dynamics: [data]
        })
      }
    })
  },
  // 定义分享内容
  onShareAppMessage(res) {
    const dynamic = this.data.dynamics[0]
    const path = `/${this.route}?id=${dynamic.id}`
    return {
      title: dynamic.nickName + ':' +  dynamic.description,
      path,
      imageUrl: util.getImageUrl(dynamic.photos[0]),
    }
  },
  onUnload(){
    apiAction = null;
    util = null;
    myUtil = null;
    this.data = null;
  },
  // 去商品详情
  toProductDetail(e) {
    const {
      id,
      isproduct
    } = e.currentTarget.dataset
    const query = {
      productId: id
    }
    if (isproduct) query.isProduct = 1
    this.$route('/pages/IC/pages/productdetails/productdetails', query)
  },

  // 预约
  makeAppointment(e) {
    wx.removeStorageSync('appointment')
    const item = e.currentTarget.dataset.item
    let specificationList = [{
      count: 1,
      specificationId: item.id,
      serviceId: item.serviceId,
    }]
    util.addservice(specificationList, item.shopPrice, item.storeId)
    wx.navigateTo({
      url: '/pages/TC/pages/choosehair/choosehair?shopId=' + item.storeId
    })
  },

  // 前往评论详情页面
  toDynamicComment(e) {
    this.$route('/pages/IC/pages/dynamicComment/dynamicComment', {
      dynamicId: e.currentTarget.dataset.id
    })
  },

  // swiper-item切换时触发
  changeSwiperImage(e) {
    let attr = `dynamics[${e.currentTarget.dataset.index}].currentImage`
    this.setData({
      [attr]: e.detail.current
    })
  },

  // 预览图片
  previewImage(e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.urls,
      current: e.currentTarget.dataset.src
    })
  },

  // 添加评论
  addComment(e) {
    const index = e.currentTarget.dataset.index
    const id = e.currentTarget.dataset.worksid
    const params = {
      worksId: id,
      content: e.detail.value
    }
    if (e.detail.value == ''){
      wx.showToast({
        title: '发布内容不可为空',
        icon: 'none'
      })
      return;
    }
    apiAction.wePublishDynamicComment(params).then(data => {
      if (data.success) {
        wx.showToast({
          title: '发布评论成功',
          icon: 'none'
        })
        const attr1 = `dynamics[${index}]`
        const attr2 = `dynamics[${index}].addComment`
        this.getDynamicDetailById(id).then(data => {
          this.$setData({
            [attr1]: data,
            [attr2]: '',
          })
        })
      }
    })
  },

  //点赞/取消点赞
  weDynamicThumbUp(e) {
    const dataset = e.currentTarget.dataset
    const index = dataset.index

    const params = {
      thumbUp: !dataset.thumbup,
      worksId: dataset.worksid
    }

    apiAction.weDynamicThumbUp(params).then(data => {
      if (data.success) {
        let attr1 = `dynamics[${index}].thumbUped`
        let attr2 = `dynamics[${index}].thumbUp`
        this.setData({
          [attr1]: !dataset.thumbup,
          [attr2]: data.num
        })
      }
    })
  },

  //收藏/取消收藏
  weDynamicCollect(e) {
    const dataset = e.currentTarget.dataset
    const index = dataset.index

    const params = {
      collect: !dataset.collect,
      worksId: dataset.worksid
    }
    apiAction.weDynamicCollect(params).then(data => {
      if (data.success) {
        let attr1 = `dynamics[${index}].collected`
        let attr2 = `dynamics[${index}].collections`
        this.setData({
          [attr1]: !dataset.collect,
          [attr2]: data.num
        })
      }
    })
  },

  // 关注/取消关注
  weDynamicAttentive(e) {
    const {
      index,
      attentive,
      userid
    } = e.currentTarget.dataset
    apiAction.weDynamicAttentive({
      attentive: !attentive,
      beAttentiveUserId: userid
    }).then(data => {
      if (data.success) {
        let attr = `dynamics[${index}].attentived`
        this.setData({
          [attr]: !attentive
        })
      }
    })
  },
  // 获取动态详情
  getDynamicDetailById(id) {
    return apiAction.getDynamicDetailById(id)
  },
  // 跳转服务者主页
  jumpStaffDetail(e) {
    const id = e.currentTarget.dataset.id
    this.$route('/pages/SC/pages/hairdetails/hairdetails', {
      hairId: id
    })
  },
  // 点击生成画报
  sharePic(e) {
    wx.$showLoading()
    const dynamic = e.currentTarget.dataset.dynamic
    this.data.mainPhoto = dynamic._mainPhoto
    this.data.picDynamic = dynamic
    // 生成小程序码
    const page = 'pages/IC/pages/dynamicDetail/dynamicDetail'
    let scene = `id=${dynamic.id}`
    apiAction.commonQrCode(page, scene).then(data => {
      this.data.qrcode = data.fileKey
      this.initPic(dynamic)
    })
  },
  // 初始化画报
  initPic(dynamic) {
    this.ratio = 1
    const promise1 = new Promise(resolve => {
      // 下载小程序码图片到本地
      wx.getImageInfo({
        src: util.getImageUrl(this.data.qrcode),
        success: res => {
          this.data.qrcode = res
          resolve()
        }
      })
    })
    const promise2 = new Promise(resolve => {
      // 下载员工头像到本地
      wx.getImageInfo({
        src: util.getImageUrl(dynamic.headPortrait),
        success: res => {
          this.data.headPortrait = res
          resolve()
        }
      })
    })
    Promise.all([promise1, promise2]).then(this.drawCanvas)
  },
  // 绘画画报
  drawCanvas() {
    const c = this.corr
    const ctx = wx.createCanvasContext('canvas')
    // 画主图
    this.drawMainPhoto(ctx, this.data.mainPhoto)
    // 渐变黑色
    const grd = ctx.createLinearGradient(0, c(193), 0, c(551))
    grd.addColorStop(0, 'rgba(0,0,0,0)')
    grd.addColorStop(1, 'rgba(0,0,0,1)')
    ctx.setFillStyle(grd)
    ctx.fillRect(0, c(193), c(375), c(358))
    // 底部纯黑色
    ctx.setFillStyle('black')
    ctx.fillRect(0, c(550), c(375), c(117))
    // 员工信息
    this.drawStaffInfo(ctx)
    // 动态文字内容
    this.drawContent(ctx)
    // 画小程序码及提示文字
    this.drawQrcode(ctx)

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
              this.$setData({
                ifShowSharePop:false
              })
            }
          })
        }
      })
    })
  },
  // 画主图(等比例放大到375 * 550)
  drawMainPhoto(ctx, mainPhoto) {
    const c = this.corr
    const { sx, sy, sWidth, sHeight } = myUtil.drawCoverImg(c(375), c(550), mainPhoto.width, mainPhoto.height)
    ctx.drawImage(mainPhoto.path, sx, sy, sWidth, sHeight, 0, 0, c(375), c(550))
  },
  // 填充员工信息
  drawStaffInfo(ctx){
    const c = this.corr
    // 画头像
    ctx.save()
    ctx.beginPath()
    ctx.arc(c(48), c(512), c(22), 0, 2 * Math.PI)
    ctx.clip()
    const headPortrait = this.data.headPortrait
    const { sx, sy, sWidth, sHeight } = myUtil.drawCoverImg(c(44), c(44), headPortrait.width, headPortrait.height)
    ctx.drawImage(headPortrait.path, sx, sy, sWidth, sHeight, c(26), c(490), c(44), c(44))
    ctx.restore()
    // 昵称
    ctx.setFillStyle('white')
    ctx.setFontSize(c(17))
    ctx.fillText(this.data.picDynamic.nickName ,c(75), c(510))
    // 品牌、职位
    ctx.setFontSize(c(12))
    ctx.fillText(this.data.picDynamic.brandName + '  ' + this.data.picDynamic.levelName, c(75), c(530))
  },
  // 填充动态文字内容
  drawContent(ctx){
    const c = this.corr
    const TEXT_RECT_WIDTH = 213
    ctx.setFontSize(c(12))
    ctx.setFillStyle('white')

    const content = this.data.picDynamic.description
    let Y = 562
    // 判断是否需要换行
    let text_width = 0;
    let rows = 1;
    let text = '';
    for (const v of content) {
      text_width += ctx.measureText(v).width
      if (text_width >= c(TEXT_RECT_WIDTH)) {
        ctx.fillText(text, c(26), c(Y), c(TEXT_RECT_WIDTH))
        text_width = ctx.measureText(v).width
        text = v
        rows++
        Y += 21
        if (rows === 5) {
          break
        }
      } else {
        text += v
      }
    }
    // 最后根据rows判断是否还有text未填充
    if (rows <= 4) {
      ctx.fillText(text, c(28), c(Y), c(TEXT_RECT_WIDTH))
    }
  },
  // 填充小程序码
  drawQrcode(ctx){
    const c = this.corr
    // 填充小程序码图片
    ctx.save()
    ctx.beginPath()
    ctx.arc(c(296), c(582), c(35), 0, 2 * Math.PI)
    ctx.clip()
    const qrcode = this.data.qrcode
    ctx.drawImage(qrcode.path, c(261), c(547), c(70), c(70))
    ctx.restore()
    // 填充提示文字
    ctx.setFontSize(c(10))
    ctx.setFillStyle('white')
    ctx.fillText('长按识别扫码查看详情', c(246), c(635))
  },
  // 调整比例，高清绘制(?)
  corr(number){
    return number * this.ratio
  },
  prevent() {}
})