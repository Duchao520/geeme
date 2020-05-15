// components/DailyWork/DateHeadContainer/DateHeadContainer.js
Component({
  externalClasses: ['date-container', 'calendar-icon'],
  options: {
    styleIsolation: 'apply-shared',
  },
  properties: {
    calendarAction: {
      type: Number,
      value: 1
    },
    fields:{
      type:String,
      value:'day'
    },
    start:String,
    end:String,
    value:String,
  },
  data: {

  },
  methods: {
    tocalendar() {
      this.triggerEvent('tocalendar')
    },
    selectDate(e) {
      this.triggerEvent('selectDate', e.detail.value)
    }
  }
})