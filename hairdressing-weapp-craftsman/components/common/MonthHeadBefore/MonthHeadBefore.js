// components/common/DateTitle/DateTitle.js
const format = require('../../../utils/format.js');
Component({
  attached() {
    this.getMonthListByStartDate(this.properties.startDate)
  },
  detached() {
    this.setData({
      dateList: []
    })
  },
  properties: {
    dayNumber: {
      type: Number,
      value: 5
    },
    startDate: {
      type: String,
      value: '',
      observer(newVal, oldVal, filePath) {
        this.getMonthListByStartDate(newVal);
      }
    }
  },
  data: {
    monthList: [],
    active: null,
    nowTime: new Date().Format('yyyy-MM-dd')
  },
  methods: {
    /**
     * 获取日期数组(dateList)
     */
    getMonthListByStartDate(startDate) {
      let monthList = startDate ? format.getMonthBefore(this.properties.dayNumber, startDate) : format.getMonthBefore(this.properties.dayNumber)
      this.setData({
        monthList: monthList,
        active: monthList[monthList.length - 1].number
      }, () => {
 
        this.triggerEvent('setCurrentDate', monthList[monthList.length - 1].number)
      })
    },
    /**
     * 设置当前日期
     */
    setCurrentDateInfo(e) {
      let currentDate = e.currentTarget.dataset.item.number;
      this.setData({
        active: currentDate
      })
      this.triggerEvent('setCurrentDate', currentDate)
    }
  }

})