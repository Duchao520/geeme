// components/popup/PopHeader/PopHeader.js
Component({
  properties: {
    tabs:Array,
    activeIndex:{
      type:Number,
      value:-1
    }
  },
  data: {
    
  },
  methods: {
    clickTab(e){
      const index = e.currentTarget.dataset.index
      const activeIndex = this.data.activeIndex == index ? -1 : index
      this.setData({
        activeIndex
      })
      this.triggerEvent('popup', { index:activeIndex });
    }
  }
})
