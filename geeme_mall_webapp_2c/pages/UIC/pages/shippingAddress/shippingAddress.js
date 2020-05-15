// pages/UIC//pages/shippingAddress/shippingAddress.js
const getAddressList = require('../../../../utils/apiAction.js').shippingAddressList4Customer
Page({
  data: {
    list: null,
    showSelect: false,
    selectedAddress: null,
  },
  onLoad(options) {
    if (options.from == 'order') {
      this.setData({
        showSelect: true,
        selectedAddress: JSON.parse(options.address)
      })
    }
  },
  onShow() {
    this.fetch()
  },
  fetch() {
    wx.$showLoading()
    getAddressList().then(data => {
      wx.$hideLoading()
      if (this.data.showSelect && this.data.selectedAddress && data.addressInfoList && data.addressInfoList.length){
        // 担心已选中的地址有改变，重新发布事件
        for (const v of data.addressInfoList) {
          if (v.id == this.data.selectedAddress.id) {
            wx.$event.emit('selectAddress', v)
            break
          }
        }
      }
      
      this.$setData({
        list: data.addressInfoList
      })
    })
  },
  jumpEdit(e) {
    if (e.currentTarget.dataset.id) {
      this.$route('/pages/UIC/pages/shippingAddress_edit/shippingAddress_edit', {
        id: e.currentTarget.dataset.id
      })
    } else {
      this.$route('/pages/UIC/pages/shippingAddress_edit/shippingAddress_edit')
    }
  },
  selectAddress(res) {
    this.$setData({
      selectedAddress: res.detail
    })
    wx.$event.emit('selectAddress', res.detail)
  }

})