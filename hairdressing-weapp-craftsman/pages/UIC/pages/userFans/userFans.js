// pages/UIC/pages/userFocus/userFocus.js
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    list: [],
    currentPage: 1,
    pageSize: 10,
    total: 0,
    keyword: '',
    flag: false,
  },
  onLoad(options) {
    this.fetch()
  },
  fetch() {
    const { currentPage, pageSize, keyword } = this.data
    fetch.staffGetMyFans({ currentPage, pageSize, keyword }).then(data => {
      this.data.flag = false
      if (data.attentives && data.attentives.length) {
        let list = currentPage == 1 ? data.attentives : this.data.list.concat(data.attentives)
        this.$setData({
          list,
          total: data.total
        })
      }
    })
  },
  search(e) {
    this.data.keyword = e.detail
    this.data.currentPage = 1
    this.$setData({
      list: []
    })
    this.fetch()
  },
  onReachBottom() {
    if (this.data.flag) return
    if (this.data.currentPage * this.data.pageSize >= this.data.total) return
    this.data.flag = true
    this.data.currentPage++
    this.fetch()
  },
})