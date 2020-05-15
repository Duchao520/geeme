<template>
  <div class="date_area">
    <img src="@/assets/img/left_icon_blue.png" @click="getDayReduce">
    <div class="date">

      <p>{{showYear}} <span>{{showMonth}}/{{showDay}}</span></p>
      <p>{{showWeekDay}}</p>
    </div>
    <img src="@/assets/img/right_icon_blue.png" @click="getDayAdd">
    <div class="date-picker">
      <el-date-picker
        v-model='currentDate'
        type="date"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        :clearable="false"
        @change="changeDate"
        placeholder="请选择日期">
      </el-date-picker>
    </div>

  </div>
</template>

<script>
export default {
  name:'DateCheck',
  // props: {
  //   orderTime: String // 这样搞有bug
  // },
  computed: {
    orderTime () {
      // 这个字段以后改成 this.$store.state.appointment.currentAppo.orderTime
      let now = this.$store.state.manage.currentInfo.orderTime 
      !this.created && this.getCurrentDay(now)
      this.created = false
      this.currentDate = now
      return now
    }
  },
  data(){
    return {
      currentDate: '',
      value: '',
      dateAbout:{
        year:'',
        month:'',
        day:'',
        realDate:''
      },
      showYear:'',
      showMonth:'',
      showDay:'',
      showWeekDay:'',
      created: false, // 补救2次请求
    }
  },
  mounted(){
    this.created = true
    this.getCurrentDay(this.orderTime)
  },
  methods:{
    // 获取显示的日期
    getShowDate(){
      let curArr = this.dateAbout.realDate.split('-');
      this.showYear = curArr[0];
      this.showMonth = curArr[1];
      this.showDay = curArr[2];
      this.value = this.dateAbout.realDate
      // 向外暴露事件，将所选择的日期传出
      this.$emit('change', this.value)
      this.getWeekDay()
    },
    // 获取日期
    getCurrentDay(date){
        let curday = date || new Date().format('yyyy-MM-dd');
        this.dateAbout.realDate = curday;
        this.dateAbout.year = new Date(curday).getFullYear();
        this.dateAbout.month = new Date(curday).getMonth() + 1;
        this.dateAbout.day = new Date(curday).getDate();
        this.getShowDate()
    },
    // 获取上一天
    getDayReduce(){
        let day = this.dateAbout.day;
        let month = this.dateAbout.month;
        let year = this.dateAbout.year;
        if(day == 1){
          switch(month)
          {
            case 1:
              day = 31;
              month = 12;
              year = year - 1;
              break;
            case 2:
            case 4:
            case 6:
            case 8:
            case 9:
            case 11:
              day = 31;
              month = month - 1;
              break;
            case 3:
              if(year%4 == 0 && year%100 != 0 || year%400 == 0){
                day = 29;
                month = month - 1;
              }else{
                day = 28;
                month = month - 1;
              }
              break;
            case 5:
            case 7:
            case 10:
              day = 30;
              month = month - 1;
              break;
          }
        }else{
          day = day - 1;
        }
        this.dateAbout.day = day;
        this.dateAbout.month = month;
        this.dateAbout.year = year;
        let thisdate = year + '-' + month + '-' + day
        this.dateAbout.realDate = new Date(thisdate).format('yyyy-MM-dd');
        this.getShowDate()
    },
    // 改变日历的日期
    changeDate(date) {
      let curday = new Date(date).format('yyyy-MM-dd');
      this.dateAbout.realDate = curday;
      this.dateAbout.year = new Date(date).getFullYear();
      this.dateAbout.month = new Date(date).getMonth() + 1;
      this.dateAbout.day = new Date(date).getDate();
      // 执行显示的日期
      this.getShowDate()
    },
    // 获取下一天
    getDayAdd(){
        let day = this.dateAbout.day;
        let month = this.dateAbout.month;
        let year = this.dateAbout.year;
        if(day == 28) {
          switch (month)
          {
            case 2:
              if(year % 4 == 0 && year %100 !=0 || year%400 == 0){
                day = day + 1;
                break;
              }else{
                day = 1;
                month = month +1;
                break;
              }
            default:
              day = day + 1;
              break;
          }
        }else if(day == 29){
            switch (month)
            {
              case 2:
                day = 1;
                month = month +1;
                break;
              default:
                day = day + 1;
                break;
            }
        }else if(day == 30){
            switch (month)
            {
              case 1:
              case 3:
              case 5:
              case 7:
              case 8:
              case 10:
              case 12:
                day = day + 1;;
                break;
              case 4:
              case 6:
              case 9:
              case 11:
                day = 1;
                month = month + 1;
                break;
            }
        }else if(day == 31){
          switch(month)
          {
              case 1:
              case 3:
              case 5:
              case 7:
              case 8:
              case 10:
                day = 1;
                month = month + 1;
                break;
              case 12:
                day = 1;
                month = 1;
                year = year +1;
                break;
          }
        }else{
          day += 1;
        }
        this.dateAbout.day = day;
        this.dateAbout.month = month;
        this.dateAbout.year = year;
        let thisdate = year + '-' + month + '-' + day
        this.dateAbout.realDate = new Date(thisdate).format('yyyy-MM-dd');
        this.getShowDate()
    },
    // 获取指定日期是周几
    getWeekDay(){
      let weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      let myDate = new Date(Date.parse(this.dateAbout.realDate));
      let checkDate = this.dateAbout.realDate;
      let curDay = new Date().format('yyyy-MM-dd');
      let diffDays = this.getDateDiff(checkDate,curDay);

      //判断 昨天 今天 明天 后天
      if(diffDays<3 && diffDays >= 0){
        switch (diffDays){
          case 0:
            this.showWeekDay = "今天";
            break;
          case 1:
            this.showWeekDay = "明天";
            break;
          case 2:
            this.showWeekDay = "后天";
            break;
          default:
            break;
        }
      }else if(diffDays == -1){
        this.showWeekDay = "昨天"
      }else{
        this.showWeekDay = weekDay[myDate.getDay()];
      }
    },
    // 获取两个日期相差几天  格式：2018-11-10
    getDateDiff(sDate1,sDate2){
       let  aDate,  oDate1,  oDate2,  iDays;
       aDate = sDate1.split("-")
       oDate1 = new  Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为11-10-2018格式
       aDate = sDate2.split("-")
       oDate2 = new  Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
       iDays = parseInt((oDate1 - oDate2) / 1000 / 60 / 60 /24)    //把相差的毫秒数转换为天数
       return iDays
    }
  },
  watch: {

  }
}
</script>

<style lang="scss" scoped>
.date_area{
  width:154px;
  height:72px;
  // border:1px solid rgba(235, 235, 235, 1);
  border-radius:2px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  .date-picker {
    position: absolute;
    width:100px;
    opacity: 0;
    cursor: pointer;
    .el-date-editor.el-input {
      width: 100%!important;
    }
    /deep/ .el-input__inner {
      cursor: pointer;
    } 
  }
  img{
    width: 8px;
    height: 14px;
    margin: 0 10px;
    cursor: pointer;
  }
  .date{
    flex: 1;
    text-align: center;
    line-height: 24px;
    span{
      color: #E22C37;
      margin-left: 7px;
    }
  }
}
</style>



