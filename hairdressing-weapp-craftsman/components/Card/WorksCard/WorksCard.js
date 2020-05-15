// components/works/works.js
Component({
  lifetimes: {
    attached() {
      // this.triggerEvent('loaded')
    }
  },
  properties: {
    item: Object,
    isMine: Boolean
  },
  data: {

  },
  methods: {
    toDynamicDetail(e) {
      let url;
      if(this.data.isMine){
        url = `/pages/SC/pages/dynamicDetail/dynamicDetail?id=${e.currentTarget.dataset.id}&delete=1`
      }else{
        url = `/pages/SC/pages/dynamicDetail/dynamicDetail?id=${e.currentTarget.dataset.id}`
      }
      wx.navigateTo({
        url: url
      })
    },
  }
})