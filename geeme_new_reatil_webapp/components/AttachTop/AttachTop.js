// components/AttachTop/AttachTop.js
Component({
  lifetimes:{
    ready(){
      const query = this.createSelectorQuery();
      query.select('.AttachTop').boundingClientRect();
      query.exec(res => {
        this.top = res[0].top
        this.ready = true
      })
    }
  },
  properties: {
    scrollTop:Number
  },
  data:{
    isFixed:false,
  },
  observers:{
    'scrollTop'(newValue){
      if(!this.ready) return
      if ((newValue >= this.top) != this.data.isFixed){
        this.triggerEvent('change', newValue >= this.top)
        this.setData({
          isFixed: newValue >= this.top
        })
      }
    },
  }
})
