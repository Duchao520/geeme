// components/App/AppPopup/AppPopup.js
Component({
  options: {
    multipleSlots: true, // 启用多slot支持
  },
  properties: {
    show:Boolean,
    title:String,
    buttonText:{
      type:String,
      value:'确认选择'
    }
  },
  data: {

  },
  methods: {
    clickButton(){
      this.triggerEvent('clickButton')
    },
    close(){
      this.triggerEvent('close')
    },
    prevent(){}
  }
})
