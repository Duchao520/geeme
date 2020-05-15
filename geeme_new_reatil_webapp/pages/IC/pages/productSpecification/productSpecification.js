// pages/IC/pages/productSpecification/productSpecification.js
const apiAction = require('../../../../utils/apiAction.js')
Page({
  data: {
    info:null,
  },
  onLoad(options) {
    this.getProductSnapshotInfoByOrderId(options.id)
  },
  getProductSnapshotInfoByOrderId(id){
    apiAction.getProductSnapshotInfoByOrderId(id).then( data => {
      this.setData({
        info:data.weProductSnapshotInfo
      })
    })
  },
  formatTime(){

  },
})