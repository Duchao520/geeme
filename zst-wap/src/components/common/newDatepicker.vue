<template>
  <transition name="alertMsg">
    <div class="datePicker" v-show="isShow" @click.stop="">
      <div class="box_padding" style="padding: .52rem .34rem;">
        <div class="flex_box justify_space_between align_center" style="margin-bottom: .44rem">
          <div class="date-selector fz-30 fc-8D8E98" :class="{'active': startSelector}">
            <x-button type="default"
                      plain
                      @click.native="startSelector = true" :text="calBeginTime"></x-button>
          </div>
        </div>
        <group v-show="false">
          <datetime v-model="calBeginTime"
                    :show.sync="startSelector"
                    :format="'YYYY-MM-DD'"
                    :end-date="end_date"
                    @on-confirm="onConfirmStart"></datetime>
        </group>
      </div>
      <v-toast ref="toast" :tip="tip"></v-toast>
    </div>
  </transition>
</template>


<script>
  import vHead from '@/components/common/v-head'
  import { XButton,Datetime, Group,} from 'vux'
  import {timestampToTime} from "@/assets/js/jsBridge";

  export default {
    name: "datePicker",
    components: {
      vHead,
      XButton,
      Datetime, Group
    },
    props: ['beginTime','endTime'],
    data(){
      return{
        startDate: '',
        timeSelect: true,
        startSelector: false,
        endSelector: false,
        end_date: '',
        calBeginTime: '',
        calEndTime: '',
        value: '',
        tip: '',
        isShow: false
      }
    },
    methods: {
      onConfirmStart(val){
        this.calBeginTime = val;
      },
      onConfirmEnd(val){
        this.calEndTime = val;
      },
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      linkToDetail(){
        var _self = this;
        var beginTime = _self.formatTimeStamp(_self.calBeginTime)/1000;
        var endTime = _self.formatTimeStamp(_self.calEndTime)/1000;
        var range = (endTime - beginTime)/(24*60*60);
        if(range < 0){
          _self.toast('开始日期请勿大于结束日期')
        }else if(range > 365){
          _self.toast('查询时间范围请<=365天')
        }else{
          _self.$emit('handleTimeEvent',beginTime,endTime);
          _self.isShow = false;
        }

      },
      formatTimeStamp(date,time='0:0:0'){
        return Date.parse(new Date(`${date} ${time}`))||Date.parse(new Date(`${date.replace(/-/g,'/')} ${time}`))
      },
      /**
       * 计算日期范围
       */
      calDateRange(){
        var _self = this;
        var _date = new Date();
        var nowTimeStamp = Date.parse(_date);
        var nowTime = timestampToTime(nowTimeStamp).substr(0,10);
        var beginTime = timestampToTime(Number(nowTimeStamp) - 30 * 24 * 60 * 60 *1000).substr(0,10);
        _self.end_date = nowTime;
        _self.calBeginTime = beginTime;
        _self.calEndTime = nowTime;
      },
      initTime(){
        this.calBeginTime = this.beginTime ? timestampToTime(this.beginTime).substr(0,10) : this.calBeginTime;
        this.calEndTime = this.endTime ? timestampToTime(this.endTime).substr(0,10) : this.calEndTime;
      },
      show(){
        this.isShow = true;
      }
    },
    created() {
      this.calDateRange();
      this.initTime();
    }
  }
</script>

<style lang="scss" scoped>
  .datePicker{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 300;
    background: #FFFFFF;
    .date-selector{
      width: 3.2rem;
      height: .8rem;
      text-align: center;
      line-height: .8rem;
    }
    .weui-btn{
      color: #8d8e98 !important;
      font-size: .36rem !important;
      border-color: #8D8E98 !important;
    }
    .active{
      .weui-btn{
        font-size: .36rem!important;
        color: #0D0D0F!important;
      }
    }
  }

</style>
