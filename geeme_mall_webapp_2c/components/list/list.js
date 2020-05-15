// components/list/list.js
Component({
  properties: {
    list:{
      type:Array,
      value:[]
    },
    latitude:{
      type:Number,
      value:0
    },
    longitude:{
      type:Number,
      value:0 
    }
  },
  data: {

  },
  methods: {
    call:function(e){
      let phone = e.currentTarget.dataset.phone
      wx.makePhoneCall({
        phoneNumber: phone
      })
    },
    toDetail(e){
      const id = e.currentTarget.dataset.id
      this.$route('/pages/SC/pages/details/details', {id})
    },
    toGoodsDetail(e){
      let { id, type } = e.currentTarget.dataset,
          params;
      console.log(e)
      if (type == 'PRODUCTION'){
        params = {
          productId: id,
          isProduct: 1
        }
      }else{
        params = {
          productId: id
        }
      };
      this.$route('/pages/IC/pages/productdetails/productdetails', params)
    }
  }
})
