// components/OrderComponents/ProductOrderListButtons/ProductOrderListButtons.js
const apiAction = require('../../../utils/apiAction.js')
const app = getApp()
Component({
  properties: {
    info: Object
  },
  methods: {
    cancel() {
      wx.showModal({
        title: '提示',
        content: '是否取消订单？',
        success: res => {
          if (res.confirm) {
            apiAction.cancelProductOrder(this.data.info.id).then(data => {
              if (data.success) {
                wx.$event.emit('orderCancel', {
                  id: this.data.info.id
                })
              }
            })
          }
        }
      })
    },
    pay() {
      const info = this.data.info
      app.globalData.bill.type = 'goods'
      app.globalData.bill.info = {
        billNo: info.billNo,
        totalCharge: info.totalPrice,
        title: info.title,
        count: info.amount,
        storeId: info.storeId,
        finalTotalCharge: info.received,
        billingType:info.prepaidCardId ? 1 : 0,
        customerCardId:info.prepaidCardId
      }
      this.$route('/pages/TC/pages/orderpay/orderpay')
    },
    refund() {
      const info = this.data.info

      const flag1 = info.refund && (info.orderStatus == 'WAITING_DELIVER' || info.orderStatus == 'WAITING_CONFIRM')
      const flag2 = info.afterSale && (info.orderStatus == 'WAITING_ASSESSMENT' || info.orderStatus == 'FINISHED')
      if (flag1 || flag2){
        this.$route('/pages/IC/pages/refundList/refundList')
      }else {
        this.$route('/pages/RC/pages/applyrefund/applyrefund', {
          orderId: this.data.info.id,
          isProduct: 1
        })
      }
    },
    confirm() {
      wx.showModal({
        title: '提示',
        content: '是否确认收货？',
        success: res => {
          if (res.confirm) {
            apiAction.productOrderConfirmReceived(this.data.info.id).then(data => {
              if (data.success) {
                wx.$event.emit('orderConfirm', {
                  id: this.data.info.id
                })
              }
            })
          }
        }
      })
    },
    // 评价
    evaluate() {
      this.$route('/pages/RC/pages/evaluation/evaluation', {
        info: JSON.stringify(this.data.info),
        isProduct: 1
      })
    }
  }
})