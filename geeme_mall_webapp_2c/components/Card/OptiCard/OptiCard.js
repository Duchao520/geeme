// components/Card/GoodsCard/GoodsCard.js
Component({
  properties: {
    // Masonry组件必需
    item: Object
  },
  data: {

  },
  methods: {
    toProductDetail(e) {
      let { id, type } = e.currentTarget.dataset,
        params;
      if (type == 'service'){
        params = { productId: id}
        this.$route('/pages/IC/pages/productdetails/productdetails', params)
      }else if(type == 'product'){
        params = { productId: id, isProduct : 1}
        this.$route('/pages/IC/pages/productdetails/productdetails', params)
      }else if(type == 'card'){
        params = { id: id }
        this.$route('/pages/VIP/pages/VipCardDetail/VipCardDetail',params)
      }
    }
  }
})
