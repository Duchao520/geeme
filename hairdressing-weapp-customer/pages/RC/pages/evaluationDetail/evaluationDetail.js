// pages/RC/pages/evaluationDetail/evaluationDetail.js
var apiAction = null;
Page({
  $name:'evaluationDetail',
  data: {
    assessment: null,
    server: null,
  },
  computed:{
    _createTime(){
      if(this.data.assessment){
        let createTime = this.data.assessment.createTime
        if (createTime.includes(' ')) {
          return createTime.split(' ')[0]
        }
      }
    }
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    this.$place('data', this.fetch(options.id))
    this.$take('data').then(data => {
      this.$setData({
        assessment:data.assessmentInfo,
        server:data.serverInfo
      })
    })
  },
  onUnload() {          //清内存
    apiAction = null;
    this.data = null;
  },
  fetch(id){
    return apiAction.weGetGoodsOrderAssessmentById(id)
  },
  toProductDetail() {
    const { id, goodsType, goodsId } = this.data.assessment;
    const params = {
      productId: goodsId
    }
    if (goodsType == 'product') params.isProduct = 1
    this.$route('/pages/IC/pages/productdetails/productdetails', params)
  }
})