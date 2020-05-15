<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">新增商家统计</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!---->
    <div class="bg-f mb-5">
      <div class="clearfix bg-f fz15 title">
        <div class="fl-l flex-box fc-c">
          <div class="item">
            <input type="radio" name="type" id="type1" checked="checked" @change="getNewShop" value="30"
                   v-model="time"/>
            <label for="type1">近30天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type2" @change="getNewShop" value="90" v-model="time"/>
            <label for="type2">近90天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type3" @change="getNewShop" value="180" v-model="time"/>
            <label for="type3">近180天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type4" @change="getNewShop" value="" v-model="time"/>
            <label for="type4">全部</label>
          </div>
        </div>
        <div class="fl-r">新增商家统计图</div>
      </div>
      <!--累计新增-->
      <p class="total fc-f fz12"><span v-show="time != ''">近{{time}}天</span><span v-show="time == ''">全部</span>累计新增商家{{totleCount.totalShopCount
        || 0}}家</p>
      <!--曲线图-->
      <div class="chart" id="myChart" :style="{width: '355px', height: '320px'}"></div>
      <div class="border-top">
        <p class="clearfix">
          <span class="fl-l fz15"><span v-show="time != ''">近{{time}}天</span><span
            v-show="time == ''">全部</span>商家收益(元)</span>
          <span class="fl-r fc-r fw-6 fz15">{{totalProfit}}</span>
        </p>
      </div>
      <div class="flex-box fz12">
        <div class="item ">
          <p>会员充值收益</p>
          <p class="fz15 fw-6">{{totleCount.memberRechargeProfit || 0}}</p>
        </div>
        <div class="item ">
          <p>商家充值</p>
          <p class="fz15 fw-6">{{totleCount.shopRechargeProfit || 0}}</p>
        </div>
        <div class="item ">
          <p>会员购物预估收益</p>
          <p class="fz15 fw-6">{{totleCount.memberEstimateProfit || 0}}</p>
        </div>
      </div>
    </div>
    <div class="bg-f link fz12 relative">
      <router-link tag="p" to="/businessList" class="clearfix">
        <span class="fl-l">当前累计商家</span>
        <span class="fl-r fw-6 fz20">{{totleCount.totalShopCount || 0}}<i class="right-arrow"></i></span>
      </router-link>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getNewShop} from '@/assets/js/getData'

  export default {
    props: ['partnerToken'],
    data() {
      return {
        time: 30,
        totleCount: {},
        //total : 0 , // 累计新增商家数
        totalProfit: 0, //累计收益总数
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: ''
      }
    },
    mounted() {
      var _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getNewShop();
      });
      /*comm.getGPS(); // 获取当前位置经纬度信息
      window.ZSTGetGPS = comm.ZSTGetGPS;*/
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
      //获取新增商家信息
      getNewShop() {
        let _self = this;
        let _data = {
          token: _self.token,
          time: _self.time
        };
        _self.$getSignIn(_data).then(sec => {
          getNewShop(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.totleCount = _data.data.totleCount[0];
              _self.totalProfit = Number(_self.totleCount.memberRechargeProfit) + Number(_self.totleCount.memberEstimateProfit) + Number(_self.totleCount.shopRechargeProfit);
              //得到数据，绘制图表
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
              name: '新增商家',
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
  @import '../../../../assets/css/charts.css';
  @import '../../../../assets/css/partner_base.css';
  .border-top {
    margin: 0 10px;
    padding: 25px 0;
  }

  .relative {
    padding: 6px 0;
  }

  .right-arrow {
    position: absolute;
    right: 20px;
    top: 50%;
  }

  .link {
    padding: 0 35px 0 50px;
    line-height: 50px;
    background: #fff url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAQlBMVEUAAAD/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shr/shpJvUYNAAAAFXRSTlMA9Ho46yVjEcKFHJXjza5IVS3XorlVj83cAAAB9ElEQVRYw+2X2Y6EIBBFCxBRZHHp+v9fnVYSxjS0CDXJvHieCDFH4RaL8PDwUM1o2T3WSd/xrXifTpZ9DmtYiz6NdfjiBFYKXUloKoVMXfs81sKvha9qobn0SUygxcIbhI4YSYqqiIQay9Ak7L76FLYhKiKhxdJhI6oiEkosQ7PQVERCiIUThK68SuixzEhhpJ0lKZZWhCmseHrS1/NEEg6pcCEJPaRsxExSWLtQZ4Wi2ddDoFzbzqWj2yrOgJl9PJleTTaAnhW/L6LPxTMtR/rnLuePp8bu1LXAJQu376eZefVxomU/GIbYWS7iVte7vYvZUcANtFRpVxKkenf9A3p6I6AGJbwXcUjZWuQVNm7xYB3ld2F/28fZuSoUVag/zkmz0ITSBM8YzcxThMrE9aQGDLCFIHS/B5SMY1/bhR5zQuTNwiEv7FqFEvNCnBuFHCMTSIuRrVG47cM7MBzkKzTZHkujcHj7READLKE17W9pFFrELj8P7V/IRn7gQfWhaffazgjnm3PIAnvKoZUpbbV3Tn+YMtibn7h8q8M++2bHL5n3NxdWSsTcvFLPeeGYCCUrC7fwr55uX2gUpEZb8oXUdBe3fhH3QwE5+pdhl/CQS3KLZjOQ0B9j6QQQURM7R6WBjh7XYDPTAn+E9vPsJTw8UPkBafvCrzCwz0AAAAAASUVORK5CYII=) no-repeat left 10px center;
    background-size: 28px auto;
  }

  .link .right-arrow {
    margin-top: -4px;
  }

  .total {
    background: -webkit-linear-gradient(left, #f81854, #ff9540); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #f81854, #ff9540); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #f81854, #ff9540); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #f81854, #ff9540); /* 标准*/
    position: absolute;
    padding: 0 10px;
    line-height: 25px;
    border-radius: 5px;
    left: 18px;
    border-top-left-radius: 0;
  }
</style>
