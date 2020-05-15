// pages/UIC//pages/equityDetails/equityDetails.js
var apiAction = require('../../../../utils/apiAction.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    // 顶部吸附相关
    scrollTop: null,
    isFixed: false,
    brandCustomerId: '',
    brandId: '',
    storePreMoneyList: [],    //门店收益明细列表
    STORE_LIST_SHOW: true,
    queryParamStore: {
      brandCustomerId: '',
      brandId: ''
    },
    queryParams: {
      brandCustomerId: '',
      searchType: null,
      storeId: null,
      pageNum: 1,
      pageSize: 10
    },
    // 权益金部分
    recordTotal: null,             //明细总数
    requestSwitcher: true,         //请求控制器
    RecordList: [],                 //合并日期头记录
    DateHeadList: [],               //日期头
    RecordInfoList: [],              //记录
    tabs: ['全部', '全部'],
    activeTab: -1,
    storeInfoList: ['全部'],    // 获取门店列表
    sortStores: ['全部'],       // 门店数组列表
    // storeId: null,
    sortMethods: ['全部', '转出到钱包', '转出到银行卡', '推广佣金', '推广邀请奖励', '礼品卡奖励', '拼团奖励', '股东介绍费', '股东分红', '推广撤单', '返还保证金', '分红回退', '介绍费回退', '返还保证金回退'],
    // index: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success(res) {
        console.log(res) // 获取可使用窗口高度
        //将高度乘以换算后的该设备的rpx与px的比例
        let windowHeight = (res.windowHeight * (750 / res.windowWidth));
        // console.log(windowHeight) //最后获得转化后得rpx单位的窗口高度
        that.setData({
          windowHeight
        })
      }
    })
    // console.log(options)
    this.data.queryParams.brandCustomerId = options.brandCustomerId
    this.data.queryParamStore.brandCustomerId = options.brandCustomerId
    this.data.queryParamStore.brandId = options.brandId
    // 权益门店列表
    this.getStoreList()
    // 权益金明细
    this.getAccountRecordList()
    // 门店收益明细
    this.weGetPreMoney()
  },
  // 权益门店列表
  getStoreList() {
    const { brandCustomerId } = this.data.queryParamStore
    let params = {
      brandCustomerId
    }
    return apiAction.getStoreList(params).then(res => {
      // console.log(res)
      if (res.storeInfoList == null) return
      let sortStores = ['全部'];
      for (let i in res.storeInfoList) {
        // console.log(i)
        // console.log(res.storeInfoList[i].storeName)
        sortStores.push(res.storeInfoList[i].storeName)
      }
      this.$setData({
        sortStores,
        storeInfoList: res.storeInfoList
      })
    })
  },
  // 权益金明细
  getAccountRecordList(next = 'firstPage') {
    let { queryParams, DateHeadList, RecordList, requestSwitcher, recordTotal } = this.data;
    if (!requestSwitcher) return;
    this.setData({
      requestSwitcher: false
    })
    if (next == 'firstPage') {
      queryParams.pageNum = 1;
    } else {
      if (recordTotal <= RecordList.length) return;
      queryParams.pageNum++;
    }
    return apiAction.getAccountRecordList(queryParams).then(res => {
      // console.log(res)
      if (res.recordList == null) return
      let { dateHeadSet, recordList, total } = res;
      DateHeadList = DateHeadList.concat(dateHeadSet);
      RecordList = RecordList.concat(recordList);
      let DateHeadSet = [...new Set(DateHeadList)],          //去重
        renderData = { queryParams, requestSwitcher: true, recordTotal: total };
      this.assignRecord(DateHeadSet, RecordList, renderData);
    })
  },
  //数据按日期头分组
  assignRecord(DateHeadList, RecordList, renderData) {
    // console.log(RecordList)
    let RecordInfoList = DateHeadList.map(dateHead => {
      let recordObj = {};
      recordObj.dateHead = dateHead;
      recordObj.RecordList = RecordList.filter(record => {
        if (dateHead == record.dateHead) {
          return record;
        }
      });
      return recordObj
    });
    Object.assign(renderData, { DateHeadList, RecordList, RecordInfoList })
    this.setData(renderData);
  },
  // 门店收益明细
  weGetPreMoney() {
    // console.log(this.data)
    const { brandCustomerId, brandId } = this.data.queryParamStore
    let params = {
      brandCustomerId,
      brandId,
      pageNum: 0,
      pageSize: 10
    }
    return apiAction.weGetPreMoney(params).then(res => {
      this.$setData({
        storePreMoneyList: res.storePreMoneyList,
        STORE_LIST_SHOW: res.storePreMoneyList === null || res.storePreMoneyList.length == 0 ? false : true
      })
    })
  },
  // 跳转品牌门店权益金列表
  onTapMoreStore() {
    this.$route("/pages/UIC/pages/equityStore/equityStore", this.data.queryParamStore)
  },
  // 改变吸附状态
  changeFix(e) {
    this.setData({
      isFixed: e.detail
    })
  },
  // 选择弹框
  popup(e) {
    // console.log(e)
    const index = e.detail.index
    this.$setData({
      activeTab: index
    })
  },
  // 选择门店
  selectStore(e) {
    // console.log(e)
    this.data.pageNum = 0;
    this.data.queryParams.storeId = e.detail.index === 0 ? null : this.data.storeInfoList[e.detail.index - 1].storeId
    this.setData({
      'tabs[0]': e.detail.item,
      activeTab: -1,
      recordTotal: null,             //明细总数
      requestSwitcher: true,         //请求控制器
      RecordList: [],                 //合并日期头记录
      DateHeadList: [],               //日期头
      RecordInfoList: [],              //记录
    })
    this.getAccountRecordList('firstPage');
  },
  // 选择类型
  selectSort(e) {
    // console.log(e)
    this.data.pageNum = 0;
    this.data.queryParams.searchType = e.detail.index === 0 ? null : e.detail.index
    this.setData({
      'tabs[1]': e.detail.item,
      activeTab: -1,
      recordTotal: null,             //明细总数
      requestSwitcher: true,         //请求控制器
      RecordList: [],                 //合并日期头记录
      DateHeadList: [],               //日期头
      RecordInfoList: [],              //记录
    })
    this.getAccountRecordList('firstPage');
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getAccountRecordList('nextPage');
  },
  // 监听屏幕滚动
  onPageScroll(e) {
    this.$setData({
      scrollTop: e.scrollTop
    })
  },
})