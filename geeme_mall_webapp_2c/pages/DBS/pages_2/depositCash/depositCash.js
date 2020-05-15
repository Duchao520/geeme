var apiAction = null,
  util = null,
  app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statistics: null, //保证统计信息
    shareholderId: null,
    recordList: [],
    queryParams: {
      currentPage: 0,
      pageSize: 10,
      shareholderId: null
    },
    logo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    this.data.shareholderId = wx.$takeNotNull('shareholderId');
    this.data.queryParams.shareholderId = this.data.shareholderId;
    util.PromiseAll([
      this.weGetShareholderSecurityFundChangeRecordList(),
      this.weGetSecurityFundStatistics()
    ]).then(res => {
      this.setData(res)
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    apiAction = null;
    util = null;
    app = null;
  },


  /**
   * 获取保证统计信息
   */
  weGetSecurityFundStatistics() {

    return apiAction.weGetSecurityFundStatistics({
      shareholderId: this.data.shareholderId
    }).then(res => {
      return {
        statistics: res
      }
    })
  },

  onPullDownRefresh(){
    this.weGetShareholderSecurityFundChangeRecordList('firstPage').then(res => {
      wx.stopPullDownRefresh();
      this.setData(res);
    })
  },

  onReachBottom(){
    this.weGetShareholderSecurityFundChangeRecordList('nextPage').then(res => {
      this.setData(res);
    })
  },

  /**
   * 股东保证金变动记录分页查询
   */
  weGetShareholderSecurityFundChangeRecordList(type = 'firstPage') {
    let {
      queryParams,
      recordList
    } = this.data;
    if (type == 'firstPage') {
      queryParams.currentPage = 0;
      recordList = [];
      this.setData({ recordList: []});
    } else {
      queryParams.currentPage++;
    }
    this.data.queryParams = queryParams;
    return apiAction.weGetShareholderSecurityFundChangeRecordList(queryParams).then(res => {
      if (res.recordInfoForPagedList) {
        //生成日期头
        let dateHeadArr = res.recordInfoForPagedList.map(ele => {
          return ele.year
        });
        //去重
        let dateHeadSet = new Set(dateHeadArr);
        dateHeadArr = Array.from(dateHeadSet).map(ele => {
          let recordFilter = recordList.filter(record => ele == record.dateHead);
          if (recordFilter.length == 0) {
            return {
              dateHead: ele,
              RecordInfoList: []
            }
          }
        })

        //连接新获取的日期头，比对数据日期头，重组数据
        recordList = recordList
          .concat(dateHeadArr)
          .map(record => {
            let dateRecordList = res.recordInfoForPagedList.filter(ele => record.dateHead == ele.year);
            record.RecordInfoList = record.RecordInfoList.concat(dateRecordList);
            return record;
          });
        return {recordList}
      }else{
        return {}
      }
    })

  }
})