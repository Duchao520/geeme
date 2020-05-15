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
    if (options.customerId)this.customerId = options.customerId;
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

  inputText(e) {
    this.data.description = e.detail.value
  },
  // 点击发布
  clickRelease() {
    if (!this.data.photos.length && !this.data.description) {
      wx.showToast({
        title: '请添加图片或补充描述文字',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '正在发布',
      mask: true
    })

    const params = {
      imageList: this.data.photos,
      customerId: this.customerId,
      content: this.data.description
    }

    fetch.saveStoreCustomerRemark(params).then( data => {
      wx.hideLoading();
      if (data.success) {
        wx.showToast({
          title: '发布成功',
          mask: true
        })
        wx.navigateBack();
      }else{
        wx.$toast(data.message)
      }
    })
  },
})