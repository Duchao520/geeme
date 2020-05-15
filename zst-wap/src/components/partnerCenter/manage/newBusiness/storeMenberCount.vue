<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom">会员统计</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!---->
    <div class="bg-f mb-5">
      <P class="pd-lr-10 fz14 p-hide pd-tb-5">当前商家：{{shopName || ''}}</P>
      <!--tab-->
      <div class="clearfix bg-f fz15 title">
        <div class="fl-l flex-box fc-c">
          <div class="item">
            <input type="radio" name="type" id="type1" v-model="time" value="30" @change="selectTime"/>
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
            <input type="radio" name="type" id="type4" checked="checked" v-model="time" value="" @change="selectTime"/>
            <label for="type4">全部</label>
          </div>
        </div>
        <div class="fl-r">新增会员统计图</div>
      </div>
      <!--曲线图-->
      <div class="chart" id="myChart" :style="{width: '355px', height: '320px'}"></div>
      <!--曲线分类-->
      <div class="fz12 fc-c line-type flex-box">
        <div class="item checkbox-box" v-for="checkbox in selectList">
          <input type="checkbox" :value="checkbox.val" :checked="select.indexOf(checkbox.val)>=0"
                 @click="selectType(checkbox.val)"/>
          <label class="checkbox ico-shadow" v-if="checkbox.val == 0">{{checkbox.name}}</label>
          <label class="checkbox ico-green" v-else-if="checkbox.val == 1">{{checkbox.name}}</label>
          <label class="checkbox ico-yellow" v-else-if="checkbox.val == 2">{{checkbox.name}}</label>
        </div>
      </div>
    </div>
    <!---->
    <div class="bg-f pd-lr-10">
      <p class="clearfix fz14 totle-title">
        <span class="fl-l">近{{time}}天会员统计信息</span>
        <span class="fl-r total">累计会员{{MemberCount || 0}}人</span>
      </p>
      <div class="flex-box fz12">
        <div class="item">
          <p>直属会员</p>
          <p class="fz15 fw-6">{{directlyMemberCount || 0}}</p>
        </div>
        <div class="item">
          <p>间接会员</p>
          <p class="fz15 fw-6">{{indirectMemberCount || 0}}</p>
        </div>
      </div>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getStoreMembeStatistics} from '@/assets/js/getData'

  export default {
    props: ['partnerToken'],
    data() {
      return {
        time: '',
        type: 0, //曲线分类
        MemberCount: 0, //总 会员人数
        directlyMemberCount: 0,//直属会员
        indirectMemberCount: 0,//间接会员
        lineData: {},//曲线图数据
        all: '1', //
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: '',
        shopName: this.$route.query.shopName,
        shopId: this.$route.query.shopId,
        selectList: [
          {val: 0, name: "全部"},
          {val: 1, name: "直属会员"},
          {val: 2, name: "间接会员"}
        ],
        select: [0, 1, 2],
      }
    },
    mounted() {
      var _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getStoreMembeStatistics();
      });
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
              data: json.ydata[0],
              itemStyle: {
                color: '#f81854'
              },
            },
            {
              name: '直属会员',
              type: 'line',//平滑曲线
              smooth: true,  //这句就是让曲线变平滑的
              data: json.ydata[1],
              itemStyle: {
                color: '#8fc31f',
              },
            },
            {
              name: '间接会员',
              type: 'line',//平滑曲线
              smooth: true,  //这句就是让曲线变平滑的
              data: json.ydata[2],
              itemStyle: {
                color: '#ffa61a',
              },
            },
          ]
        });
      },
      //获取会员统计信息
      getStoreMembeStatistics() {
        let _self = this;
        let _data = {
          token: _self.token,
          time: _self.time,
//	    		/type : _self.type , //曲线分类
          shopId: _self.shopId
        }
        _self.$getSignIn(_data).then(sec => {
          getStoreMembeStatistics(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.MemberCount = _data.data.MemberCount;
              _self.directlyMemberCount = _data.data.directlyMemberCount;
              _self.indirectMemberCount = _data.data.indirectMemberCount;
              //得到数据，绘制图表
              let _day = [], _arry = [], _arry1 = [], _arry2 = [], _arry3 = []; // 时间轴和数据轴
              _data.data.directlyMemberList.forEach((i, n) => { //间接会员时间集合
                _arry3 = _arry3.concat(i.memberCount);
              });
              _data.data.indirectMemberList.forEach((i, n) => { // 直属会员时间集合
                _arry2 = _arry2.concat(i.memberCount);
              });
              _data.data.memberList.forEach((i, n) => { // 总会员时间集合
                _day = _day.concat(i.startDate);
                _arry1 = _arry1.concat(i.memberCount);
              });
              let _json = {};
              _json.xdata = _day;
              _self.select.indexOf(0) >= 0 ? _arry[0] = _arry1 : _arry[0] = []; // 全部
              _self.select.indexOf(1) >= 0 ? _arry[1] = _arry2 : _arry[1] = []; //直属会员
              _self.select.indexOf(2) >= 0 ? _arry[2] = _arry3 : _arry[2] = []; //间接会员
              _json.ydata = _arry;
              _self.lineData = _json;
              console.log(_json)
              _self.drawLine(_json); // 绘制曲线图
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
      //选择时间切换数据
      selectTime() {
        this.getStoreMembeStatistics();
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
        this.getStoreMembeStatistics();
      }
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/charts.css';
  @import '../../../../assets/css/partner_base.css';
  .total {
    display: block;
    background: -webkit-gradient(linear, left top, right top, from(#f81854), to(#ff9540));
    background: linear-gradient(to right, #f81854, #ff9540);
    padding: 0 10px;
    color: #fff;
    line-height: 25px;
    border-radius: 5px;
    border-bottom-left-radius: 0;
  }

  .line-type {
    padding-bottom: 15px;
  }

  .totle-title {
    padding: 15px 0;
  }

  .totle-title + .flex-box {
    padding: 15px 0;
  }
</style>
