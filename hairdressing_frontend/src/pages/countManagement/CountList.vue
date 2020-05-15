<template>
  <div class="container">
    <!-- 头部 -->
    <div class="header">
      <label>选择门店</label>

      <el-select v-model="storeValue" placeholder="请选择" style="margin-right: 20px;">
        <el-option v-for="item in store" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <label>选择时间</label>
      <el-select v-model="timeValue" placeholder="请选择">
        <el-option v-for="item in time" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-date-picker v-model="date" type="date" placeholder="选择日期"></el-date-picker>
    </div>
    <!-- 劳动业绩 -->
    <div class="labor">
      <div class="l-head">
        <img src="/static/images/console/icon_home_realtime.png" alt>
        <span>劳动业绩</span>
      </div>
      <echart-list :labourData='labourData' id='main' :selectData="selectData"></echart-list>
    </div>
    <!-- 劳动业绩 -->
    <div class="labor">
      <div class="l-head">
        <img src="/static/images/console/icon_home_realtime.png" alt>
        <span>劳动业绩</span>
      </div>
      <echart-list :labourData='labourData' id='main1' :selectData="selectData"></echart-list>
    </div>
    <!-- 劳动业绩 -->
    <div class="labor">
      <div class="l-head">
        <img src="/static/images/console/icon_home_realtime.png" alt>
        <span>趋势图表</span>
      </div>
      <echart-lineBar :selectData="selectData"></echart-lineBar>
    </div>
    
  </div>
</template>
<script>
// import echarts from "echarts/lib/echarts";
import echartList from '@/components/countManagement/echartList'
import echartLineBar from '@/components/countManagement/echartLineBar'
export default {
  data() {
    return {
      //选择门店
      storeValue: "",
      store: [
        {
          value: "选项1",
          label: "所有门店"
        }
      ],
      //选择时间
      timeValue: "",
      time: [
        {
          value: "选项1",
          label: "日报"
        }
      ],
      selectData:[
        {
          name: '1',
          val: '1'
        },
        {
          name: '2',
          val: '2'
        },
        {
          name: '3',
          val: '3'
        }
      ],
      //   选择日期
      date: "",
      labourData: {
        laborPerformance: '51680.00',
        cardConsume: '31360.00',
        serviceCount: '136',
        customerPerPay: '380.00',
        onlinePaymentCount: '35',
        onlinePaymentTotalIncome: '81680.00',
      }
    };
  },
  mounted() {
      // this.drawPie()
  },
  methods: {
    drawPie() {
      var myChart = echarts.init(document.getElementById("main"));
      // 指定图表的配置项和数据
      var option = {
        series: [
          {
            type: "pie",
            data: [
              {
                value: 23120,
                name: "剪发"
              },
              {
                value: 19823.5,
                name: "吹风造型"
              },
              {
                value: 31960,
                name: "烫发"
              },
              {
                value: 90122,
                name: "染发"
              },
              {
                value: 10560,
                name: "护理"
              },
              {
                value: 31960,
                name: "美容"
              },
              {
                value: 90122,
                name: "美甲"
              },
              {
                value: 10560,
                name: "洗头"
              }
            ],
            radius: ['50%', '70%']
          }
        ]
      };
      myChart.setOption(option);
      // 自适应
      window.addEventListener('resize', function () {
        setTimeout(function(){
          myChart.resize()
        },300)
      })
    }
  },
  components: {
    'echart-list': echartList,
    'echart-lineBar': echartLineBar
  }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.container {
  width: 100%;
  height: auto;
  padding-left: 15px;
  padding-top: 20px;
  padding-bottom: 20px;
  .header {
    margin-right: 20px;
    height: auto;
    padding: 15px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    margin-bottom: 20px;
  }
  //劳动业绩
  .labor {
    //   margin-right: 20px;
    .l-head {
      line-height: 28px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      img {
        width: 48px;
        height: 48px;
      }
      span {
        color: #3a3a3a;
        font-size: 20px;
        display: inline-block;
      }
    }
    .l-body {
      margin-right: 20px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      .l-left {
        width: 49%;
        height: 515px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
        margin-right: 20px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
      }
      .l-right {
        width: 50%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 413px;
          height: 158px;
          background-color: rgba(255, 255, 255, 1);
          box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
          margin-bottom: 20px;
          img{
            width: 72px;
            height: 72px;
            margin-left: 40px;
            margin-right: 60px;
          }
          div{
            flex: 1;
            p{
              font-size: 28px;
              font-weight:400;
            }
            span{
              font-size: 16px;
              color: #606266;
            }
          }
        }
      }
    }
  }
}
</style>