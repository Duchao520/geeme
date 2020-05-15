<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom">收益统计</h3>
      <span class="ico-retrun" @click="back"><i class="left-arrow"></i></span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!---->
    <div class="bg-f mb-5">
      <P class="pd-lr-10 fz14 pd-tb-5 p-hide">当前商家：{{shopName || ''}}</P>
      <!--tab-->
      <div class="clearfix bg-f fz15 title">
        <div class="fl-l flex-box fc-c">
          <div class="item">
            <input type="radio" name="type" id="type1" @change="getProfitStatistics" v-model="time" value="30"/>
            <label for="type1">近30天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type2" @change="getProfitStatistics" v-model="time" value="90"/>
            <label for="type2">近90天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type3" @change="getProfitStatistics" v-model="time" value="180"/>
            <label for="type3">近180天</label>
          </div>
          <div class="item">
            <input type="radio" name="type" id="type4" checked="checked" @change="getProfitStatistics" v-model="time"
                   value=""/>
            <label for="type4">全部</label>
          </div>
        </div>
        <div class="fl-r">新增会员统计图</div>
      </div>
      <!--曲线图-->
      <div class="chart" id="myChart" :style="{width: '355px', height: '220px'}"></div>
      <!--曲线分类-->
      <div class="flex-box fz12 fc-c line-type">
        <div class="item checkbox-box" v-for="checkbox in selectList">
          <input type="checkbox" name="line" :id="'line'+checkbox.val" :value="checkbox.val"
                 :checked="select.indexOf(checkbox.val)>=0" @click="selectType(checkbox.val)"/>
          <label class="checkbox ico-shadow" v-if="checkbox.val == 0"
                 :for="'line'+checkbox.val">{{checkbox.name}}</label>
          <label class="checkbox ico-yellow" v-else-if="checkbox.val == 1"
                 :for="'line'+checkbox.val">{{checkbox.name}}</label>
          <label class="checkbox ico-green" v-else-if="checkbox.val == 2"
                 :for="'line'+checkbox.val">{{checkbox.name}}</label>
          <label class="checkbox ico-blue" v-else-if="checkbox.val == 3"
                 :for="'line'+checkbox.val">{{checkbox.name}}</label>
        </div>
        <!--<div class="item checkbox-box">
                    <input type="checkbox" name="line" id="line2"/>
                    <label class="checkbox ico-yellow" for="line2">会员充值</label>
                </div>
                <div class="item checkbox-box">
                    <input type="checkbox" name="line" id="line3"/>
                    <label class="checkbox ico-green" for="line3">商家充值</label>
                </div>
                <div class="item checkbox-box">
                    <input type="checkbox" name="line" id="line4"/>
                    <label class="checkbox ico-blue" for="line4">购物预估奖励</label>
                </div>-->
      </div>
    </div>
    <!---->
    <div class="bg-f pd-lr-10">
      <p class="clearfix fz14 totle-title">
        <span class="fl-l">近7天收益统计信息</span>
        <span class="fl-r bg-shadow">累计收益{{profitCount || 0}}元</span>
      </p>
      <div class="flex-box fz12">
        <div class="item">
          <p>会员充值收益</p>
          <p class="fz15 fw-6">{{memberRechargeProfitCount || 0}}</p>
        </div>
        <div class="item">
          <p>商家充值（包括邀请商家）</p>
          <p class="fz15 fw-6">{{shopRechargeProfitCount || 0}}</p>
        </div>
        <div class="item">
          <p>会员预估收益</p>
          <p class="fz15 fw-6">{{memberEstimateProfitCount || 0}}</p>
        </div>
      </div>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>


