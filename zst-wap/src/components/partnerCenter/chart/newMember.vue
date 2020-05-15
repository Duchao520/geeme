<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">新增会员</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!---->
    <div class="bg-f ">
      <div class="clearfix bg-f fz15 title">
        <div class="fl-l flex-box fc-c">
          <div class="item">
            <input type="radio" name="type" id="type1" checked="checked"/>
            <label for="type1">近30天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type2"/>
            <label for="type2">近90天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type3"/>
            <label for="type3">近180天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type4"/>
            <label for="type4">全部</label>
          </div>
        </div>
        <div class="fl-r">新增会员统计图</div>
      </div>
      <!--曲线图-->
      <div class="chart" id="myChart" :style="{width: '355px', height: '320px'}"></div>
      <div class=" border-top ">
        <p class="clearfix">
          <span class="fl-l fz12">当月新增会员</span>
          <span class="fl-r fz15">22<i class="right-arrow"></i></span>
        </p>
      </div>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getNewMember} from '@/assets/js/getData';
  import {getSignIn} from "@/assets/js/jsBridge";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: ''
      }
    },
    mounted() {
      var _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getNewMember();
        _self.drawLine();
      })
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
      //获取本月新增会员信息
      getNewMember() {
        var _self = this;
        let _data = {
          token: _self.token
        };
        _self.$getSignIn(_data).then(sec => {
          getNewMember(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {

            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })
      },
      /*绘制曲线图*/
      drawLine() {
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
            data: ['08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07']
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
            }
          },
          series: [
            {
              name: '充值收益',
              type: 'line',//平滑曲线
              smooth: true,  //这句就是让曲线变平滑的
              data: [12, 1, 19, 8, 5, 23, 21],
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
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAnCAMAAABUv8o5AAAAP1BMVEUAAAD/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phquUP/hAAAAFHRSTlMAE8HPfEXZYSPvtzKqVuefdJNsiaHAKAoAAAEvSURBVDjLhdJXloMwDAXQJxfcqIn2v9ZBYcAJyPC+yMlFBRunkB9CGDzhJsWZkT8Zs4sNNBj+SR60SgeqMeWsHKuZf1XPjfTfynAzWa/VrufUf+f96bWpyFoClv0xQmJVNoKO7yLKK8auOzlM+0+vb5kAbznWco3JSBZbarmor5kxOwBUDyNfDjK+mQux9UA6XkuX8QHKCWF9oatrX8ZnfgM+YjU1J2YjaOIkg73azII8MPEKvWkzIuYBpgqVdWsnh86iu2UjooPhBfaOSUNkaX1W9YPYQrOcCg107Zl3lv4vSwDKRfFrZzI5iUtJuwobM5+OnTgtGRuzECDOaawAx8UL4oLRiwmrTg8Je3QBH1adqhZUJrFWUxMqa+cNhWlzPbM+4pn1BbhnqZsCATV/j+hU0LFluskAAAAASUVORK5CYII=) no-repeat left center;
    background-size: 20px;
  }
</style>
