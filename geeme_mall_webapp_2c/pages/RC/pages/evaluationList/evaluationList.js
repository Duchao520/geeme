// pages/RC/pages/evaluationDetail/evaluationDetail.js
const apiAction = require('../../../../utils/apiAction.js')
Page({
  $name:'evaluationList',
  data: {
    goodsType:'service',// Enum ['production', 'service']
    goodsId:0,
    // 加载更多
    pageNum:1,
    pageSize:10,
    total:0,
    flag:false,
    // tag
    tagId:-2, // 当前选中tag.-2：全部 -1：有图
    tags:null,  // 标签列表,
    TAG_SWITCHER: false,
    // 评价列表
    assessmentList:[],
    assessmentNum:0,
  },
  onLoad(options) {
    if(options.isProduct){
      this.data.goodsType = 'production'
    }
    this.data.goodsId = options.goodsId
    this.$setData({
      avgScore: options.avgScore,
      goodAssessmentRate: options.goodAssessmentRate,
      assessmentNum: options.assessmentNum
    })
    this.fetchTags()
    this.fetchAssessments()
  },
  switchTagEvent(){
    this.$setData({
      TAG_SWITCHER: !this.data.TAG_SWITCHER
    })
  },
  switchTag(e){
    const id = e.currentTarget.dataset.id
    this.$setData({
      tagId:id,
      pageNum:1,
      assessmentList:[],
    })
    this.fetchAssessments()
  },
  // 请求标签信息
  fetchTags(){
    apiAction.getAssessmentTagCount4GoodsDetail(this.data.goodsId, this.data.goodsType).then( data => {
      let tags = data.tagCounts.filter(ele => ele.num > 0)
      this.$setData({
        tags: tags
      })
    })
  },
  // 请求评价列表
  fetchAssessments(){
    const {goodsId, goodsType, pageNum, pageSize, tagId} = this.data
    const params = {
      goodsId,
      goodsType,
      pageNum,
      pageSize,
      tagId
    }
    apiAction.getAssessment4GoodsDetail(params).then( data => {
      this.$setData({
        assessmentList:this.data.assessmentList.concat(data.goodsOrderAssessmentInfos),
        total:data.total
      })
    })
  },
  /**
   * 跳转评价详情
   */
  jumpEvaluationDetail(){
    wx.navigateTo({
      url: '/pages/RC/pages/evaluationDetail/evaluationDetail'
    })
  },

  // 页面上拉触底事件的处理函数
  onReachBottom() {
    if(this.data.pageNum * this.data.pageSize >= this.data.total) return
    if(this.data.flag) return
    this.data.flag = true
    this.data.pageNum++
    this.fetchAssessments()
  },
})