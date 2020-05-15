// components/OrderComponents/GroupOrder_Button/GroupOrder_Button.js
const apiAction = require('../../../utils/apiAction.js')
const util = require('../../../utils/util.js')
Component({
  lifetimes: {
    attached() {
      const pageName = this.$getCurPageName()
      let type, id, orderId
      if (pageName == 'productOrderList' || pageName == 'productOrderDetail') {
        type = 'goods'
        id = this.data.info.productId
      } else {
        type = 'service'
        id = this.data.info.serviceInfoForOrder ? this.data.info.serviceInfoForOrder.serviceId : this.data.info.serviceInfo.serviceId
      }
      this.type = type
      this.id = id
    }
  },
  properties: {
    info: Object
  },
  data: {
    ifPopShare: false,
    remainTime:0,
    hour:0,
    minute:0,
    second:0,
  },
  observers: {
    'remainTime'(n) {
      let hour = parseInt(n / 3600)
      let minute = parseInt(n / 60) - hour * 60
      let second = n - hour * 3600 - minute * 60
      this.setData({
        hour,
        minute,
        second,
      })
    },
    'ifPopShare'(n){
      if(!n){
        clearTimeout(this.t)
      }
    }
  },
  methods: {
    showShare() {
      this.setData({
        ifPopShare: true
      })
      apiAction.getRemainTime(this.data.info.id, this.type, 'GROUP_BUY_WAIT').then( data => {
        this.data.remainTime = parseInt(data.remainMillisTime / 1000)
        this.getRemainTime(true)
      })
    },
    // 倒计时
    getRemainTime(isInit) {
      const remainTime = isInit ? this.data.remainTime : --this.data.remainTime
      this.setData({
        remainTime
      })
      if (remainTime <= 0) return
      this.t = setTimeout(this.getRemainTime.bind(this), 1000)
    },
    // 生成画报
    sharePic() {
      let promise

      let path = `/pages/IC/pages/productdetails/productdetails?productId=${this.id}`
      if (this.type == 'goods') {
        // 产品详情接口
        promise = apiAction.getSimpleProductInfo(this.id)
        path += '&isProduct=1'
      } else {
        // 服务详情接口
        promise = apiAction.getServiceInfo(this.id)
      }
      promise.then(product => {
        this.$place('pic', {
          type: this.type,
          info: {
            goodsId: product.productId || product.serviceId,
            score: product.avgScore,
            title: product.title || product.serviceFullTitle,
            shopName: product.name || product.shopName,
            city: product.shopCity || product.city,
            price: product.packageList ? product.packageList[0].specialPrice : product.weProductSpecifications[0].memberPrice,
            image: product.cycleImage ? product.cycleImage[0] : product.productImage[0],
            path,
          }
        })
        this.$route('/pages/IC/pages/sharePic/sharePic')
        // 避免手机卡顿做个500ms延时
        setTimeout(() => {
          this.$setData({
            ifPopShare: false
          })
        }, 500)
      })
    },
    prevent() {}
  }
})