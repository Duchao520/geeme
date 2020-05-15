// pages/IC/pages/dynamicComment/dynamicComment.js
const fetch = require('../../../../utils/fetch.js')
Page({
  $name:'dynamicComment',
  data: {
    dynamicId: '',
    list: [],
    // 发表评论的内容
    content: '',
    // 下拉加载更多用
    currentPage: 1,
    pageSize: 10,
    total: 0,
    flag: false,
  },

  // 刷新
  refresh() {
    this.data.currentPage = 1;
    this.data.pageSize = 10;
    this.setData({
      list: [],
      content: ''
    })
    this.weDynamicCommentListByDynamicId()
  },
  // 添加评论
  addComment(e) {
    const params = {
      worksId: this.data.dynamicId,
      content: this.data.content
    }
    fetch.weStaffPublishDynamicComment(params).then(data => {
      if (data.success) {
        wx.showToast({
          title: '发布评论成功',
          icon: 'none'
        })
        setTimeout(this.refresh, 1000)
      }
    })
  },

  // bindinput
  setContent(e) {
    this.data.content = e.detail.value
  },

  // 获取回复列表
  weDynamicCommentListByDynamicId() {
    const { dynamicId, currentPage, pageSize } = this.data
    const params = {
      dynamicId,
      currentPage,
      pageSize
    }
    fetch.weStaffDynamicCommentListByDynamicId(params).then(data => {
      this.data.flag = false
      if (data.total != this.data.total) {
        this.data.total = data.total
        wx.setNavigationBarTitle({
          title: `共${data.total}条评论`,
        })
      }
      this.setData({
        list: this.data.list.concat(data.staffDynamicWorkCommentList)
      })
    })
  },

  // 自定义生命周期
  onNavigate(query) {
    console.log(query)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.dynamicId = options.dynamicId
    this.weDynamicCommentListByDynamicId()
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.flag) return
    if (this.data.currentPage * this.data.pageSize >= this.data.total) return
    this.data.flag = true
    this.data.currentPage++
    this.weDynamicCommentListByDynamicId()
  },
})