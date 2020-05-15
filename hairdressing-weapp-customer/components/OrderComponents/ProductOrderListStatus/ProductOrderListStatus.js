// components/OrderComponents/ProductOrderListStatus/ProductOrderListStatus.js
Component({
  properties: {
    state:String
  },
  data: {
    info:null,
    stateObj:{
      WAITING_PAY:'待付款',
      WAITING_DELIVER:'待发货',
      WAITING_CONFIRM:'待收货',
      WAITING_ASSESSMENT:'待评价',
      FINISHED:'已完成',
      GROUP_BUY_WAIT:'待拼单',
    }
  }
})
