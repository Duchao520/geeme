// components/SearchList/SearchList.js
Component({
  properties: {
    list: Array,
    latitude: {
      type: Number,
      value: 0
    },
    longitude: {
      type: Number,
      value: 0
    }
  },

  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateToDetail(e){
      let { storeid } = e.currentTarget.dataset;
      wx.$setStorage('storeId', storeid)
      wx.navigateTo({
        url: '/pages/SC/pages/purchase/purchase',
      })
    },
    toGoodsDetail(e) {
      let { id, type } = e.currentTarget.dataset,
        params;
      console.log(e)
      if (type == 'PRODUCTION') {
        params = {
          productId: id,
          isProduct: 1
        }
      } else {
        params = {
          productId: id
        }
      };
      this.$route('/pages/IC/pages/productdetails/productdetails', params)
    }
  }
})
