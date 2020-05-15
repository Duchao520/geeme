const getInfo = require('../../../../utils/apiAction.js').weGetBrandMemberExperienceRule
Page({
  data: {
    info:null
  },
  onLoad(options) {
    this.fetch()
  },
  fetch(){
    getInfo().then( data => {
      this.$setData({
        info: data.brandMemberExperienceRuleInfo
      })
    })
  }
  
})