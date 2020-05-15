// components/Card/VipCard/VipCard.js
Component({
  lifetimes:{
    attached(){
      getApp().getBrand( brand => {
        this.$setData({
          logo:brand.logo
        })
      })
    }
  },
  properties: {
    info:Object,
    logo:String,
  },
  data: {

  },
  methods: {
    jumpCardDetail(){
      this.$route('/pages/VIP/pages/VipCardDetail/VipCardDetail', {id:this.data.info.id})
    }
  }
})
