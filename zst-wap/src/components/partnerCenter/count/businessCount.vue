<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">商家统计</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <div class="bg-f ">
      <div class="clearfix bg-f fz15 title">
        <div class="fl-l flex-box fc-c">
          <div class="item">
            <input type="radio" name="type" id="type1" v-model="time" value="30" @change="getShopInfo"/>
            <label for="type1">近30天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type2" v-model="time" value="90" @change="getShopInfo"/>
            <label for="type2">近90天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type3" v-model="time" value="180" @change="getShopInfo"/>
            <label for="type3">近180天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type4" checked="checked" v-model="time" value="" @change="getShopInfo"/>
            <label for="type4">全部</label>
          </div>
        </div>
        <div class="fl-r">新增商家统计图</div>
      </div>
      <!--曲线图-->
      <div class="chart" id="myChart" :style="{width: '355px', height: '320px'}"></div>
      <router-link to="/businessList" tag="div" class=" border-top ">
        <p class="clearfix">
          <span class="fl-l fz12">累计商家总数(<span v-if="time != ''">近{{time}}天</span><span v-else>全部</span>)</span>
          <span class="fl-r fz15">{{totalShopCount || 0}}<i class="right-arrow"></i></span>
        </p>
      </router-link>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getNewShop} from '@/assets/js/getData'
  import {postColor} from "@/assets/js/jsBridge";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        time: '30',
        totalShopCount: 0,//累计商家总数
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        tip: '',
        token: ''
      }
    },
    mounted() {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getShopInfo();
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
            x: '12%',
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
              name: '新增商家',
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
      //获取全部的商家信息
      getShopInfo() {
        let _self = this;
        let data = {
          token: _self.token,
          time: _self.time,
        };
        _self.$getSignIn(data).then(sec => {
          getNewShop(data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              console.log(1);
              //得到数据，绘制图表
              _self.totalShopCount = _data.data.totleCount[0].totalShopCount;
              let _day = [], _arry = []; // 时间轴和数据轴
              _data.data.list.forEach((i) => {
                _day = _day.concat(i.createTimeStr);
                _arry = _arry.concat(i.todayMemberCount);
                //_self.total += i.todayMemberCount ;
              });
              let _json = {
                xdata: _day,
                ydata: _arry
              }
              _self.drawLine(_json); // 绘制曲线图
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          })
        })

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
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAmCAMAAABu6EIRAAAARVBMVEUAAAD/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shpxY2wXAAAAFnRSTlMA8t2Q66RkQ9OZKBO2clA2B7/Khn1a+Aya8QAAANdJREFUOMvtld0OgyAMRiug8g9O7fs/6iJEBtmwPMDOFYRj8KtthMzBph6MQ4XDJ1Rl4jOmiJ4wXTElYYpb1EixQkaRpm3z0JlOpDlKHgpR56EzqSFzA4g4hoFl0NxLHgoGOArYQVFCGDT9p0r0l2/uf9VrUa0hwUt5Nbj7eDrA2K/50FwKIVXqwrhYJtjmUveEfBCgJhLrjOe7hh5m52fZzGmoOvjUHlAiLV1zRZz/ZjbPrhkak6j8XG9E6IiaNa/GrpH6zdV0sXpQ4APNdUax3g9h1ll5A4CrR//WMy8GAAAAAElFTkSuQmCC) no-repeat left center;
    background-size: 20px;
  }
</style>
