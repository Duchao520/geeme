// components/Card/ServiceCard/ServiceCard.js
Component({
  properties: {
    // Masonry组件必须
    item: Object
  },
  data: {

  },
  methods: {
    toProductDetail(e) {
      let productId = e.currentTarget.dataset.id;
      const { id, type } = e.currentTarget.dataset
      let params;
      if (type == 'card') {
        params = {
          id: id
        }
        this.$route('/pages/VIP/pages/VipCardDetail/VipCardDetail', params)
      } else {
        params = {
          productId: id
        }
        if (type == 'product') params.isProduct = 1
        this.$route('/pages/IC/pages/productdetails/productdetails', params)
      }
    }
  }
})
