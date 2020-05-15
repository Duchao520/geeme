var getRecord = null;
Page({
  data: {
    currentPage:1,
    pageSize:20,
    flag:false,
    total:0,
    list:null,
  },
  onLoad(options) {
    getRecord = require('../../../../utils/apiAction.js').getBrandCustomerExpRecord
    this.fetch()
  },
  onUnload(){
    getRecord = null;
    this.data = null;
  },
  fetch(){
    const {currentPage, pageSize} = this.data
    getRecord({currentPage, pageSize}).then( data => {
      this.data.flag = false
      this.data.total = data.total
      const list = currentPage == 1 ? data.brandCustomerExpRecordList : this.data.list.concat(data.brandCustomerExpRecordList)
      this.$setData({
        list
      })
    })
  },
  onReachBottom() {
    if(this.data.flag) return
    if(this.data.currentPage * this.data.pageSize >= this.data.total) return
    this.data.flag = true
    this.data.currentPage++
    this.fetch()
  },
})