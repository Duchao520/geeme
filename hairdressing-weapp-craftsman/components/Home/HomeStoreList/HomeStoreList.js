// components/Home/HomeStoreList/HomeStoreList.js
Component({
  properties: {
    list:Array
  },
  data: {

  },
  methods: {
    /**
     * 点击去店铺详情
     */
    tostoreDetail(){
      this.triggerEvent('tostoreDetail')
    }
  }
})
