<template>
  <div class="partnerDetail">
    <v-head :title="'服务商详情'"
            ref="vHead"></v-head>
    <div class="bag-scroll"
         :style="{top: 1.02 + status_bar_height + 'rem'}"
         ref="myScroll">
      <div class="scroll-container">
        <section class="partnerInfo">
          <main class="bg-FF3498-FF3465-FC6E5F fc-ffffff">
            <img :src="params.ico" alt="" class="headImg">
            <p class="fz-42 partnerName txt-ellipsis">{{params.realName}}</p>
            <p class="fz-30" style="margin-bottom: .28rem">所属区域:{{params.shortName}}</p>
            <p class="fz-30 flex_box" style="margin-bottom: .28rem">
              <span style="margin-right: 1.2rem">加盟日期:{{params.createTimeStr}}</span>
              <span>佣金比例:{{$accMul(totalIncomeRatio,100)}}%</span>
            </p>
          </main>
        </section>
        <section class="echarts_container">
          <main>
            <div class="flex_box box_padding justify_space_between" style="padding: .39rem .18rem;">
              <ul class="selector-container flex_box justify_space_between fz-28 fc-8D8E98">
                <li :class="{active: days == 30 && queryType == 1}" @click="changeDays(30,1)">近30天</li>
                <li :class="{active: days == 90  && queryType == 1}" @click="changeDays(90,1)">近90天</li>
                <li :class="{active: days == 180  && queryType == 1}" @click="changeDays(180,1)">近180天</li>
              </ul>
              <p class="fz-28" @click="changeDays('',0)">自定义<i class="iconfont icon-arrow-right"></i></p>
            </div>
            <div class="echarts_table" ref="echarts">

            </div>
            <div class="earning bg-FF3498-FF3465-FC6E5F fc-ffffff flex_box flex_column align_center"
                 style="justify-content: space-around">
              <p class="fz-36 font-weight">结算收益：{{$accMul(totalSettlementIncome,1)}}元</p>
              <p class="fz-22">收益时间：{{beginTimeStr}}至{{endTimeStr}}</p>
            </div>
          </main>
        </section>
        <section class="list">
          <header class="flex_box justify_space_between align_center box_padding" style="padding: 0 .43rem">
            <i></i>
            <i class="fc-ffffff fz-34">结算明细</i>
            <i class="iconfont icon-sousuo fz-42 fc-ffffff" @click="showDatePicker"></i>
          </header>
          <ul class="box_padding" style="padding: 0 .31rem;">
            <li class="flex_box justify_space_between"
                style="padding: .4rem 0;border-bottom: .02rem solid #E5E5E5"
                v-for="(item,index) in incomeList"
                :key="index">
              <span class="fz-30 fc-8D8E98">{{item.remark}}</span>
              <span class="fz-30 fc-F7094D">+{{$accMul(item.toOperateAgentTransMoney,1)}}</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
    <v-toast ref="toast" :tip="tip"></v-toast>
    <date-picker ref="datePicker1"
                 :beginTime="EchartsBeginTime"
                 :endTime="EchartsEndTime"
                 @handleTimeEvent="getEchartsTime"></date-picker>
    <date-picker ref="datePicker"
                 :beginTime="IncomeBeginTime"
                 :endTime="IncomeEndTime"
                 @handleTimeEvent="getIncomeTime"></date-picker>
  </div>
</template>

