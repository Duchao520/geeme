// components/App/AppBackHome/AppBackHome.js
Component({
  lifetimes:{
    attached(){
      if(getCurrentPages().length === 1){
        this.setData({
          ifShow:true
        })
      }
    }
  },
  properties:{
    storeId:Number
  },
  data: {
    ifShow:false,
  },
  methods: {
    backHome(){
      wx.reLaunch({
        url: '/pages/tabBar/home/index/index',
      })
    },
  }
})
