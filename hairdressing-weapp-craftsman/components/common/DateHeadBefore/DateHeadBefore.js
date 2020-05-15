// components/common/DateTitle/DateTitle.js
const format = require('../../../utils/format.js');
Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  attached() {
    this.getDateListByStartDate(this.properties.startDate)
  },
  detached() {
    this.setData({
      dateList: []
    })
  },
  properties: {
    dayNumber: {
      type: Number,
      value: 6
    },
    startDate: {
      type: String,
      value: '',
      observer(newVal, oldVal, filePath) {
        this.getDateListByStartDate(newVal);
      }
    },
    activeDate:{
      type:String,
      observer(n){
        this.setData({
          active:n
        })
      }
    },
  },
  data: {
    dateList: [],
    active: null,
    nowTime: new Date().Format('yyyy-MM-dd')
  },
  methods: {
    /**
     * 获取日期数组(dateList)
     */
    getDateListByStartDate(startDate) {
      let dateList = startDate ? format.getDatesBefore(this.properties.dayNumber, startDate) : format.getDatesBefore(this.properties.dayNumber)
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
        active: _dateList[_dateList.length - 1].allDate
      }, () => {
        this.triggerEvent('setCurrentDate', _dateList[_dateList.length - 1].allDate)
      })
    },
    /**
     * 设置当前日期
     */
    setCurrentDateInfo(e) {
      let currentDate = e.currentTarget.dataset.item.allDate;
      this.setData({
        active: currentDate
      })
      this.triggerEvent('setCurrentDate', currentDate)
    }
  }

})