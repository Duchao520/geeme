<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">售卡统计</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!---->
    <div class="bg-f ">
      <div class="clearfix bg-f fz15 title">
        <div class="fl-l flex-box fc-c">
          <div class="item">
            <input type="radio" name="type" id="type1" @change="getAgentSaleCard" v-model="time" value="30"/>
            <label for="type1">近30天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type2" @change="getAgentSaleCard" v-model="time" value="90"/>
            <label for="type2">近90天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type3" @change="getAgentSaleCard" v-model="time" value="180"/>
            <label for="type3">近180天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type4" checked="checked" @change="getAgentSaleCard" v-model="time"
                   value=""/>
            <label for="type4">全部</label>
          </div>
        </div>
        <div class="fl-r">卡销售统计图</div>
      </div>
      <!--曲线图-->
      <div class="chart" id="myChart" :style="{width: '355px', height: '320px'}"></div>
      <router-link to="/saleCardDetail" tag="div" class="mb-5 border-top">
        <p class="clearfix">
          <span class="fl-l fz12">累计购卡总数(<span v-if="time != ''">近{{time}}天</span><span v-else>全部</span>)</span>
          <span class="fl-r fz15">{{totalCardNum || 0}}<i class="right-arrow"></i></span>
        </p>
      </router-link>
      <!--饼图-->
      <div class="chart" id="myPie" :style="{width: '355px', height: '320px'}"></div>
      <div class="flex-box">
        <div class="item">
          <p class="fz16">通用卡</p>
          <p class="fw-6 fc-r fz20">{{publicCardNum || 0}}</p>
        </div>
        <div class="item">
          <p class="fz16">定制卡</p>
          <p class="fw-6 fc-r fz20">{{privateCardNum || 0}}</p>
        </div>
      </div>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getAgentSaleCard} from '@/assets/js/getData'
  import {postColor} from "@/assets/js/jsBridge";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        time: '30',
        privateCardNum: '', //定制卡数量
        publicCardNum: '', //通用卡数量
        actvaNumCount: '', //总的卡激活数
        totalCardNum: '', //总的购卡数
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: ''
      }
    },
    mounted() {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getAgentSaleCard();
      });
      postColor('ffffff'); //传递顶部的手机导航栏的色值给安卓
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /*返回上一页*/
      back() {
        this.$router.go(-1);//返回上一层
      },
      /*获取售卡统计的相关信息*/
      getAgentSaleCard() {
        let _self = this;
        let _data = {
          token: _self.token,
          time: _self.time, //筛选时间状态 ： 30天，90天，180天 ，全部
        };
        _self.$getSignIn(_data).then(sec => {
          console.log(sec);
          getAgentSaleCard(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.privateCardNum = _data.data.privateCardNumCount;
              _self.publicCardNum = _data.data.publicCardNumCount;
              _self.actvaNumCount = _data.data.actvaNumCount;
              _self.totalCardNum = _data.data.totalCardNumCount;

              //得到数据，绘制图表
              let _day = [], _arry = []; // 时间轴和数据轴
              _data.data.ShopList.forEach((i) => {
                _day = _day.concat(i.createTimeStr);
                _arry = _arry.concat(i.privateCardNum);
              });
              let _json = {
                xdata: _day,
                ydata: _arry
              }
              console.log(_json);
              _self.drawLine(_json); // 绘制曲线图
              let obj = {
                actvaNumCount: _data.data.actvaNumCount || 0,
                totalCardNum: _data.data.totalCardNumCount || 0,
              };
              _self.drawPie(obj);
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })
      },
      /*绘制曲线图*/
      drawLine(_json) {
        let myChart = this.$echarts.init(document.getElementById('myChart'));
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
            data: _json.xdata
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
          series: [
            {
              name: '售卡统计',
              type: 'line',//平滑曲线
              smooth: true,  //这句就是让曲线变平滑的
              data: _json.ydata,
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
      },
      /*绘制饼图*/
      drawPie(data) {
        let myChart2 = this.$echarts.init(document.getElementById('myPie'));
        let _num;
        data.totalCardNum == 0 ? _num = 0 : _num = (Number(data.actvaNumCount) / Number(data.totalCardNum) * 100).toFixed(2);
        myChart2.setOption({
          title: {
            subtextStyle: {
              fontSize: 16
            },
            text: "卡激活" + _num + "%",//标题
            textStyle: {
              fontSize: 28
            },
            itemGap: -60,
            x: 'center',
            y: 'center'
          },
          tooltip: {
            show: false
          },
          legend: {
            itemWidth: 0,
            selectedMode: false,
            x: 'center',
            y: '55%',
          },
          series: [
            {
              type: 'pie',
              radius: ['75%', '80%'],
              hoverAnimation: false,//关闭放大效果
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '10',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: data.actvaNumCount,
                  name: '已激活' + data.actvaNumCount,
                  itemStyle: {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 1,
                      y2: 1,
                      colorStops: [
                        {offset: 0.2, color: '#f81e53'}, // 0% 处的颜色
                        {offset: 1, color: '#fc6049'}// 100% 处的颜色
                      ],
                      globalCoord: true // 缺省为 false
                    }
                  },
                },
                {
                  value: ((data.totalCardNum - data.actvaNumCount) == 0 && data.actvaNumCount == 0) ? '1' : (data.totalCardNum - data.actvaNumCount),
                  name: '未激活' + (data.totalCardNum - data.actvaNumCount),
                  itemStyle: {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 1,
                      y2: 1,
                      colorStops: [
                        {offset: 1, color: '#f8f8fa'}// 100% 处的颜色
                      ],
                      globalCoord: true // 缺省为 false
                    }
                  },
                },
              ]
            }
          ]
        });
      }
    }
  }
</script>

<style scoped>
  @import '../../../assets/css/charts.css';
  @import '../../../assets/css/partner_base.css';
  .border-top {
    margin: 0 10px;
    line-height: 45px;
    padding-left: 31px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAoCAMAAABQF/NcAAAASFBMVEUAAAD/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shpu0nlyAAAAF3RSTlMA9EK9Yp4aE5FTDOLOrG8m1zhchX2zMVcnHI0AAAFASURBVDjLhZNZgoQgDEQb3AXBve5/0xlamwABfT+aEKCsxE+Zcdl0NSQ5B6tcegFHWHzOwrFFha3RuFFBusFFcPIw3WW7BGCDuwTiu4y6El+pGtjDC621B9DfUQ3HvNlrI6A/MYNPda6wkV64F+EZAeGP7cOVCqh94FPndQPV0t6YHTDXm4CgNMUBC6Aah+vA0RAuntxThtvfaHzthFdM4NohH+iB+VfbMdOZq7SuyfQcK1D5YCNBOabQZwkcD7UCINdakOmcJV5VtJPTO3+JhhRxZmCNv3TmRTSa7UOcTJtm97w6RvqnV8fIF1RZFPdToEzNVBXZU1UGUEOdYeD+WJL1jgLqsWOUug7ByTopkaPwE1QCHDqX0bURDzNthiRzGlmcJ2zpP0mN4F3mmTE//mk7NGUSFiXEGsv9z/w+4Q+RbSbeqs7kDQAAAABJRU5ErkJggg==) no-repeat left center;
    background-size: 20px;
  }
</style>
