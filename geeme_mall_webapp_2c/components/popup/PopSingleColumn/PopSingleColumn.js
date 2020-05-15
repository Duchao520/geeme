// components/popup/PopSingleColumn/PopSingleColumn.js
Component({
  properties: {
    list:Array,
    ifShow:{
      type:Boolean,
      value:false
    },
    val: String,
    activeItem:String,
    activeIndex: String
  },
  data: {

  },
  methods: {
    clickItem(e){
      const {index, item} = e.currentTarget.dataset
      this.setData({
        activeItem: item,
        ifShow:false,
        activeIndex: index
      })
      this.triggerEvent('clickItem', { index, item})
    }
  }
})
