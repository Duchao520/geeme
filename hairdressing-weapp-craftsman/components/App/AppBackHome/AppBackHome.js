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
  data: {
    ifShow:false,
  },
  methods: {
    backHome(){
      wx.reLaunch({
        url: '/pages/tabBar/Home/index/index',
      })
    }
  }
})
