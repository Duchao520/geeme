// components/StoreList/StoreList.js
Component({
  properties: {
    storeList:{
      type:Array,
      value:[]
    }
  },
  data: {

  },
  methods: {
    tostoreDetail(e){
      let id = e.currentTarget.dataset.id;
      this.triggerEvent('tostoreDetail',id)
    }
  }
})
