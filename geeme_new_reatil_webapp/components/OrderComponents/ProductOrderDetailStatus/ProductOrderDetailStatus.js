// components/appointmentStatus/appointmentStatus.js
const apiAction = require('../../../utils/apiAction.js')
Component({
  lifetimes: {
    attached() {
      // 服务订单详情
      if (this.$getCurPageName() === 'orderDetail'){
        if(this.data.info.status === 'WAITING_PAY'){
          this.data.remainTime = this.data.info.payTimeOutRest
          this.getRemainTime(true)
        } else if (this.data.info.status === 'WAITING_SERVICE' && this.data.info.appointTime) {
          const timestamp_appointment = Date.parse(this.data.info.appointTime)
          const timestamp_now = Date.parse(new Date())
          this.data.remainTime = parseInt((timestamp_appointment - timestamp_now)/1000)
          this.getRemainTime(true)
        } else if (this.data.info.status === 'GROUP_BUY_WAIT'){
          const {id, status} = this.data.info
          apiAction.getRemainTime(id, 'service', status).then( data => {
            this.data.remainTime = parseInt(data.remainMillisTime / 1000)
            this.getRemainTime(true)
          })
        }
      // 产品订单详情
      } else if (this.$getCurPageName() === 'productOrderDetail'){
        const { id, orderStatus} = this.data.info
        apiAction.getRemainTime(id, 'goods', orderStatus).then( data => {
          if (this.data.info.orderStatus === 'WAITING_PAY') {
            this.data.remainTime = parseInt(data.remainMillisTime / 1000)
            this.getRemainTime(true)
          } else if (this.data.info.orderStatus === 'WAITING_CONFIRM') {
            this.getRemainTime2(parseInt(data.remainMillisTime / 1000))
          } else if (this.data.info.orderStatus === 'GROUP_BUY_WAIT'){
            this.data.remainTime = parseInt(data.remainMillisTime / 1000)
            this.getRemainTime(true)
          }
        })
      }
    }
  },
  properties: {
    // true:产品 false:服务
    isProduct: {
      type: Boolean,
      value: false
    },
    info: Object
  },
  data: {
    status: {},
    productObj: {
      WAITING_PAY: '待付款',
      WAITING_DELIVER: '待发货',
      WAITING_CONFIRM: '待收货',
      WAITING_ASSESSMENT: '待评价',
      FINISHED: '已完成',
      GROUP_BUY_WAIT:'待拼单',
    },
    serviceObj: {
      WAITING_PAY: '待付款',
      WAITING_SERVICE: '待服务',
      WAITING_ASSESSMENT: '待评价',
      COMPLETED: '已完成',
      CLOSED:'已关闭',
      GROUP_BUY_WAIT:'待拼单',
    },
    remainTime: 0,
    day:0,
    hour: 0,
    minute: 0,
    second: 0,
    remainTime2Str:'',
  },
  observers: {
    'remainTime' (n) {
      let hour = parseInt(n / 3600)
      let minute = parseInt(n / 60) - hour * 60
      let second = n - hour * 3600 - minute * 60
      this.setData({
        hour: hour >= 0 ? hour : 0,
        minute: minute >= 0 ? minute : 0,
        second: second >= 0 ? second : 0,
      })
    },
  },
  methods: {
    // 待付款状态的付款倒计时，实时变化
    getRemainTime(isInit) {
      const remainTime = isInit ? this.data.remainTime : --this.data.remainTime
      this.setData({
        remainTime
      })
      if (remainTime <= 0) return
      setTimeout(this.getRemainTime.bind(this), 1000)
    },
    // 待收货状态的自动确认收货倒计时，不变
    //@time {Number} - 单位秒
    getRemainTime2(time){
      let day = parseInt(time / 86400)
      let hour = parseInt(time / 3600) - day * 24
      let minute = parseInt(time / 60) - day * 1440 - hour * 60
      this.$setData({
        day,
        hour,
        minute
      })
    }
  }
})