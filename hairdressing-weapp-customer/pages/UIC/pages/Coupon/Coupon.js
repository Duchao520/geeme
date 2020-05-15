// pages/UIC/pages/Coupon/Coupon.js
var apiAction = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['未使用','已使用','已过期'],
    customerCouponStatus: ['UN_USE', "USED","INVALID"],
    currentTab: 0,
    queryParams: {
      customerCouponStatus: "UN_USE",
      pageNum: 1,
      pageSize: 10
    },
    CustomerCouponInfoList: [],
    Request_Switcher: true,
    total: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    this.getBrandCustomerCoupons();
  },
  onUnload() {          //清内存
    apiAction = null;
    this.data = null;
  },
  onReachBottom(){
    this.getBrandCustomerCoupons("nextPage");
  },
  switchTab(current){
    let {index} = current.detail;
    this.setData({
      currentTab: index,
      CustomerCouponInfoList: [],
      total: null
    });
    this.getBrandCustomerCoupons('firstPage');
  },
  getBrandCustomerCoupons(page = "firstPage"){
    let { queryParams, Request_Switcher, customerCouponStatus, currentTab, CustomerCouponInfoList} = this.data;
    if (!Request_Switcher) return;
    this.setData({
      Request_Switcher: false
    })
    queryParams.customerCouponStatus = customerCouponStatus[currentTab];
    if(page == "firstPage"){
      queryParams.pageNum = 1;
    }else{
      if (this.data.total <= CustomerCouponInfoList.length) return;
      queryParams.pageNum++;
    }
    apiAction.getBrandCustomerCoupons(queryParams).then(res => {
      let {customerCouponInfoList,total} = res;
      CustomerCouponInfoList = CustomerCouponInfoList.concat(customerCouponInfoList);
      let render = {
        queryParams,
        CustomerCouponInfoList,
        Request_Switcher: true,
        total
      };
      this.setData(render);
    })
  }
})