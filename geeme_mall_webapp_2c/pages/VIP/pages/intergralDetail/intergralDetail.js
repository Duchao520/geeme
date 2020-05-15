// pages/UIC/pages/Wallet/Wallet.js
var apiAction = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryParams: {
      currentPage: 1,
      pageSize: 10
    },
    recordTotal: null,             //明细总数
    requestSwitcher: true,         //请求控制器
    recordList: [],                 //合并日期头记录
    DateHeadList: [],               //日期头
    RecordInfoList: []              //记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    this.weGetWalletMoneyRecord();
  },
  onUnload() {          //清内存
    apiAction = null;
    this.data = null;
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.weGetWalletMoneyRecord('nextPage');
  },



  //请求
  weGetWalletMoneyRecord(next = 'firstPage') {
    let { queryParams, DateHeadList, RecordInfoList, requestSwitcher, recordTotal } = this.data;
    if (!requestSwitcher) return;
    this.setData({
      requestSwitcher: false
    })
    if (next == 'firstPage') {
      queryParams.currentPage = 1;
    } else {
      if (recordTotal <= RecordInfoList.length) return;
      queryParams.currentPage++;
    }
    apiAction.getBrandCustomerIntegralRecordApiPage(queryParams).then(res => {
      let { dateHeadList, recordApiList, total } = res;
      recordApiList.forEach(ele => {
        let desSplit = ele.description.split('#');
        ele.name = desSplit[0];
        ele.order = desSplit[1];
      })
      DateHeadList = DateHeadList.concat(dateHeadList);
      RecordInfoList = RecordInfoList.concat(recordApiList);
      let DateHeadSet = [...new Set(DateHeadList)],          //去重
        renderData = { queryParams, requestSwitcher: true, recordTotal: total };
      this.assignRecord(DateHeadSet, RecordInfoList, renderData);
    })
  },

  //数据按日期头分组
  assignRecord(DateHeadList, RecordInfoList, renderData) {
    let recordList = DateHeadList.map(dateHead => {
      let recordObj = {};
      recordObj.dateHead = dateHead;
      recordObj.RecordInfoList = RecordInfoList.filter(record => {
        if (dateHead == record.dateHead) {
          return record;
        }
      });
      return recordObj
    });
    Object.assign(renderData, { DateHeadList, RecordInfoList, recordList })
    this.setData(renderData);
  }
})
