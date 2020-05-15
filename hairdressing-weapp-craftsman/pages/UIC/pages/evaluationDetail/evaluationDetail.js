// pages/RC/pages/evaluationDetail/evaluationDetail.js
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    assessment:null,
    server:null,
  },
  computed:{
    _createTime() {
      if (this.data.assessment) {
        let createTime = this.data.assessment.createTime
        if (createTime.includes(' ')) {
          return createTime.split(' ')[0]
        }
      }
    }
  },
  onLoad(options) {
    this.fetch(options.id)
  },
  fetch(id){
    fetch.weStaffGetGoodsOrderAssessmentById(id).then( data => {
      console.log(data)
      this.$setData({
        assessment:data.assessmentInfo,
        server:data.serverInfo
      })
    })
  }
})