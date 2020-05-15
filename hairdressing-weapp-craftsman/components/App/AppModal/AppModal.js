// components/App/AppModal/AppModal.js
Component({
  properties: {
    show:Boolean,
    title:String,
    content:String,
    button1:{
      type:String,
      value:'取消'
    },
    button2:{
      type:String,
      value:'确定'
    }
  },
  data: {

  },
  methods: {
    action(e){
      const {from} = e.currentTarget.dataset
      this.triggerEvent('action', {from})
    },
    prevent(){}
  }
})
