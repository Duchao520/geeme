// pages/UIC//pages/salaryTable/salaryTable.js
const util = require('../../../../utils/util.js')
const pageTitle = {
  service:'劳动业绩',
  product:'产品业绩',
  card:'售卡业绩',
}
Page({
  data: {
    tabList: ['全部', '剪发', '烫发', '染发', '造型', '护理',],
    activeDate:null,
    dateBegin: null,
    dateEnd: null,
  },
  onLoad(options) {
    this.$setData({
      type:options.type
    })
    wx.setNavigationBarTitle({
      title: '业绩报表-' + pageTitle[options.type],
    })

    const today = util.getCurrentDate()
    this.$setData({
      dateBegin:today,
      dateEnd:today,
      activeDate:today,
    })
  },
  fetch(){
    wx.$showLoading()
    const params = {
      occurDate: this.data.dateBegin,
      occurDateEnd: this.data.dateEnd,
      searchType: this.data.type,
      staffId: wx.$getStorage('staffId'),
      storeId: wx.$getStorage('storeId'),
    }
    this.$post('/weGetStaffSalaryDetailNew', params).then(data => {
      wx.$hideLoading()
      const list = this.data.type == 'service' ? data.serviceList : this.data.type == 'product' ? data.productList : data.cardList
      data._amount = setTotal(list, 'amount')
      data._received = setTotal(list, 'received')
      data._cashPerformance = setTotal(list, 'cashPerformance')
      data._laborPerformance = setTotal(list, 'laborPerformance')
      data._productSalesPerformance = setTotal(list, 'productSalesPerformance')
      data._cardSalesPerformance = setTotal(list, 'cardSalesPerformance')
      data._commission = setTotal(list, 'commission')
      this.$setData({
        data
      })
    })
  },
  // 点击日历
  selectDate(e){
    this.$setData({
      activeDate:e.detail,
      dateBegin: e.detail,
      dateEnd: e.detail,
    })
    console.log(1)
    this.fetch()
  },
  // 点击上方日期
  setCurrentDate(e){
    this.$setData({
      dateBegin: e.detail,
      dateEnd: e.detail,
    })
    console.log(2)
    this.fetch()
  },
  changeDateBegin(e){
    this.$setData({
      dateBegin:e.detail.value,
      activeDate:null,
    })
    console.log(3)
    this.fetch()
  },
  changeDateEnd(e) {
    this.$setData({
      dateEnd: e.detail.value,
      activeDate: null,
    })
    console.log(4)
    this.fetch()
  }
})

function setTotal(array, attr) {
  let total = 0
  if (array) {
    for (const v of array) {
      total += v[attr]
    }
  }
  return total
}