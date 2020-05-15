// components/Home/HomeStaffList/HomeStaffList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    staffList:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击某发型师，去详情
     */
    tostaffDetail(){
      this.triggerEvent('tostaffDetail')
    }
  }
})
