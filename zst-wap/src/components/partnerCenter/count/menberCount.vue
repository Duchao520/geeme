<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">会员统计</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <div class="bg-f ">
      <div class="clearfix bg-f fz15 title">
        <div class="fl-l flex-box fc-c">
          <div class="item">
            <input type="radio" name="type" id="type1" @change="getMembeStatistics" v-model="time" value="30"/>
            <label for="type1">近30天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type2" @change="getMembeStatistics" v-model="time" value="90"/>
            <label for="type2">近90天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type3" @change="getMembeStatistics" v-model="time" value="180"/>
            <label for="type3">近180天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type4" checked="checked" @change="getMembeStatistics" v-model="time"
                   value=""/>
            <label for="type4">全部</label>
          </div>
        </div>
        <div class="fl-r">新增会员统计图</div>
      </div>
      <!--曲线图-->
      <div class="chart" id="myChart" :style="{width: '355px', height: '320px'}"></div>
      <router-link to="memberList" tag="div" class=" border-top ">
        <p class="clearfix">
          <span class="fl-l fz12">累计会员总数(<span v-if="time != ''">近{{time}}天</span><span v-else>全部</span>)</span>
          <span class="fl-r fz15">{{count}}<i class="right-arrow"></i></span>
        </p>
      </router-link>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getMembeStatistics} from '@/assets/js/getData'
  import {postColor} from "@/assets/js/jsBridge";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        time: "30",
        count: 0, //总计的会员总数
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        tip: '',
        token: ''
      }
    },
    mounted() {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getMembeStatistics();
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
      //获取会员统计信息
      getMembeStatistics() {
        let _self = this;
        let _data = {
          token: _self.token,
          time: _self.time
        };
        _self.$getSignIn(_data).then(sec => {
          getMembeStatistics(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.count = _data.data.count;
              //得到数据，绘制图表
              if (_data.data.list.length == 0) {
                _self.toast("没有数据");
              } else {
                let _day = [], _arry = []; // 时间轴和数据轴
                _data.data.list.forEach((i) => {
                  _day = _day.concat(i.createTimeStr);
                  _arry = _arry.concat(i.totalUser);
                });
                let _json = {
                  xdata: _day,
                  ydata: _arry
                }
                console.log(_json);
                _self.drawLine(_json); // 绘制曲线图
              }
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
      /*绘制曲线图*/
      drawLine(json) {
        let myChart = this.$echarts.init(document.getElementById('myChart'));
        myChart.setOption({
          title: {},
          tooltip: {
            //trigger: 'axis'
          },
          grid: {
            borderWidth: 0,
            x: '10%',
            y: '10%',
            width: '80%',
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
            boundaryGap: false,
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
              name: '会员统计',
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
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAsCAMAAADPc2F3AAAATlBMVEUAAAD/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shrpkF4BAAAAGXRSTlMA8ZpT2jrk0RimjGdfI8CvEAd7yLiDRixwcYEdTgAAAW1JREFUOMuNlN2ygyAMhAkgoKJWq7Z5/xc9avmRusfpXjHyTczCBlHKvQdNZPqlErd6SOIo296AL8NnPd1/YEdcyowCS/O3egx6vgr7soAcoG9GegBSQXIFZANJdKg1JBtADpCsfyYlsG4gadyFXACGG50BhX8/MdZ07ZMgSA5kTgPQdgJIwSxBEbTzS9H6BSCAGiVutGZw3pPpVu8Vrvw8X81a02dGcfQyKDnJXuv2KWujvc1+FS4m9ZH1KsFwogrEQJ+vU3Iq6fY91Tah61Zp9rHcNJ8nYgo9mFiO2B6Y1EXQgrNt7x0uf99Px5HlxUh8IMdiDg9RAUZDLrnYNjsx8kF2/C0fSVbb7hBriRYNhEmnIKtYCwxlnYf/fQpD0Waq5ONyTFmc0XtU5fwvm/34UV7JPhXKPgYRVqVUfiTnjzm9teEIzmT5L/s43gTf1E/DQdm013hGXaXaRQ59b63V2tDitsZ6Q0S26Q7iD+LWYECgdjj9AAAAAElFTkSuQmCC) no-repeat left center;
    background-size: 20px;
  }
</style>
