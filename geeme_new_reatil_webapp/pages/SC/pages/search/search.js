// pages/search/search.js
const app = getApp()
Page({
  $name:'search',
  data: {
    searchHistoryList: []
  },
  onLoad(options) {
    this.$setData({
      searchHistoryList: app.getSearchHistory('store')
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
          app.clearSearchHistory('store')
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
    if(app.addSearchHistory('store', keyword)){
      this.$setData({
        searchHistoryList: app.getSearchHistory('store')
      })
    }
    this.$route('/pages/SC/pages/searchresults/searchresults', {
      keyword
    })
    
  },
  /**
   *根据历史记录搜索 
   */
  accordingHistory(e) {
    this.$route('/pages/SC/pages/searchresults/searchresults', {
      keyword: e.currentTarget.dataset.keyword
    })
  },
})