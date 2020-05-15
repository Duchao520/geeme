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
    }
  }
})
