// components/time/time.js
Component({
  options: {
    multipleSlots: true
  },
  lifetimes:{
    attached() {
      wx.nextTick( () => {
        //生成今天的时间戳(决定‘今天’是否显示)
        let currenttimestamp = new Date().toLocaleDateString();
        currenttimestamp = new Date(currenttimestamp).valueOf();
        this.setData({
          activetimestamp: this.data.dates[0].timestamp,  
          currenttimestamp
        })
      })
    },
  },
  properties: {
    dates: Array,
    times: Array,
  },
  data: {
    // 今天的时间戳
    currenttimestamp: 0,
    currentTime: '',
    activetimestamp: null
  },
  observers:{
    'dates'(n){
      this.setData({
        activetimestamp: null
      })
    }
  },
  methods: {
    /**
     * 点击日期，组件内部样式自动变化，发射一个当前日期
     */
    setcurrentdate(e) {
      let item = e.currentTarget.dataset.item;
      let currentDate = item.year + '-' + item.month + '-' + item.day;
      let activeTimmeStamp = item.year + '/' + item.month + '/' + item.day;
      this.setData({
        activetimestamp: new Date(activeTimmeStamp).valueOf(),
        currentTime: ''
      })
      this.triggerEvent('setCurrentDate', currentDate);
    },

    /**
     * 点击时间
     */
    setcurrenttime(e) {
      let item = e.currentTarget.dataset.item
      if (!item.available || item.noCapacity) {
        return;
      }
      this.setData({
        currentTime: item.time
      })
      this.triggerEvent('setCurrentTime', item.time)
    },
    clickCalendar() {
      wx.navigateTo({
        url: '/pages/TC/pages/calendarplugin/calendarplugin'
      })
    }
  },

})