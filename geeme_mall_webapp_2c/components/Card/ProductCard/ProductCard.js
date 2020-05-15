// components/Card/ProductCard/ProductCard.js
Component({
  properties: {
    info:Object
  },
  data: {

  },
  methods: {
    jumpProductDetail(e){
      const {id, type} = e.currentTarget.dataset
      const query = {
        productId: id
      }
      if (type == 'production'){
        query.isProduct = 1
      }
      this.$route('/pages/IC/pages/productdetails/productdetails', query)
    },
  }
})
