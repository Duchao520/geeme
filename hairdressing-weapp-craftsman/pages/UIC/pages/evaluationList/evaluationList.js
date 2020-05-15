// pages/UIC/pages/evaluationList/evaluationList.js
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    tags:[],
    // 当前选中tag
    tagId:-2, //-2:全部
    // 分页加载
    pageNum:1,
    pageSize:10,
    total:0,
    flag:false,
    // 评价列表
    list:[],
  },
  onLoad(options) {
    this.getTags()
    this.getAssessment()
  },
  getTags(){
    fetch.getMyAssessmentTagCount().then( data => {
      this.$setData({
        tags:data.tagCounts
      })
    })
  },
  getAssessment(){
    const {pageNum, pageSize, tagId} = this.data
    const params = {
      pageNum,
      pageSize,
      tagId,
    }

    wx.showLoading()
    fetch.getMyAssessmentList(params).then( data => {
      wx.hideLoading()
      this.data.flag = false
      this.data.total = data.total

      let list = pageNum == 1 ? data.staffAssessmentList : this.data.list.concat(data.staffAssessmentList)
      this.$setData({
        list,
        avgScore:data.avgScore || 5
      })
    })
  },
  switchTagId(e){
    const id = e.currentTarget.dataset.id
    this.$setData({
      list:[],
      tagId:id
    })
    this.data.pageNum = 1
    this.getAssessment()
  },
  onReachBottom(){
    if(this.data.pageNum * this.data.pageSize >= this.data.total) return
    if(this.data.flag) return
    this.data.flag = true
    this.data.pageNum++
    this.getAssessment()
  },
})