// pages/UIC/pages/collection/collection.js
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    worksList:[],
    currentPage:1,
    pageSize:10,
    total:0,
    flag:false,
  },
  onLoad(options) {
    this.fetch()
  }, 
  fetch(){
    const {currentPage, pageSize} = this.data
    fetch.getStaffCollectSimpleDynamic({currentPage, pageSize}).then( data => {
      console.log(data)
      if (data.weStaffSimpleDynamicList && data.weStaffSimpleDynamicList.length){
        let list
        list = currentPage == 1 ? data.weStaffSimpleDynamicList : this.data.worksList.concat(data.weStaffSimpleDynamicList)
        this.$setData({
          worksList: list
        })
      }
      this.data.total = data.total
    })
  },
  onReachBottom(){
    if(this.data.flag) return
    if(this.data.currentPage * this.data.pageSize >= this.data.total) return
    this.data.flag = true
    this.data.currentPage++
    this.fetch()
  }
})