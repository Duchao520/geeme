// components/popup/PopSingleColumn/PopSingleColumn.js
Component({
  properties: {
    list:Array,
    ifShow:{
      type:Boolean,
      value:false
    },
    activeItem:String,
  },
  data: {

  },
  methods: {
    clickItem(e){
      const {index, item} = e.currentTarget.dataset
      this.setData({
        activeItem: item,
        ifShow:false
      })
      this.triggerEvent('clickItem', { index, item})
    }
  }
})
