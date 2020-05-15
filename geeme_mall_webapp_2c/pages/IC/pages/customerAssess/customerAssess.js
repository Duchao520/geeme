var apiAction = null, util = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandId: null,
    pageNum: 1,
    pageSize: 10,
    SWITCHER: true,
    brandRate: null,
    brandScore: null,
    brandTotal: null,
    total: null,
    staffAssessmentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();

    app.getBrand(brand => {
      this.data.brandId = brand.brandId;
      this.weGetStoreAssessmentList().then(res => {
        this.setData(res)
      })
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    apiAction = null;
    util = null;
    app = null;
    this.data = null;

  },

  onReachBottom(){
    this.weGetStoreAssessmentList('nextPage').then(res => {
      this.setData(res);
    })
  },

  weGetStoreAssessmentList(type="firstPage"){
    let { brandId, pageNum, pageSize, SWITCHER, staffAssessmentList} = this.data;
    if(!SWITCHER) return Promise.resolve({});
    
    if(type == 'firstPage'){
      pageNum = 1;
      this.data.pageNum = 1;
    }else{
      pageNum++;
      this.data.pageNum = pageNum;
    }
    let params = {
      brandId, pageNum, pageSize
    }
    this.data.SWITCHER = false;
    return apiAction.getStoreAssessmentList(params).then(res => {
      this.data.SWITCHER = true;
      if(type == 'firstPage'){
        staffAssessmentList = res.staffAssessmentList;
        staffAssessmentList.length >= res.total ? this.data.SWITCHER = false : this.data.SWITCHER = true;
        return {
          brandRate: res.brandRate,
          brandScore: res.brandScore,
          brandTotal: res.brandTotal,
          staffAssessmentList: res.staffAssessmentList,
          total: res.total
        }
      }else{
        staffAssessmentList = staffAssessmentList.concat(res.staffAssessmentList);
        staffAssessmentList.length >= res.total ? this.data.SWITCHER = false : this.data.SWITCHER = true;
        return {
          staffAssessmentList: staffAssessmentList
        }
      }
    })
  }
    
})