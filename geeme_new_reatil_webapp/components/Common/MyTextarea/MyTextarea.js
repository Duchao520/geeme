// components/Common/MyTextarea/MyTextarea.js
Component({
  externalClasses:['my-class'],
  properties: {
    value:String,
    placeholder:String,
    maxlength:{
      type:String,
      value:'140'
    }
  },
  data: {
    ifShowTextarea:false,
    isFocus:false,
  },
  methods: {
    showTextarea(){
      this.setData({
        ifShowTextarea:true,
      }, () => {
        this.setData({
          isFocus: true
        })
      })
    },
    hideTextarea(){
      this.setData({
        ifShowTextarea:false,
        isFocus:false,
      })
    },
    input(e){
      this.setData({
        value:e.detail.value
      })
      this.triggerEvent('input', e.detail.value)
    }
  }
})
