// pages/search/search.js
const app = getApp()
Page({
  $name:'search_purchase',
  data: {
    searchHistoryList: []
  },
  onLoad(options) {
    this.$setData({
      searchHistoryList: app.getSearchHistory('purchase')
    })
  },
  /**
   * 清空历史记录
   */
  clearSearchHistory() {
    wx.showModal({
      title: '警告',
      content: '确认删除历史搜索？',
      success: res => {
        if (res.confirm) {
          this.$setData({
            searchHistoryList: []
          })
          app.clearSearchHistory('purchase')
        }
      }
    })
  },

  /**
   * 点击键盘的搜索按钮 
   */
  search(e) {
    const keyword = e.detail
    if (!keyword.length) {
      return;
    }
    if (app.addSearchHistory('purchase', keyword)) {
      this.$setData({
        searchHistoryList: app.getSearchHistory('purchase')
      })
    }
    this.$route('/pages/SC/pages/searchresults_purchase/searchresults_purchase', {
      keyword
    })

  },
  /**
   *根据历史记录搜索 
   */
  accordingHistory(e) {
    this.$route('/pages/SC/pages/searchresults_purchase/searchresults_purchase', {
      keyword: e.currentTarget.dataset.keyword
    })
  },
})