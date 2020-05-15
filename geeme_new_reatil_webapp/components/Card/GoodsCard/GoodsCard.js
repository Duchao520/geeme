// components/Card/GoodsCard/GoodsCard.js
Component({
  properties: {
    // Masonry组件必需
    item:Object
  },
  data: {

  },
  methods: {
    toProductDetail(e) {
      let productId = e.currentTarget.dataset.id;
      this.$route('/pages/IC/pages/productdetails/productdetails', { productId, isProduct:1 })
    }
  }
})
