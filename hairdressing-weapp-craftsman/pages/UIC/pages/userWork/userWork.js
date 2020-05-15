// pages/UIC/pages/userWork/userWork.js
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    list:[],
    currentPage:1,
    pageSize:10,
    total:0,
    flag:false
  },
  onShow(){
    this.fetch()
  },
  fetch(){
    const { currentPage, pageSize } = this.data
    fetch.getMyWorks({ currentPage, pageSize }).then(data => {
      this.data.flag = false
      this.data.total = data.total
      if (data.weStaffSimpleDynamicList && data.weStaffSimpleDynamicList) {
        let list = currentPage == 1 ? data.weStaffSimpleDynamicList : this.data.list.concat(data.weStaffSimpleDynamicList)
        this.$setData({
          list
        })
      }
    })
  },
  onReachBottom(){
    if(this.data.flag) return
    if(this.data.currentPage * this.data.pageSize >= this.data.total) return
    this.data.flag = true
    this.data.currentPage++
    this.fetch()
  },
})