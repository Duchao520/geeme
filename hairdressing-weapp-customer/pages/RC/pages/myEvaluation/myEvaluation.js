// pages/RC/pages/myEvaluation/myEvaluation.js
const apiAction = require('../../../../utils/apiAction.js')
Page({
  data: {
    goodsInfo: null,
    orderId: 0,
    isProduct: false,
    assessment:null,
    server:null,
  },
  onLoad(options) {
    const isProduct = options.isProduct ? true : false
    const goodsInfo = JSON.parse(options.goodsInfo)
    this.data.orderId = options.orderId
    this.setData({
      isProduct,
      goodsInfo,
    })
    this.fetch()
  },
  fetch() {
    apiAction.weGetGoodsOrderAssessmentByOrderId(this.data.orderId).then(data => {
      this.setData({
        assessment: data.assessmentInfo,
      })
    })
  }
})