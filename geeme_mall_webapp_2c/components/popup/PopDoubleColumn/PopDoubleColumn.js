// components/popup/PopDoubleColumn/PopDoubleColumn.js
Component({
  lifetimes: {
    attached() {
      wx.nextTick(() => {
        this.$setData({
          activeItem: this.data.list[0],
          currentItem:this.data.list[0]
        })
      })
    }
  },
  properties: {
    ifShow: {
      type: Boolean,
      value: false
    },
    list: Array,
  },
  data: {
    activeItem: null,
    activeChildId: 0,
    currentItem:null, // 当前已选择的item
  },
  methods: {
    clickLeft(e) {
      const {
        item
      } = e.currentTarget.dataset
      this.setData({
        activeItem: item
      })
    },
    clickRight(e) {
      const {id, name,item} = e.currentTarget.dataset
      this.setData({
        activeChildId: id,
        currentItem:this.data.activeItem,
        ifShow:false,
      })
      const currentItem = this.data.currentItem
      this.triggerEvent('clickChild', { parentId: currentItem.id, parentName: currentItem.name, childId: id, childName:name,item: item})
    }
  }
})