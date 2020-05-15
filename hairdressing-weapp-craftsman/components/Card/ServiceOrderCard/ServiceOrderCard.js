// components/Card/ServiceOrderCard/ServiceOrderCard.js
Component({
  properties: {
    item:Object,
    canSelect:{
      type:Boolean,
      value:false,
    }
  },
  data: {

  },
  methods: {
    jumpDetail(e) {
      const { id } = e.currentTarget.dataset
      this.$route('/pages/UIC/pages/serviceOrderDetail/serviceOrderDetail', { id })
    },
    jumpRelease(e) {
      const { id, storeid, published } = e.currentTarget.dataset
      if (published) return
      this.$route('/pages/SC/pages/releaseIndex/releaseIndex', { consumerOrderId: id, storeId: storeid })
    },
  }
})
