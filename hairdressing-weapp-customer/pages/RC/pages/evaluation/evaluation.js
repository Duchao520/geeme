// pages/RC/pages/evaluation/evaluation.js
const apiAction = require('../../../../utils/apiAction.js');
Page({
  data: {
    //订单的总体信息
    orderInfo:{},
    //评论正文部分
    // true:产品 false:服务
    isProduct:false,
    // 商品信息
    info:null, 
    // 印象标签
    tagList:null,
    // 提交评价请求参数
    anonymous:false,
    TAG_FLAG: false,  //展开收起标签开关
    content: '',
    score0: 5, // 总体评价
    score1: 5, // 商品质量 || 专业度
    score2: 5, // 发货速度 || 环境
    score3: 5, // 快递物流 || 服务 
    serverScore:5,
    photos:[],
    impressionTags:[],
  }, 
  onLoad(options) {
    const isProduct = options.isProduct ? true : false
    const info = JSON.parse(options.info)
    if(!isProduct){
      info.serviceInfo = info.serviceInfo || info.serviceInfoForOrder
      info._staffList = [...info.stationOne || [], ...info.stationTwo || [], ...info.stationThree || []]
      for (const v of info._staffList) {
        v.serverScore = 5
      }
    }
    this.setData({
      isProduct,
      info,
    })
    this.getTags();
  },
  TagSwitcher(){
    this.setData({
      TAG_FLAG: !this.data.TAG_FLAG
    })
  },
  // 获取门店下面的印象标签列表
  getTags(){
    apiAction.getTagLib().then(data => {
      const tagList = data.tagList.filter(item => item.goodsType === (this.data.isProduct ? 'production' : 'service'))
      this.setData({
        tagList
      })
    })
  },

  // 选择印象标签
  selectedTag(e) {
    const id = e.currentTarget.dataset.id;
    for(const v of this.data.tagList){
      if(v.id == id){
        v.selected = !v.selected
        break;
      }
    }
    this.setData({
      tagList: this.data.tagList
    })
  },
  
  // 设置评论正文
  setContent(e){
    this.setData({
      content:e.detail
    })
  },

  // 点击提交评价
  evaluate(){
    if(this.data.isProduct){
      this.evaluateProduct()
    }else{
      this.evaluateService()
    }
  },

  // 产品评价
  evaluateProduct(){
    const { anonymous, content, photos, score0, score1, score2, score3, } = this.data
    const info = this.data.info
    const impressionTags = [];
    if(!content){
      wx.showToast({
        title: '评价内容不能为空',
        icon: 'none'
      });
      return
    }
    for(const v of this.data.tagList){
      if(v.selected){
        impressionTags.push(v.id)
      }
    }
    const params = {
      anonymous,
      content,
      deliverSpeed:score2,
      express:score3,
      goodsId:info.productId,
      goodsOrderId:info.id,
      photos,
      productQuality:score1,
      storeId:info.storeId,
      totalScore:score0,
      impressionTags,
    }
    wx.showModal({
      title: '提示',
      content: '是否确认提交评价？',
      success:res => {
        if(res.confirm){
          apiAction.createProductOrderAssessment(params).then(data => {
            if (data.success) {
              wx.$event.emit('orderEvaluate', {id:info.id})
              wx.navigateBack({
                delta:1
              })
            }
          })
        }
      }
    })
  },

  // 服务评价
  evaluateService(){
    const { anonymous, content, photos, score0, score1, score2, score3, serverScore} = this.data
    const info = this.data.info
    const impressionTags = []
    if (!content) {
      wx.showToast({
        title: '评价内容不能为空',
        icon: 'none'
      });
      return
    }
    for (const v of this.data.tagList) {
      if (v.selected) {
        impressionTags.push(v.id)
      }
    }
    const params = {
      serverId:info.staffId || info.staffInfo.staffId,
      storeId:info.storeId || info.storeInfo.storeId,
      goodsType:'service',
      goodsId: info.serviceInfo.serviceId,
      anonymous,
      content,
      totalScore: score0,
      professionScore: score1,
      environmentScore: score2,
      serviceScore: score3,
      serverScore: serverScore,
      goodsOrderId: info.id,
      images:photos,
      impressionTags,
      serverAssessmentList:[]
    }
    for(const v of info._staffList){
      params.serverAssessmentList.push({
        serverId:v.staffId,
        serverScore:v.serverScore
      })
    }
    wx.showModal({
      title: '提示',
      content: '是否确认提交评价？',
      success: res => {
        if (res.confirm) {
          apiAction.createEvaluation(params).then(data => {
            if (data.success) {
              wx.$event.emit('orderEvaluate', { id: info.id })
              wx.showToast({
                title: '评价成功！',
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          })
        }
      }
    })
  },
  /**
   * 上传图片
   */
  uploadPic(){
    wx.chooseImage({
      count: 9 - this.data.photos.length,
      success: res => {
        let images = res.tempFilePaths
        for (let i = 0; i < images.length; i++) {
          apiAction.uploadPicture(images[i]).then(image => {
            this.data.photos.push(image)
            this.setData({
              photos: this.data.photos
            })
          })
        }
      }
    })
  },
})