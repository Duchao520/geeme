// pages/UIC/pages/currentMonthResults/currentMonthResults.js
const fetch = require('../../../../utils/fetch.js')
const util = require('../../../../utils/util.js')
Page({
  data: {
    tabList: ['日报', '月报', '薪资明细', '排行榜',],
    currentTab:0,
    infoByDay:null, // 日报信息
    startDate_infoByDay:null,
    infoByMonth:null,   // 月报信息
    startDate_infoByMonth:null,
    salaryInfo:null,  // 薪资明细
    rankInfo:null,  // 排行榜
    rank:{  // 排行榜相关字段
      performanceCycle:'today',
      performanceType: 'labor',  //[ labor, card, service, total ]
      types_en:['labor', 'card', 'service', 'total'],
      types_cn: ['劳动业绩', '售卡业绩', '服务客数', '总业绩'],
      cycles_en:['today', 'week', 'month'],
      cycle_cn:['今日', '本周', '本月'],
      cycleIndex:0,
      typeIndex:0,
    },
    // 日历相关
    today:null,
    date_60DayAgo:null,
    currentMonth:null,
    startMonth:null,
  },
  onLoad(){
    this.initCalendar()
  },
  initCalendar(){
    const now = new Date()
    const today = util.formatTime3(now)
    const timestamp = new Date(today).valueOf()
    const time = 60 * 24 * 60 * 60 * 1000
    const date_60DayAgo = util.formatTime3(new Date(timestamp - time))
    let currentMonth = now.getMonth() + 1
    let startMonth = currentMonth == 12 ? 1 : currentMonth + 1
    currentMonth = util.formatTime4(now)
    startMonth = startMonth == 1 ? new Date(now.getFullYear(), startMonth - 1) : new Date(now.getFullYear() - 1, startMonth - 1)
    startMonth = util.formatTime4(startMonth)
    this.$setData({
      today,
      date_60DayAgo,
      currentMonth,
      startMonth,
    })
  },
  onChange(e){
    console.log(123)
    console.log(e.detail)
    this.$setData({
      currentTab:e.detail.index
    })
    if(e.detail.index == 3){
      this.getRankInfo()
    }
  },
  // 日报
  getInfoByDay(date){
    const params = {
      occurDate:date,
      occurDateEnd:date,
      searchType:'all',
      staffId:wx.$getStorage('staffId'),
      storeId:wx.$getStorage('storeId'),
    }
    this.$post('/weGetStaffSalaryDetailNew', params).then( data => {
      data.service_received = setTotal(data.serviceList, 'received')
      data.service_commission = setTotal(data.serviceList, 'commission')
      data.product_received = setTotal(data.productList, 'received')
      data.product_commission = setTotal(data.productList, 'commission')
      data.card_received = setTotal(data.cardList, 'received')
      data.card_commission = setTotal(data.cardList, 'commission')
      this.$setData({
        infoByDay: data
      })
    })
  },
  // 月报
  getInfoByMonth(date){
    fetch.weMonthPerformanceResponse(date).then( data => {
      this.$setData({
        infoByMonth:data
      })
    })
  },
  // 薪资
  getSalaryInfo(date){
    fetch.weMonthSalaryResponse(date).then( data => {
      this.$setData({
        salaryInfo:data
      })
    })
  },
  // 排行榜
  getRankInfo(){
    const { performanceCycle, performanceType} = this.data.rank
    fetch.wePerformanceRankingResponse(performanceCycle, performanceType).then( data => {
      this.$setData({
        rankInfo:data
      })
    })
  },
  setCycle(e){
    const index = e.currentTarget.dataset.index
    this.$setData({
      'rank.cycleIndex':index
    })
    this.data.rank.performanceCycle = this.data.rank.cycles_en[index]
    this.getRankInfo()
  },
  changeRankType(e){
    const index = e.detail.value
    this.$setData({
      'rank.typeIndex':index
    })
    this.data.rank.performanceType = this.data.rank.types_en[index]
    this.getRankInfo()
  },
  selectDate_infoByDay(e){
    this.$setData({
      startDate_infoByDay:e.detail
    })
  },
  selectDate_infoByMonth(e){
    this.$setData({
      startDate_infoByMonth:e.detail
    })
  },
  switchTab(e){
    this.$setData({
      currentTab:e.detail.index
    })
  },
  /**
   * DateHeadBefore->点击当前日期
   */
  setCurrentDate(e){
    console.log('点击日期', e.detail)
    switch(this.data.currentTab){
      case 0:
        this.getInfoByDay(e.detail)
        break;
      case 1:
        this.getInfoByMonth(e.detail)
        break;
      case 2:
        this.getSalaryInfo(e.detail)
        break;
      case 3:
        break;
    }
  },
  // 跳转业绩报表
  jumpSalaryTable(e){
    this.$route('/pages/UIC/pages/salaryTable/salaryTable', {type:e.currentTarget.dataset.type})
  },
})

function setTotal(array, attr){
  let total = 0
  if(array){
    for (const v of array) {
      total += v[attr]
    }
  }
  return total
}