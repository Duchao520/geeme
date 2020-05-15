// pages/IC/pages/dynamicComment/dynamicComment.js
var apiAction = null;
Page({
  $name:'dynamicComment',
  data: {
    dynamicId:'',
    list:[],
    // 发表评论的内容
    content:'',
    // 下拉加载更多用
    currentPage: 1,
    pageSize: 10,
    total: 0,
    flag:false,
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    this.data.dynamicId = options.dynamicId
    this.weDynamicCommentListByDynamicId()
  },
  onShow(){
    this.weDynamicCommentListByDynamicId()    
  },
  onUnload() {          //清内存
    apiAction = null;
    this.data = null;
  },
  onReachBottom() {
    if (this.data.flag) return
    if (this.data.currentPage * this.data.pageSize >= this.data.total) return
    this.data.flag = true
    this.data.currentPage++
    this.weDynamicCommentListByDynamicId()
  },

  // 刷新
  refresh(){
    this.data.currentPage = 1;
    this.data.pageSize = 10;
    this.weDynamicCommentListByDynamicId()
  },
  // 添加评论
  addComment(e) {
    if (!this.data.content){
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none'
      });
      return;
    }
    const params = {
      worksId: this.data.dynamicId,
      content: this.data.content
    }
    apiAction.wePublishDynamicComment(params).then(data => {
      if (data.success) {
        wx.showToast({
          title: '发布评论成功',
          icon: 'none'
        })
        this.refresh()
      }
    })
  },

  // bindinput
  setContent(e){
    this.data.content = e.detail.value
  },

  // 获取回复列表
  weDynamicCommentListByDynamicId(){
    const {dynamicId, currentPage, pageSize} = this.data
    const params = {
      dynamicId,
      currentPage,
      pageSize
    }
    apiAction.weDynamicCommentListByDynamicId(params).then( data => {
      this.data.flag = false
      if(data.total != this.data.total){
        this.data.total = data.total
        wx.setNavigationBarTitle({
          title: `共${data.total}条评论`,
        })
      }
      this.setData({
        list: data.staffDynamicWorkCommentList,
        content: ''
      })
    })
  },
  weDeleteDynamicComment(e){
    let { id } = e.currentTarget.dataset,
        params = {id};
    apiAction.weDeleteDynamicComment(params).then(res => {
      if (res.success){
        this.refresh();
        wx.showToast({
          title: '已删除',
          icon: "success"
        })
      }else{
        wx.showToast({
          title: res.message,
          icon: "success"
        })
      }
    })
  },
  weDynamicCommentThumbUp(e){
    let { id, thumbup } = e.currentTarget.dataset,
      params = { commentId: id, thumbUp: !thumbup };
    apiAction.weDynamicCommentThumbUp(params).then(res => {
      if (res.success) {
        this.refresh();
      } else {
        wx.showToast({
          title: res.message,
          icon: "success"
        })
      }
    })
  }
})