<script>
  import vHead from '@/components/common/v-head'
  import {getAgentIncomeList, getAgentEchats} from "@/assets/js/getData";
  import {AGENTINFO, AGENTTIME} from "@/assets/js/deal";
  import BScroll from 'better-scroll';
  import {getParterToken} from "@/assets/js/jsBridge";
  import datePicker from "@/components/common/datePicker";

  export default {
    name: "partnerDetail",
    components: {
      vHead,
      datePicker
    },
    data() {
      return {
        tip: '',
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) / 100 : 0,
        agentType: this.$route.query.agentType,
        lowerAgentId: AGENTINFO.id,   //下级服务商ID
        params: AGENTINFO,
        token: '',
        pageNum: 0,
        pageSize: 10,
        IncomeBeginTime: '',                        //开始日期十位时间戳
        IncomeEndTime: '',                           //截止日期十位时间戳
        incomeList: [],

        EchartsBeginTime: '',
        EchartsEndTime: '',
        days: 30,                          //默认 30天  ,可选值 30 ,90 ,180,
        queryType: 1,
        beginTimeStr: '',
        endTimeStr: '',
        totalIncomeRatio: '',
        totalSettlementIncome: '',
        EchartsList: [],
        EchartsList_x: [],
        EchartsList_y: [],
        gradient: [
          [0, '#F81854'],
          [1, '#FF9540']
        ],
      }
    },
    mounted() {
      var _self = this;
      getParterToken().then(res => {
        _self.token = res;
        _self.init();
        _self.initScroll();
      })
    },
    watch: {
      incomeList: {
        handler() {
          setTimeout(() => {
            this.scroll.finishPullUp();
            this.scroll.finishPullDown();
            this.scroll.refresh();
          }, 500)
        },
        deep: true
      }
    },
    methods: {
      init() {
        var _self = this;
        _self.getAgentEchats();
        _self.getIncomeList();
      },
      initScroll() {
        let _self = this;
        this.scroll = new BScroll(this.$refs['myScroll'], {
          click: true,
          pullUpLoad: {
            threshold: 50
          }
        });
        this.scroll.on("pullingUp", () => {
          _self.getIncomeList();
        });
      },
      toast(tip) {
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      showDatePicker(){
        this.$refs.datePicker.show();
      },
      getIncomeTime(beginTime,endTime){
        this.IncomeBeginTime = beginTime;
        this.IncomeEndTime = endTime;
        this.pageNum = 0;
        this.incomeList = [];
        this.getIncomeList();
      },
      getEchartsTime(beginTime,endTime){
        this.queryType = 2;
        this.EchartsBeginTime = beginTime;
        this.EchartsEndTime = endTime;
        this.queryAgentEcharts();
      },
      getIncomeList() {
        var _self = this;
        _self.pageNum++;
        var _data = {
          token: String(_self.token),
          pageNum: String(_self.pageNum),
          pageSize: String(_self.pageSize),
          beginTime: String(_self.IncomeBeginTime),
          endTime: _self.IncomeEndTime ? String(_self.IncomeEndTime + 24*60*60) : '',
          lowerAgentId: String(_self.lowerAgentId),
          agentType: String(_self.agentType)
        };
        _self.$getSignIn(_data).then(sec => {
          getAgentIncomeList(_data, sec).then(res => {
            if (res.data.state == 1) {
              _self.incomeList = _self.incomeList.concat(res.data.data);
            } else {
              _self.toast(decodeURIComponent(res.data.msg));
            }
          })
        })
      },
      changeDays(days, type) {
        var _self = this;
        if (type == 1) {
          this.queryType = 1;
          this.EchartsBeginTime = '';
          this.EchartsEndTime = '';
          _self.days = days;
          _self.queryAgentEcharts();
        } else {
          _self.$refs.datePicker1.show();
        }
      },
      getAgentEchats() {
        var _self = this;
        var _data = {
          token: String(_self.token),
          beginTime: String(_self.EchartsBeginTime),
          endTime: _self.EchartsEndTime ? String(_self.EchartsEndTime + 24*60*60) : '',
          days: _self.queryType == 1 ? String(_self.days) : '',
          lowerAgentId: String(_self.lowerAgentId),
          agentType: String(_self.agentType)
        };
        _self.$getSignIn(_data).then(sec => {
          getAgentEchats(_data, sec).then(res => {
            if (res.data.state == 1) {
              _self.beginTimeStr = res.data.beginTimeStr;
              _self.endTimeStr = res.data.endTimeStr;
              _self.totalIncomeRatio = res.data.totalIncomeRatio;
              _self.totalSettlementIncome = res.data.totalSettlementIncome;
              res.data.data.forEach(ele => {
                /*var obj = {
                  time: ele.remark,
                  tem: ele.toOperateAgentTransMoney
                };
                _self.EchartsList.push(obj);*/
                _self.EchartsList_x.push(ele.remark);
                _self.EchartsList_y.push(ele.toOperateAgentTransMoney);
              });
              // _self.$refs.vChart.rerender();
              _self.drawLine();
            } else {
              _self.toast(decodeURIComponent(res.data.msg))
            }
          })
        })
      },
      queryAgentEcharts(){
        var _self = this;
        var _data = {
          token: String(_self.token),
          beginTime: String(_self.EchartsBeginTime),
          endTime: _self.EchartsEndTime ? String(_self.EchartsEndTime + 24*60*60) : '',
          days: _self.queryType == 1 ? String(_self.days) : '',
          lowerAgentId: String(_self.lowerAgentId),
          agentType: String(_self.agentType)
        };
        _self.$getSignIn(_data).then(sec => {
          getAgentEchats(_data, sec).then(res => {
            if (res.data.state == 1) {
              _self.beginTimeStr = res.data.beginTimeStr;
              _self.endTimeStr = res.data.endTimeStr;
              _self.totalIncomeRatio = res.data.totalIncomeRatio;
              _self.totalSettlementIncome = res.data.totalSettlementIncome;
              _self.EchartsList_x = [];
              _self.EchartsList_y = [];
              res.data.data.forEach(ele => {
                /*var obj = {
                  time: ele.remark,
                  tem: ele.toOperateAgentTransMoney
                };
                _self.EchartsList.push(obj);*/
                _self.EchartsList_x.push(ele.remark);
                _self.EchartsList_y.push(ele.toOperateAgentTransMoney);
              });
              // _self.$refs.vChart.repaint();
              _self.drawLine();
            } else {
              _self.toast(decodeURIComponent(res.data.msg))
            }
          })
        })
      },
      drawLine(){
        var _self = this;
        let myChart = this.$echarts.init(_self.$refs.echarts);
        myChart.setOption({

          title: {},
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            borderWidth: 0,
            x: '15%',
            y: '10%',
            width: '75%',
            height: '70%',
            borderColor: "transparent"
          },
          toolbox: {
            feature: {
              //saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {show: false},   //不显示坐标轴
            axisLabel: {
              margin: 10,
              interval: 100000,
              //showMinLabel: true,
              showMaxLabel: true,
              textStyle: {
                color: '#b8b8be',
                fontSize: 10,
              }
            },
            axisTick: {length: 0}, //坐标轴刻度的线的长度
            data: _self.EchartsList_x
          },
          yAxis: {
            type: 'value',
            axisLine: {show: false},//不显示坐标轴
            axisTick: {length: 0}, //坐标轴刻度的线的长度
            axisLabel: {
              textStyle: {
                color: '#b8b8be',
                fontSize: 10,
              }
            },
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
          },
          dataZoom: [{
            type: 'inside',
            start: 0,
            end: 10
          }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '50%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          series: [
            {
              name: '收益',
              type: 'line',//平滑曲线
              smooth: true,  //这句就是让曲线变平滑的
              data: _self.EchartsList_y,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    {offset: 0.2, color: '#f81854'}, // 0% 处的颜色
                    {offset: 1, color: '#ff9540'}// 100% 处的颜色
                  ],
                  globalCoord: true // 缺省为 false
                }
              },
            },
          ]
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .partnerDetail {
    .bag-scroll {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .partnerInfo {
      box-sizing: border-box;
      padding: .37rem .25rem .19rem;
      width: 100%;

      main {
        height: 2.89rem;
        border-radius: .1rem;
        box-sizing: border-box;
        padding: .16rem .23rem .52rem;
        position: relative;

        .headImg {
          display: block;
          width: 1.29rem;
          height: 1.29rem;
          border-radius: 50%;
          background: #0d0d0d;
          position: absolute;
          top: -.29rem;
          left: .35rem;
        }

        .partnerName {
          padding-left: 1.7rem;
          width: 4.8rem;
          margin-bottom: .75rem;
        }
      }
    }

    .echarts_container {
      box-sizing: border-box;
      padding: 0 .25rem;
      width: 100%;
      margin-bottom: .25rem;

      main {
        width: 100%;
        height: 5.8rem;
        box-shadow: 0 .04rem .13rem .03rem rgba(178, 178, 178, 0.42);
        border-radius: .1rem;

        .selector-container {
          width: 4.3rem;

          .active {
            color: #F7094D;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .active::after {
            content: '';
            display: block;
            padding: 0 .12rem;
            width: 100%;
            height: .06rem;
            border-radius: .03rem;
            background: #F7094D;
          }
        }

        .echarts_table {
          width: 100%;
          height: 3.2rem;
          /*overflow-x: scroll;*/

          .vcharts{
            height: 100%;
            canvas{
              display: block;
              height: 3.2rem!important;
            }
          }
        }

        .earning {
          width: 6rem;
          height: 1.2rem;
          border-radius: .6rem;
          margin: 0 auto;
        }
      }
    }

    .list {
      header {
        width: 100%;
        height: 1rem;
        border-radius: .2rem .2rem 0 0;
        background: #F7094D;
      }
    }

    .bg-FF3498-FF3465-FC6E5F {
      background: -webkit-linear-gradient(1deg, rgba(252, 110, 95, 1), rgba(255, 52, 101, 1), rgba(255, 52, 152, 1)); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(1deg, rgba(252, 110, 95, 1), rgba(255, 52, 101, 1), rgba(255, 52, 152, 1)); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(1deg, rgba(252, 110, 95, 1), rgba(255, 52, 101, 1), rgba(255, 52, 152, 1)); /* Firefox 3.6 - 15 */
      background: linear-gradient(1deg, rgba(252, 110, 95, 1), rgba(255, 52, 101, 1), rgba(255, 52, 152, 1)); /* 标准的语法 */
    }
  }
</style>
