<template>
  <transition name="slide">
    <div class="type-select" v-show="selectFlag" @click="search" :style="{top: status_bar_height + 1.02 + 'rem'}">
      <section class="select-container" v-show="selectFlag">
        <main style="border-bottom: .11rem solid #EEEEEE">
          <div class="option flex_box justify_space_between align_center"
               v-for="(item,index) in typeList"
               @click.stop="selected = index">
            <p class="fz-34">{{item.name}}</p>
            <i class="iconfont icon-wanchenggouxuan2 fc-FEB623 fz-34"
               v-show="selected == index"></i>
          </div>
        </main>
        <main>
          <div class="option flex_box justify_space_between align_center">
            <p class="fz-34">砍成时间</p>
            <p class="fz-30 fc-8D8E98" @click.stop="showDatePicker">{{beginTime ? timestampToTime(beginTime).substr(0,10) : timestampToTime(showBeginTime).substr(0,10)}}至{{endTime ? timestampToTime(endTime).substr(0,10) : timestampToTime(showEndTime).substr(0,10)}}<i
              class="iconfont icon-arrow-right fc-0D0D0F"></i></p>
          </div>
        </main>
      </section>
      <date-picker ref="datePicker"
                   @handleTimeEvent="getTime"></date-picker>
    </div>
  </transition>

</template>

<script>
  import datePicker from '@/components/common/datePicker'
  import {timestampToTime} from "@/assets/js/jsBridge";

  export default {
    name: "type-select",
    components: {
      datePicker
    },
    data() {
      return {
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height)/100 : .4,
        typeList: [
          {
            name: '全部',
            isUse: ''
          },
          {
            name: '未核销',
            isUse: '0'
          },
          {
            name: '已核销',
            isUse: '1'
          }
        ],
        selected: 0,
        selectFlag: false,
        beginTime: '',
        endTime: '',
        showBeginTime: '',
        showEndTime: ''
      }
    },
    mounted(){
      this.initTime();
    },
    methods: {
      showDatePicker() {
        this.$refs.datePicker.show();
      },
      cutSelect() {
        this.selectFlag = !this.selectFlag;
      },
      getTime(beginTime,endTime){
        this.beginTime = beginTime;
        this.endTime = endTime;
      },
      search(){
        var _self = this;
        this.$emit('search',_self.typeList[_self.selected].isUse,_self.beginTime,_self.endTime);
        _self.selectFlag = false;
      },
      timestampToTime(timestamp){
        return timestampToTime(timestamp)
      },
      formatTimeStamp(date,time='0:0:0'){
        return Date.parse(new Date(`${date} ${time}`))||Date.parse(new Date(`${date.replace(/-/g,'/')} ${time}`))
      },
      initTime(){
        var _self = this;
        var _date = new Date();
        var nowTimeStamp = Date.parse(_date);
        var nowTimeStr = timestampToTime(nowTimeStamp).substr(0,10);
        var beginTimeStr = timestampToTime(Number(nowTimeStamp) - 24 * 60 * 60 *1000).substr(0,10);
        _self.showEndTime = _self.formatTimeStamp(nowTimeStr)/1000;
        _self.showBeginTime = _self.formatTimeStamp(beginTimeStr)/1000;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .slide-enter-active {
    animation: fadeInDown .3s;
  }

  .slide-leave-active {
    animation: fadeOutUp .3s;
  }

  .type-select {
    position: fixed;
    top: 1.02rem;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(12, 12, 12, .5);
    z-index: 55;

    .select-container {
      background: #FFFFFF;

      main {
        box-sizing: border-box;
        padding: 0 .3rem;

        .option {
          padding: .37rem 0;
          border-bottom: .02rem solid #EEEEEE;
        }
      }

    }
  }
</style>
