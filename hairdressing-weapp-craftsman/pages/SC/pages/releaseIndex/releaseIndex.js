// pages/SC/pages/releaseIndex/releaseIndex.js
const fetch = require('../../../../utils/fetch.js');
const request = new fetch.request();
const app = getApp();
Page({
  data: {
    photos:[],
    tags:[],
    services:[],
    products:[],
    description:'',
    // 关联服务单相关参数
    consumerOrderId:null,
    storeId:null,
    images:null,
    // 展示用列表
    tagsNameList:null,
    relateProductsImg:null,
    relateOrderImg:null,
    // 入口来自服务单
    fromOrder:false,
  },
  onLoad(options) {
    if (options.consumerOrderId){
      this.$setData({
        fromOrder: true
      })
      this.data.consumerOrderId = options.consumerOrderId
      this.data.storeId = options.storeId
    }
    this.$on('updateTags', this.updateTags)
    this.$on('updateServicesAndProducts', this.updateServicesAndProducts)
    this.$on('updateRelateOrder', this.updateRelateOrder)
  },
  updateTags(res){
    this.data.tags = res.idList
    this.$setData({
      tagsNameList:res.nameList
    })
  },
  updateServicesAndProducts(sap){
    this.data.services = sap.services
    this.data.products = sap.products
    this.$setData({
      relateProductsImg:sap.images
    })
  },
  updateRelateOrder(res){
    this.data.consumerOrderId = res.id
    this.$setData({
      relateOrderImg:res.images
    })
  },
  chooseImage() {
    wx.chooseImage({
      sizeType:'compressed',
      count: 9 - this.data.photos.length,
      success: (res) => {
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          fetch.uploadFile(res.tempFilePaths[i]).then(uploadFileRes => {
            this.data.photos.push(uploadFileRes)
            this.setData({
              photos: this.data.photos
            })
          })
        }
      }
    })
  },

  /**
   * 删除图片
   */
  deleteImage(e) {
    let imageUrl = e.currentTarget.dataset.url;
    let index = e.currentTarget.dataset.index;
    let fileArr = imageUrl.split('/');
    let fileKey = fileArr[fileArr.length-1]
    this.$get('/deletePicture/' + fileKey).then( data => {
      this.data.photos.splice(index, 1)      
      this.$setData({
        photos: this.data.photos
      })
    })
  },

  // 点击去添加标签
  toreleaseAddLabel() {
    this.$route('/pages/SC/pages/releaseAddLabel/releaseAddLabel', {tags: JSON.stringify(this.data.tags)})
  },

  // 点击去关联商品
  toreleaseRelatedProduct() {
    if (this.data.consumerOrderId) {
      return this.showToast()
    }
    const services = JSON.stringify(this.data.services)
    const products = JSON.stringify(this.data.products)
    this.$route('/pages/SC/pages/releaseRelatedProduct/releaseRelatedProduct', {services, products})
  },

  // 点击跳转关联服务单
  jumpRelatedOrder(){
    if (this.data.relateProductsImg && this.data.relateProductsImg.length){
      return this.showToast()
    }
    this.$route('/pages/SC/pages/releaseRelatedOrder/releaseRelatedOrder', { consumerOrderId: this.data.consumerOrderId})
  },  

  showToast(){
    wx.showToast({
      title: '关联商品和服务单只能选其一',
      icon:'none'
    })
  },

  inputText(e) {
    this.data.description = e.detail.value
  },
  // 点击发布
  clickRelease() {
    if (!this.data.photos.length) {
      wx.showToast({
        title: '请添加图片',
        icon: 'none'
      })
      return;
    }

    if (!this.data.description){
      wx.showToast({
        title: '请补充描述文字',
        icon:'none'
      })
      return
    }
    wx.showLoading({
      title: '正在发布',
      mask: true
    })

    const params = {
      photos: this.data.photos,
      tags: this.data.tags,
      services: this.data.services,
      products: this.data.products,
      description: this.data.description,
      storeId: this.data.storeId || wx.$getStorage('storeId'),
      brandId: wx.$getStorage('brandId'),
      consumerOrderId: this.data.consumerOrderId
    }

    let promise
    if(this.data.consumerOrderId){
      promise = fetch.createConsumerOrderStaffDynamicWorks(params)
    }else{
      promise = fetch.createStaffDynamicWorksInfo(params)
    }

    promise.then( data => {
      wx.hideLoading();
      if (data.success) {
        wx.showToast({
          title: '发布成功',
          mask: true
        })
        this.$place('releasedWorks', 1)
        wx.switchTab({
          url: '/pages/tabBar/CircleWork/index/index',
        })
      }else{
        wx.$toast(data.message)
      }
    })
  },
})