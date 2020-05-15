// components/common/DateTitle/DateTitle.js
const format = require('../../../utils/format.js');
Component({

  /**
   * 组件在内存中创建完毕执行
   */
  created: function() {
 
  },

  /**
   * 组件挂载之前执行
   */
  attached: function() {
    this.getDateListByStartDate();
  },

  /**
   * 组件挂载后执行
   */
  ready: function() {
  
  },  

  /**
   * 组件移除执行
   */
  detached: function() {
    this.setData({
      dateList:[]
    })
  },
  /**
   * 组件的属性列表
   */
  properties: {
    dayNumber:{
      type:Number,
      value:0
    },
    startDate:{
      type:String,
      value:'',
      observer(newVal, oldVal, filePath){
        this.getDateListByStartDate(newVal);
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dateList:[],
    active:null,
    nowTime:new Date().Format('yyyy-MM-dd')
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 获取日期数组(dateList)
     */
    getDateListByStartDate(startDate){
      let dateList = startDate ? format.getDatesAfter(this.properties.dayNumber,startDate) : format.getDatesAfter(this.properties.dayNumber)
      let _dateList = [];
      dateList.forEach(v => {
        let obj = {
          week: v.week,
          date: v.month + '/' + v.day,
          activeDate: v.year + '/' + v.month + '/' + v.day,
          allDate: v.year + '-' + v.month + '-' + v.day
        }
        _dateList.push(obj)
      })

      this.setData({
        dateList: _dateList,
        active: _dateList[0].allDate
      }, () => {
        this.triggerEvent('setCurrentDate', _dateList[0].allDate)
      })
    },
    /**
     * 设置当前日期
     */
    setCurrentDateInfo(e){
      let currentDate = e.currentTarget.dataset.item.allDate;
      this.setData({
        active:currentDate
      })
      this.triggerEvent('setCurrentDate',currentDate)
    }
  }

})