<script>
  import {getStoreProfitStatistics} from '@/assets/js/getData'

  export default {
    props: ['partnerToken'],
    data() {
      return {
        time: '',
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: '',
        shopName: this.$route.query.shopName,
        shopId: this.$route.query.shopId,
        profitCount: 0,//总收益
        shopRechargeProfitCount: 0,// 商家充值收益
        memberRechargeProfitCount: 0,// 会员充值收益
        memberEstimateProfitCount: 0,//会员购物预收益
        selectList: [
          {val: 0, name: "全部"},
          {val: 1, name: "会员充值"},
          {val: 2, name: "商家充值"},
          {val: 3, name: "购物预估奖励"}
        ],
        select: [0, 1, 2, 3],
      }
    },
    mounted() {
      var _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        this.getProfitStatistics();
      });
      //this.drawLine();
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
      //选择曲线分类
      selectType(id) {
        let _self = this;
        console.log(id)
        let idIndex = this.select.indexOf(id);
        if (idIndex >= 0) {// 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
          this.select.splice(id, 1);
        } else {// 选中该checkbox
          this.select.push(id);
        }
        /*let _data = _self.lineData ;
            let _data.ydata = _data.ydata.splice(id, 1);*/
        console.log(this.select)
        this.getProfitStatistics();
      },
      /*绘制曲线图*/
      drawLine(json) {
        console.log(json);
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
          dataZoom:{
            orient:"level", //水平显示
            show:true, //显示滚动条
            start:0, //起始值为20%
            end:100,  //结束值为60%
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
              data: json.ydata[0],
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
            {
              name: '会员充值',
              type: 'line',//平滑曲线
              smooth: true,  //这句就是让曲线变平滑的
              data: json.ydata[1],
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    {offset: 0.2, color: '#8fc31f'}, // 0% 处的颜色
                    {offset: 1, color: '#8fc31f'}// 100% 处的颜色
                  ],
                  globalCoord: true // 缺省为 false
                }
              },
            },
            {
              name: '商家充值',
              type: 'line',//平滑曲线
              smooth: true,  //这句就是让曲线变平滑的
              data: json.ydata[2],
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    {offset: 0.2, color: '#ffa61a'}, // 0% 处的颜色
                    {offset: 1, color: '#ffa61a'}// 100% 处的颜色
                  ],
                  globalCoord: true // 缺省为 false
                }
              },
            },
            {
              name: '购物预估奖励',
              type: 'line',//平滑曲线
              smooth: true,  //这句就是让曲线变平滑的
              data: json.ydata[3],
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    {offset: 0.2, color: '#ffa61a'}, // 0% 处的颜色
                    {offset: 1, color: '#ffa61a'}// 100% 处的颜色
                  ],
                  globalCoord: true // 缺省为 false
                }
              },
            },
          ]
        });
      },
      //获取收益统计参数
      getProfitStatistics() {
        let _self = this;
        let _data = {
          token: _self.token,
          time: _self.time,
          shopId: _self.shopId
        };
        _self.$getSignIn(_data).then(sec => {
          getStoreProfitStatistics(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.profitCount = _data.data.profitCount;
              _self.shopRechargeProfitCount = _data.data.shopRechargeProfitCount;
              _self.memberRechargeProfitCount = _data.data.memberRechargeProfitCount;
              _self.memberEstimateProfitCount = _data.data.memberEstimateProfitCount;
              //得到数据，绘制图表
              let _day = [], _arry = [], _arry1 = [], _arry2 = [], _arry3 = [], _arry4 = []; // 时间轴和数据轴
              _data.data.memberEstimateProfitList.forEach((i, n) => { //购物预估收益
                _arry4 = _arry4.concat(i.totalMoney);
              });
              _data.data.shopRechargeProfitList.forEach((i, n) => { //商家充值
                _arry3 = _arry3.concat(i.totalMoney);
              });
              _data.data.memberRechargeProfitList.forEach((i, n) => { // 会员充值时间集合
                _arry2 = _arry2.concat(i.totalMoney);
              });
              _data.data.profitTotalList.forEach((i, n) => { //  总收益时间集合
                _day = _day.concat(i.transTimeStr);
                _arry1 = _arry1.concat(i.totalMoney);
              });
              let _json = {};
              _json.xdata = _day;
              _self.select.indexOf(0) >= 0 ? _arry[0] = _arry1 : _arry[0] = []; // 全部
              _self.select.indexOf(1) >= 0 ? _arry[1] = _arry2 : _arry[1] = []; //会员充值
              _self.select.indexOf(2) >= 0 ? _arry[2] = _arry3 : _arry[2] = []; //商家充值
              _self.select.indexOf(3) >= 0 ? _arry[3] = _arry4 : _arry[3] = []; //购物预估奖励
              _json.ydata = _arry;
              console.log(_json)
              _self.drawLine(_json); // 绘制曲线图
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      }
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/charts.css';
  @import '../../../../assets/css/partner_base.css';
  .totle-title {
    padding: 15px 0;
  }

  .totle-title + .flex-box {
    padding: 15px 0;
  }
</style>
