<template>
  <div class="date-box">
    <div class="left-arrow arrow" @click="minusDate">
      <img src="@/assets/img/left_icon_blue.png">
    </div>
    <label>
      <div class="date-container">
        {{this.date}}
      </div>
      <el-date-picker
        v-model="date"
        :type="unit"
        :clearable="false"
        :value-format='valueFormat'
        placeholder="选择日期"
        @change="handleDateChanged"
      >
      </el-date-picker>
    </label>
    <div class="right-arrow arrow" @click="addDate">
      <img src="@/assets/img/right_icon_blue.png">
    </div>
  </div>
</template>
<script>
export default {
  props: {
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    defaultDate: {
      type: String,
      default: new Date().format('yyyy-MM-dd')
    },
    unit: {
      type: String,
      default: 'date'
    }
  },
  mounted() {
    this.date = new Date(this.defaultDate).format(this.valueFormat)
    this.initDate()
  },
  data() {
    return {
      date: '',
    }
  },
  methods: {
    // 初始化
    initDate() {
      this.$emit('dateFromSuber', this.date)
    },
    // 减一个单位
    minusDate() {
      if (this.unit === 'date') {
        this.date = new Date(+(new Date(this.date)) - 8.64e7).format(this.valueFormat)
      } else if (this.unit === 'month') {
        let year = this.date.slice(0, 4) * 1
        let month = this.date.slice(-2) * 1
        if (month === 1) {
          this.date = `${year - 1}-12`
        } else {
          let lastMonth = `00${month - 1}`.slice(-2)
          this.date = `${year}-${lastMonth}`
        }
      }
      this.initDate()
    },
    // 加一个单位
    addDate() {
      if (this.unit === 'date') {
        this.date = new Date(+(new Date(this.date)) + 8.64e7).format(this.valueFormat)
      } else if (this.unit === 'month') {
        let year = this.date.slice(0, 4) * 1
        let month = this.date.slice(-2) * 1
        if (month === 12) {
          this.date = `${year + 1}-01`
        } else {
          let nextMonth = `00${month + 1}`.slice(-2)
          this.date = `${year}-${nextMonth}`
        }
      }
      this.initDate()
    },
    // 面板手动选择
    handleDateChanged(date) {
      this.initDate()
    },
  }
}
</script>
<style lang='scss' scoped>
.date-box {
  background: #fff;
  display: flex;
  flex-wrap: nowrap;
  width: 110px;
  height: 38px;
  border: 1px solid #ccc;
  border-radius: 6px;
  .arrow {
    width: 18px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 8px;
      height: 14px;
    }
  }
  label {
    flex: 1;
    height: 100%;
    position: relative;
    background: #fff;
  }
  .date-container {
    height: 100%;
    line-height: 38px;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
  }
  .el-date-editor {
    position: absolute;
    z-index: -1;
    // opacity: 0;
    width: 60px;
    height: 32px;
    /deep/ .el-input__inner {
      width: 60px;
      height: 32px;
    }
  }
}
</style>
