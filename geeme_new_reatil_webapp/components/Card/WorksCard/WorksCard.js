// components/works/works.js
Component({
  properties: {
    item: Object,
  },
  data: {

  },
  methods: {
    toDynamicDetail(e) {
      wx.navigateTo({
        url: `/pages/IC/pages/dynamicDetail/dynamicDetail?id=${e.currentTarget.dataset.id}`,
      })
    },
  }
})