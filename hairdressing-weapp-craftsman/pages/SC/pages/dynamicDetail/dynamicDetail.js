// pages/IC/pages/dynamicDetail/dynamicDetail.js
const fetch = require('../../../../utils/fetch.js')
const util = require('../../../../utils/util.js')
const myUtil = require('../../../../utils/myUtil.js')
const app = getApp()
Page({
  $name:'dynamicDetail',
  data: {
    // 详情信息
    id: null,
    dynamics: [],
    avatar: '',
    ifShowSharePop: false, // 是否弹出分享弹框
    qrcode: null, // 分享画报-小程序码
    headPortrait: null, // 分享画报-员工头像
    mainPhoto: null, // 分享画报-主图相关信息
    picDynamic: null, // 分享画报-当前绘制的动态
    Delete: null
  },
  onLoad(options) {
    if (!wx.$getStorage('authorization')) {
      wx.reLaunch({
        url: '/pages/Login/loginIndex/loginIndex'
      })
      return
    }
    this.getDynamicDetailById(options.id).then(data => {
      this.setData({
        dynamics: [data],
        id: options.id,
        Delete: options.delete ? options.delete : null
      })
    })
    app.getUserInfo(userInfo => {
      this.setData({
        avatar: userInfo.headPortrait
      })
    })
  },
  // 定义分享内容
  onShareAppMessage(res) {
    console.log(res)
    const dynamic = res.target.dataset.dynamic
    const path = `/${this.route}?id=${dynamic.id}`
    return {
      title: dynamic.description,
      path,
      imageUrl: dynamic.photos[0],
    }
  },
  // 前往评论详情页面
  toDynamicComment(e) {
    this.$route('/pages/SC/pages/dynamicComment/dynamicComment', {
      dynamicId: e.currentTarget.dataset.id
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
    fetch.weStaffPublishDynamicComment(params).then(data => {
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

    fetch.weStaffDynamicThumbUp(params).then(data => {
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

    fetch.weStaffDynamicCollect(params).then(data => {
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
    fetch.weStaffDynamicAttentive({
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

  //删除动态
  weDeleteDynamicWorkById(){
    let params = {
      id: this.data.id
    };
    fetch.weDeleteDynamicWorkById(params).then(res => {
      wx.showToast({
        title: '已删除'
      })
      wx.navigateBack()
    })
  },

  // swiper-item切换时触发
  changeSwiperImage(e) {
    let str = `dynamics[${e.currentTarget.dataset.index}].currentImage`
    this.setData({
      [str]: e.detail.current
    })
  },

  // 获取动态详情
  getDynamicDetailById(id) {
    return fetch.getStaffDynamicDetailById(id)
  },
  // 跳转员工主页
  jumpStaffDetail(e){
    const {brand_id, staff_id} = e.currentTarget.dataset
    this.$route("/pages/SC/pages/hairdetails/hairdetails", {brandId:brand_id, hairId:staff_id})
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
    fetch.commonQrCode(page, scene, null, dynamic.brandId).then(data => {
      if (data.success) {
        this.data.qrcode = data.fileKey
        this.initPic(dynamic)
      } else {
        wx.$hideLoading()
        wx.showToast({
          title: '生成品牌客户端小程序码失败',
          icon:'none'
        })
      }
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
                ifShowSharePop: false
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
    const {
      sx,
      sy,
      sWidth,
      sHeight
    } = myUtil.drawCoverImg(c(375), c(550), mainPhoto.width, mainPhoto.height)
    ctx.drawImage(mainPhoto.path, sx, sy, sWidth, sHeight, 0, 0, c(375), c(550))
  },
  // 填充员工信息
  drawStaffInfo(ctx) {
    const c = this.corr
    // 画头像
    ctx.save()
    ctx.beginPath()
    ctx.arc(c(48), c(512), c(22), 0, 2 * Math.PI)
    ctx.clip()
    const headPortrait = this.data.headPortrait
    const {
      sx,
      sy,
      sWidth,
      sHeight
    } = myUtil.drawCoverImg(c(44), c(44), headPortrait.width, headPortrait.height)
    ctx.drawImage(headPortrait.path, sx, sy, sWidth, sHeight, c(26), c(490), c(44), c(44))
    ctx.restore()
    // 姓名
    ctx.setFillStyle('white')
    ctx.setFontSize(c(17))
    ctx.fillText(this.data.picDynamic.nickName, c(75), c(510))
    // 品牌、职位
    ctx.setFontSize(c(12))
    ctx.fillText(this.data.picDynamic.brandName + '  ' + this.data.picDynamic.levelName, c(75), c(530))
  },
  // 填充动态文字内容
  drawContent(ctx) {
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
  drawQrcode(ctx) {
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
  corr(number) {
    return number * this.ratio
  },
  prevent() {}
})