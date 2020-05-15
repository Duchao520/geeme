// components/common/AppointmentItem/AppointmentItem.js
Component({
  properties: {
    appointmentList: Array,
    capacity: Number,
    isToday:Boolean,
  },
  data: {

  },
  methods: {
    takeUp(e) {
      const {
        index,
        time,
        status
      } = e.currentTarget.dataset
      let obj = {
        index,
        time,
        status,
      }
      this.triggerEvent('takeUp', obj)
    },
    // 添加预约
    reserve(e) {
      const appointment = e.currentTarget.dataset.appointment
      if (!this.canAdd(appointment.time)){
        return wx.showToast({
          title: '无法添加一小时以内的预约',
          icon:'none'
        })
      }
      this.triggerEvent('reserve', appointment)
    },
    // 判断是否能添加预约
    canAdd(time) {
      if (!this.data.isToday) return true
      var now = new Date()

      var hm = time.split(':')
      var time_minutes = Number(hm[0]) * 60 + Number(hm[1])
      var now_minutes = now.getHours() * 60 + now.getMinutes()
      return (time_minutes - now_minutes) > 60
    },
    toappointmentDetail(e) {
      this.$route('/pages/TC/pages/appointmentDetail/appointmentDetail', {
        id: e.currentTarget.dataset.id
      })
    }
  }
})