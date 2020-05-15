// pages/UIC/pages/userArchives/userArchives.js
var apiAction = null, app = null;
Page({
  data: {
    currentPage: 0,
    pageSize: 10,
    total: 0,
    flag: false,
    hasLoad: false,
    customerName: null,
    customerHeadPortrait: null,
    list: null,
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    app = getApp();
    app.getPhone(() => {
      this.fetch()
    })
  },
  onUnload() {          //清内存
    apiAction = null;
    app = null;
    this.data = null;
  },
  fetch() {
    const {
      currentPage,
      pageSize
    } = this.data
    apiAction.weCustomerBeautyAchievesList(currentPage, pageSize).then(data => {
      this.data.flag = false
      this.data.total = data.total
      let renderData = {};
      if (!this.data.hasLoad) {
        renderData = {
          customerName: data.customerName,
          customerHeadPortrait: data.customerHeadPortrait,
          hasLoad: true
        }
      }

      if (data.consumerOrderContentItems && data.consumerOrderContentItems.length) {
        let list = currentPage == 0 ? data.consumerOrderContentItems : this.data.list.concat(data.consumerOrderContentItems)
        
        renderData.list = list;
      }
      this.$setData(renderData)
    })
  },
  onReachBottom() {
    if (this.data.flag) return
    if ((this.data.currentPage + 1) * this.data.pageSize >= this.data.total) return
    this.data.flag = true
    this.data.currentPage++
      this.fetch()
  },
  jumpArchivesDetail(e) {
    this.$route('/pages/UIC/pages/archivesDetails/archivesDetails', {
      id: e.currentTarget.dataset.id
    })
  },
})