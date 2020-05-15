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
    maxAmount: {
      type: Number,
      value: -1
    }, //最多数量
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
      let {amount , maxAmount} = this.data;
      if(maxAmount < 0){
        this.setData({
          amount: ++amount
        })
        this.triggerEvent('changeAmount', amount)
      }else{
        if (amount < maxAmount) {
          this.setData({
            amount: ++amount
          })
          this.triggerEvent('changeAmount', amount)
        }
      }
    }
  }
})
