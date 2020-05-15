import { Page } from '/util/ix';
var app = getApp();
Page({
  data: {
    pageNum: 0,
    pageSize: 10,
    lastCreateTimeStr: '',
    dateTitle: [],
    orderList: [],
    dateList: [],
    scrollTop: 0,
    payWay:['','支付宝','微信','银行卡','','','现金'],
    DATE_HEAD_INDEX: 0    //日期头位置
  },
  onKeyPress(r){
    switch (r.keyCode) {
        case 133:
          my.reLaunch({url: '/pages/index/index',});
          break
      }
  },
  onLoad(){
    var _self = this;
    _self.getOrderList();
  },
  onReady() {
    var _self = this;
  },
  getOrderList(){
    var _self = this , _data , dateList , orderList , dateTitle;
    _self.setData({
      pageNum: _self.data.pageNum + 1
    })
    _data = {
      token: app.store.token.getStore().data,
      pageNum: _self.data.pageNum,
      pageSize: _self.data.pageSize,
      lastCreateTimeStr: _self.data.lastCreateTimeStr
    };
    app.API.order(_data).then(res => {
      if(res.state == 1){
        dateList = _self.data.dateList.concat(res.orderHeaders);
        orderList = _self.data.orderList.concat(res.data);
        _self.setData({
          dateList: dateList,
          orderList: orderList,
          lastCreateTimeStr: dateList[dateList.length-1].createTimeStr
        });
        my.createSelectorQuery()
            .selectAll('.dateTitle').boundingClientRect().exec((ret) => {
              dateTitle = ret[0];
              dateTitle.forEach(ele => {
                ele.top += _self.data.scrollTop
              })
              _self.setData({
                dateTitle: dateTitle
              })  
            }) 
      }
    })
  },
  onPageScroll(scroll){
    var _self = this,
        scrollTop = scroll.scrollTop;
        _self.setData({
          scrollTop: scrollTop
        })
        _self.data.dateTitle.forEach((ele,index) => {
          if(scrollTop > ele.top)
            _self.setData({
              DATE_HEAD_INDEX: index
            })
        })
  },
  //翻页
  onReachBottom() {
    var _self = this;
    _self.getOrderList();
  },
});
