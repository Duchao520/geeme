// components/App/AppASAmount/AppASAmount.js
Component({
  lifetimes:{
    attached(){
      let height = this.data.height.slice(0, -3)
      let _height = Number(height)/2
      this.setData({
        _height:_height + 'rpx'
      })
    }
  },
  properties: {
    amount:Number,
    // 容器高度，只能用rpx单位
    height:String,
  },
  data: {
    // 容器高度的一半
    _height:''
  },
  methods: {
    sub(){
      if(this.data.amount == 1) return
      this.setData({
        amount:--this.data.amount
      })
      this.triggerEvent('changeAmount', this.data.amount);
    },
    add(){
      this.setData({
        amount:++this.data.amount
      })
      this.triggerEvent('changeAmount', this.data.amount)
    }
  }
})
