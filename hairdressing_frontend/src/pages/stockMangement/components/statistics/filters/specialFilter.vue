<template>
  <div class="special-filter-line">
    <el-radio-group class="btn-group" v-model="lastDays" @change="handleDaysChanged">
      <el-radio-button :label="1">本周</el-radio-button>
      <el-radio-button :label="2">上周</el-radio-button>
      <el-radio-button :label="3">本月</el-radio-button>
      <el-radio-button :label="4">上月</el-radio-button>
    </el-radio-group>
    <el-date-picker
      size="medium"
      style="margin-left:10px;"
      v-model="date"
      unlink-panels
      range-separator="至"
      @change="handleDateChanged"
      type="datetimerange"
      value-format="yyyy-MM-dd HH:mm:ss"
      :default-time="['00:00:00', '23:59:59']"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    ></el-date-picker>
    <el-button 
      plain 
      size="small" 
      v-if="showResetBtn"
      class="plain_pink_btn" 
      style="margin-left:10px;"
      @click="resetTableData"
    >
      重算
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    currentType: {
      type: String,
    }
  },
  data() {
    return {
      lastDays: 1, // 1，2，3，4
      date: null,
    }
  },
  created() {
    this.emitTime(this.lastDays)
  },
  methods: {
    handleDateChanged(arr) {
      if (arr && arr.length) {
        this.lastDays = null
        this.emitTime(arr)
      } else {
        this.lastDays = this.lastDays || 1
        this.emitTime(this.lastDays)
      }
    },
    handleDaysChanged(n) {
      if (n) {
        this.date = null
        this.emitTime(n)
      }
    },
    emitTime(something) {
      let obj = {}
      // console.time('computed')
      let now = new Date().format('yyyy-MM-dd hh:mm:ss')
      let day = new Date().getDay() // 0-6,  按周一(1)是第一天计算
      let date = new Date().getDate() // 1-31 
      let month = new Date().getMonth() + 1 // 1 - 12 
      let year = new Date().getFullYear()
      let start = ''
      let end = ''
      // 1本周 2上周 3本月 4上月
      switch(something) {
        case 1:
          start = day ? 
            new Date( +(new Date()) - ((day - 1) * 8.64e7) ).format('yyyy-MM-dd') + ' 00:00:00' : 
            new Date( +(new Date()) - (6 * 8.64e7) ).format('yyyy-MM-dd') + ' 00:00:00';
          obj = {
            endDay: now,
            startDay: start,
          }
          break
        case 2:
          start = day ? 
            new Date( +(new Date()) - ((day - 1 + 7 ) * 8.64e7) ).format('yyyy-MM-dd') + ' 00:00:00' : 
            new Date( +(new Date()) - ((6 + 7) * 8.64e7) ).format('yyyy-MM-dd') + ' 00:00:00';
          end = day ? 
            new Date( +(new Date()) - (day * 8.64e7) ).format('yyyy-MM-dd') + ' 23:59:59' : 
            new Date( +(new Date()) - (7 * 8.64e7) ).format('yyyy-MM-dd') + ' 23:59:59';
          obj = {
            endDay: end,
            startDay: start,
          }
          break  
        case 3:
          start = new Date().format('yyyy-MM') + '-01 00:00:00'
          obj = {
            endDay: now,
            startDay: start,
          }
          break 
        case 4:
          if (month === 1) {
            let lastYear = year - 1
            obj = {
              endDay: `${lastYear}-12-31 23:59:59`,
              startDay: `${lastYear}-12-01 00:00:00`,
            }
          } else {
            let lastMonth = `0${month - 1}`.slice(-2)
            let lastMonthLastDay = new Date( +(new Date()) - (date * 8.64e7) ).format('yyyy-MM-dd')
            start = `${year}-${lastMonth}-01 00:00:00` 
            end = lastMonthLastDay + ' 23:59:59'
            obj = {
              endDay: end,
              startDay: start,
            }
          }
          break   
        default:
          obj = {
            endDay: something[1],
            startDay: something[0],
          }   
      }
      // console.log(obj)
      // console.timeEnd('computed')
      this.$emit('filterTime', {...obj, forDialog: something})
    },
    resetTableData() {
      this.$emit('resetTableData', new Date(this.date[0]).format('yyyy-MM-dd'))
    }
  },
  computed: {
    showResetBtn() {
      if (this.currentType === 'requireOrder' ) {
        if (this.date && this.date.length) {
          let start = new Date(this.date[0]).format('yyyy-MM-dd')
          let end = new Date(this.date[1]).format('yyyy-MM-dd')
          return start === end
        }
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped> 
.special-filter-line {
  margin: 20px 20px 0;
  display: flex;
  height: 75px;
  align-items: center;
  padding-left: 20px;
  background: #fff;
}
</style>