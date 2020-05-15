// pages/SC/hairdetails/hairdetails.js
var apiAction = null, util = null, app = null, myUtil = null;
Page({
  data: {
    tabList: ["简介", "服务", "作品", "评价", "相册"],
    show: 0,
    isFixed: false,
    // 具体参数
    shopId: 0,
    hairId: 0,
    userId: 0,
    // 发型师信息数据结构
    staffInfo: {},
    //服务数据结构
    likeList: [],
    // 作品信息
    worksInfo: {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      flag: false,
    },
    // 评价信息
    assessmentInfo: {
      avgScore: 0,
      list: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tags: [],
      tagId: -2, //当前选中的tag的id,
      flag: false,
      ifShowDefault: false,
    },
    scrollTop: null,
    isFixed: false,
    sharePic: null,
    sharePic: null,
    ifShowSharePop: false
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    myUtil = require('../../../../utils/myUtil.js')
    app = getApp();
    if (options.scene) {
      const obj = util.sceneToJson(options.scene)
      this.data.hairId = obj.staffId
    } else {
      this.data.hairId = options.hairId
    }

    if (options.tabIndex) {
      const tabIndex = Number(options.tabIndex)
      this.$setData({
        show: tabIndex
      })
    }

    this.getStaffInfo(this.data.hairId)
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    app = null;
    myUtil = null;
    this.data = null;
  },
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  onShareAppMessage(){
    let {staffInfo} = this.data,title,userInfo = wx.$getStorage('userInfo');
    if(userInfo){
      title = `${userInfo.nickName}向你推荐:${staffInfo.name}  ${staffInfo.levelName}-${staffInfo.sign ? staffInfo.sign : ''}`
    }else{
      title = `向你推荐:${staffInfo.name}  ${staffInfo.levelName}-${staffInfo.sign ? staffInfo.sign : ''}`
    }
    return{
      title: title,
      imageUrl: this.data.sharePic
    }
  },
  serverPic(){
    let ctx = wx.createCanvasContext('serverPic'),
        {staffInfo} = this.data;

    myUtil.serverSharePic(ctx, staffInfo.score, staffInfo.appointmentMount, staffInfo.worksMount, staffInfo.avatar).then(res => {
      this.data.sharePic = res;
    })
  },
  showShareModal(){
    this.$setData({ ifShowSharePop: true})
  },
  changeFix(e) {
    this.setData({
      isFixed: e.detail
    })
  },
  // 获取服务者详情
  getStaffInfo(hairId) {
    apiAction.getWeStaffDetail(hairId).then(data => {
      this.data.staffInfo = data;
      this.data.userId = data.userId
      // 若初始tabIndex不等于0，则请求对应接口
      if (this.data.show != 0) {
        this.switchTab(null, this.data.show).then(res => {
          Object.assign(res, {staffInfo: data});
          this.setData(res);
        })
      }else{
        this.setData({staffInfo: data});
        this.serverPic();
      }
    })
  },
  // 切换tab
  switchTab(e, tabIndex) {
    let index = e ? e.detail.index : tabIndex,
        type = e ? e.type : null;
    if(index == this.data.show && type){
      return Promise.resolve({})
    }else{
      return this.switchRequest(index).then(res => {
        Object.assign(res, {
          show: index
        })
        if (type == "switchTab"){
          this.setData(res);
        }else{
          return res
        }
      })
    }
  },
  switchRequest(index){
    let staffInfo = this.data.staffInfo;
    switch (index) {
      // 服务
      case 1:
        return this.getStaffService(staffInfo.levelId, staffInfo.shopId)
      // 作品
      case 2:
        if (!this.data.worksInfo.list.length) {
          return this.getDynamic4StaffHomePage()
        } else {
          return Promise.resolve({});
        }
        break;
      // 评价
      case 3:
        if (!this.data.assessmentInfo.list.length) {
          return util.PromiseAll([this.getAssessmentList(), this.getAssessmentTags()])
        } else {
          return Promise.resolve({});
        }
        break;
      default:
        return Promise.resolve({});
    }
  },
  /**
   * 请求发型师服务信息
   */
  getStaffService(levelId, storeId) {
    return apiAction.getServiceListByStoreIdAndLevelId(storeId, levelId).then(data => {
      let serviceInfos = data.serviceInfos;
      serviceInfos = serviceInfos.map(v => {
        v.productImage = v.productImage.map(v => {
          v = util.imageUrl + v
          return v
        })
        return v
      })
      return {
        likeList: serviceInfos
      }
    })
  },

  // 获取作品
  getDynamic4StaffHomePage() {
    const params = {
      currentPage: this.data.worksInfo.currentPage,
      pageSize: this.data.worksInfo.pageSize,
      userId: this.data.userId
    }
    return apiAction.getDynamic4StaffHomePage(params).then(data => {
      return {
        'worksInfo.list': data.weSimpleDynamicList ? this.data.worksInfo.list.concat(data.weSimpleDynamicList) : this.data.worksInfo.list,
        'worksInfo.total': data.total,
        'worksInfo.flag': false
      }
    })
  },

  // 获取评价列表
  getAssessmentList() {
    const {
      pageNum,
      pageSize,
      tagId
    } = this.data.assessmentInfo
    const params = {
      pageNum,
      pageSize,
      tagId,
      serverId: this.data.hairId,
      serverUserId: this.data.userId
    }
    // 评价列表
    wx.showLoading()
    return apiAction.getStaffAssessmentList4StaffHomePage(params).then(data => {
      wx.hideLoading()
      this.data.assessmentInfo.flag = false
      if (data.total == 0) {
        return {
          'assessmentInfo.ifShowDefault': true
        }
      } else {
        let list = pageNum == 1 ? data.staffAssessmentList : this.data.assessmentInfo.list.concat(data.staffAssessmentList)
        return {
          'assessmentInfo.list': list,
          'assessmentInfo.avgScore': data.avgScore,
          'assessmentInfo.total': data.total,
          'assessmentInfo.ifShowDefault': false
        }
      }
    })
  },

  // 获取评价标签统计
  getAssessmentTags() {
    // 标签统计
    return apiAction.getStaffAssessmentTagCount(this.data.userId).then(data => {
      if (data.tagCounts[0].num == 0) {
        return {
          'assessmentInfo.ifShowDefault': true
        }
      } else {
        return {
          'assessmentInfo.tags': data.tagCounts
        }
      }
    })
  },

  // 切换当前评价tagId
  changeTagId(e) {
    this.$setData({
      'assessmentInfo.tagId': e.currentTarget.dataset.id,
      'assessmentInfo.pageNum': 1,
      'assessmentInfo.list': []
    })
    this.getAssessmentList().then(res => {
      let renderData = Object.assign({
        'assessmentInfo.tagId': e.currentTarget.dataset.id,
        'assessmentInfo.pageNum': 1,
        'assessmentInfo.list': []
      },res);
      this.setData(renderData);
    })
  },

  /**
   * 点击服务事件
   */
  clickGetLike(e) {
    wx.navigateTo({
      url: '/pages/IC/pages/productdetails/productdetails?productId=' + e.detail
    })
  },

  /**
   * 添加预约
   */
  addAppointment(e) {
    wx.removeStorageSync('appointment')
    let staffId = this.data.staffInfo.id;
    let storeId = this.data.staffInfo.shopId;
    if (util.addhair(staffId, storeId)) {
      this.$route('/pages/TC/pages/choosetime/choosetime')
    }
  },
  // 关注
  follow() {
    wx.$showLoading()
    const {
      focus,
      userId
    } = this.data.staffInfo
    const params = {
      attentive: !focus,
      beAttentiveUserId: userId
    }

    apiAction.weDynamicAttentive(params).then(data => {
      wx.$hideLoading()
      if (data.success) {
        this.$setData({
          'staffInfo.focus': !focus
        })
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  onReachBottom() {
    let info
    switch (this.data.show) {
      case 2:
        info = this.data.worksInfo
        if (info.currentPage * info.pageSize >= info.total) {
          return
        }
        if (info.flag) return
        info.flag = true
        info.currentPage++;
        this.getDynamic4StaffHomePage().then(res => {
          this.setData(res);
        })
        break;
      case 3:
        info = this.data.assessmentInfo
        if (info.pageNum * info.pageSize >= info.total) {
          return
        }
        if (info.flag) return
        info.flag = true
        info.pageNum++;
        this.getAssessmentList().then(res => {
          this.setData(res);
        })
        break;
    }
  },
  navigateToPic(){
    wx.$place('info',this.data.staffInfo);
    wx.$route("/pages/SC/pages/hairPic/hairPic")
  }
})