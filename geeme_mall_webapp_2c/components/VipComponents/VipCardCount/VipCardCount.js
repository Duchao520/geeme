// components/VipComponents/VipCardCount/VipCardCount.js
Component({
  properties: {
    list:Array
  },
  methods:{
    close(){
      this.triggerEvent('closeCount')
    }
  }
})
