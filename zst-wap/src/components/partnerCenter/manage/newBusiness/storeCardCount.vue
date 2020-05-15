<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom">购卡统计</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!---->
    <div class="bg-f mb-5">
      <P class="pd-lr-10 fz14 pd-tb-5 p-hide">当前商家：{{shopName || ''}}</P>
      <!--tab-->
      <div class="clearfix bg-f fz15 title">
        <div class="fl-l flex-box fc-c">
          <div class="item">
            <input type="radio" name="type" id="type1" checked="checked" v-model="time" value="30"
                   @change="selectTime"/>
            <label for="type1">近30天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type2" v-model="time" value="90" @change="selectTime"/>
            <label for="type2">近90天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type3" v-model="time" value="180" @change="selectTime"/>
            <label for="type3">近180天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type4" v-model="time" value="" @change="selectTime"/>
            <label for="type4">全部</label>
          </div>
        </div>
        <div class="fl-r">卡激活走势图</div>
      </div>
      <!--曲线图-->
      <div class="chart" id="myChart" :style="{width: '355px', height: '220px'}"></div>
      <!--饼图-->
      <div class="relative">
        <div class="chart" id="myPie" :style="{width: '355px', height: '220px'}"></div>
        <span class="fc-f total fz16"><i v-if="time != ''">近{{time}}天</i><i v-else>全部</i>累计激活总数{{actvaNumCount}}</span>
      </div>
    </div>
    <!---->
    <router-link :to="{path:'/buyCardDetail',query:{shopId:shopId,shopName:shopName}}" tag="div" class="link relative">
      <p class="clearfix">
        <span class="fl-l fz16">累计购卡总数(<i v-if="time != ''">近{{time}}天</i><i v-else>全部</i>)</span>
        <i class="right-arrow fl-r"></i>
        <span class="fl-r fw-6 fz20">{{totalCardNumCount}}</span>
      </p>
    </router-link>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getStoreCardStatistics} from '@/assets/js/getData'

  export default {
    props: ['partnerToken'],
    data() {
      return {
        time: 30,
        totalCardNumCount: 0, //总购卡数
        actvaNumCount: 0, //激活卡总数
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: '',
        shopName: this.$route.query.shopName,
        shopId: this.$route.query.shopId,
      }
    },
    mounted() {
      var _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getCardStatistics();
      });
      //this.drawPie();
    },
    created: function () {
      let _self = this;
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
      /*绘制曲线图*/
      drawLine(json) {
        let myChart = this.$echarts.init(document.getElementById('myChart'));
        myChart.setOption({

          title: {},
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            borderWidth: 0,
            x: '6%',
            y: '8%',
            width: '88%',
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
              showMinLabel: true,
              showMaxLabel: true,
              textStyle: {
                color: '#b8b8be',
                fontSize: 10,
              }
            },
            axisTick: {length: 0}, //坐标轴刻度的线的长度
            data: json.xdata
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
              name: '全部',
              type: 'line',//平滑曲线
              smooth: true,  //这句就是让曲线变平滑的
              data: json.ydata,
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
      drawPie() {
        let _self = this;
        let _num = ((_self.actvaNumCount / _self.totalCardNumCount) * 100).toFixed(2);
        _self.totalCardNumCount == 0 ? _num = 0 : _num = _num;
        let myChart2 = this.$echarts.init(document.getElementById('myPie'));
        myChart2.setOption({
          title: {
            subtextStyle: {
              fontSize: 10
            },
            text: "卡激活" + _num + "%",//标题
            textStyle: {
              fontSize: 18
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
              radius: ['90%', '95%'],
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
                  value: _self.actvaNumCount, name: '已激活',
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
                  value: Number(_self.totalCardNumCount - _self.actvaNumCount) == 0 ? '1' : (_self.totalCardNumCount - _self.actvaNumCount),
                  name: '未激活',
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
      },
      //获取购卡详细信息
      getCardStatistics() {
        let _self = this;
        let _data = {
          token: _self.token,
          time: _self.time, //时间的
          shopId: _self.shopId,
        };
        _self.$getSignIn(_data).then(sec => {
          getStoreCardStatistics(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              //得到数据，绘制图表
              let _day = [], _arry = []; // 时间轴和数据轴
              _data.data.ShopList.forEach((i, n) => {
                _day = _day.concat(i.createTimeStr);
                _arry = _arry.concat(i.actvaNum);
              });
              let _json = {
                xdata: _day,
                ydata: _arry
              }
              _self.drawLine(_json); // 绘制曲线图
              _self.totalCardNumCount = _data.data.totalCardNumCount;
              _self.actvaNumCount = _data.data.actvaNumCount;
              _self.drawPie();
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
      //选择时间获取售卡信息
      selectTime() {
        this.getCardStatistics();
      }
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/charts.css';
  @import '../../../../assets/css/partner_base.css';
  .link {
    padding: 0 35px 0 50px;
    line-height: 50px;
    background: #fff url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAoCAMAAABQF/NcAAAASFBMVEUAAAD/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shpu0nlyAAAAF3RSTlMA9EK9Yp4aE5FTDOLOrG8m1zhchX2zMVcnHI0AAAFASURBVDjLhZNZgoQgDEQb3AXBve5/0xlamwABfT+aEKCsxE+Zcdl0NSQ5B6tcegFHWHzOwrFFha3RuFFBusFFcPIw3WW7BGCDuwTiu4y6El+pGtjDC621B9DfUQ3HvNlrI6A/MYNPda6wkV64F+EZAeGP7cOVCqh94FPndQPV0t6YHTDXm4CgNMUBC6Aah+vA0RAuntxThtvfaHzthFdM4NohH+iB+VfbMdOZq7SuyfQcK1D5YCNBOabQZwkcD7UCINdakOmcJV5VtJPTO3+JhhRxZmCNv3TmRTSa7UOcTJtm97w6RvqnV8fIF1RZFPdToEzNVBXZU1UGUEOdYeD+WJL1jgLqsWOUug7ByTopkaPwE1QCHDqX0bURDzNthiRzGlmcJ2zpP0mN4F3mmTE//mk7NGUSFiXEGsv9z/w+4Q+RbSbeqs7kDQAAAABJRU5ErkJggg==) no-repeat left 10px center;
    background-size: 28px auto;
  }

  .link .right-arrow {
    position: absolute;
    right: 20px;
    top: 50%;
    margin-top: -4px;
  }

  .total {
    display: block;
    background: -webkit-gradient(linear, left top, right top, from(#f81854), to(#ff9540));
    background: linear-gradient(to right, #f81854, #ff9540);
    padding: 0 10px;
    color: #fff;
    font-size: 12px;
    line-height: 25px;
    border-radius: 5px;
    border-bottom-left-radius: 0;
    position: absolute;
    left: 50%;
    top: 30%;
  }
</style>
