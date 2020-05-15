<template>
  <div>
    <!--标题栏-->
    <header class="bg-f">
      <h3 class="border-buttom ">收益统计</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
    </header>
    <div style="height: 44px;"></div>
    <!---->
    <div class="bg-f">
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
        <div class="fl-r">收益统计图</div>
      </div>
      <!--曲线图-->
      <div class="chart" id="myChart" :style="{width: '355px', height: '320px'}"></div>
      <div class=" border-top mb-5 total-box">
        <p class="clearfix ">
          <span class="fl-l fz12">累计收益总额</span>
          <span class="fl-r fz15 fw-6">￥22<i class="right-arrow"></i></span>
        </p>
      </div>
    </div>
    <!---->
    <div class="bg-f">
      <!--tab-->
      <div class="flex-box fz14">
        <div class="item">
          <input type="radio" name="shouyi" id="shouyi1" checked="checked" @click="getList"/>
          <label for="shouyi1">已结算</label>
        </div>
        <div class="item">
          <input type="radio" name="shouyi" id="shouyi2" @click="getPredictList"/>
          <label for="shouyi2">预结算</label>
        </div>
      </div>
      <!--list-->
      <!--list-con-->
      <div>
        <div class="nullImg" v-if="titleList.length == 0"><img src="@/assets/imgs/partnerCenter/null.png" width="50%"/>
        </div>
        <ul v-for="con in titleList" v-else>
          <div class="bg-c fz10 con-title">
            <p class="fw-6">{{con.transDate}}</p>
            <p class="fc-c">共{{con.totalOrder}}笔收入 预估收入￥{{con.totalMoney}}</p>
          </div>
          <li v-for="item in list " class="mb-5 bg-f list-con" v-if="item.createTime == con.transTime">
            <p class="fz13 clearfix">
              <span class="fl-l">用户账号：{{item.username}}</span>
              <span class="fl-r fc-r">订单状态</span>
            </p>
            <p class="fz12 name"><i class="ico ico-store "></i>{{item.title}}</p>
            <div class="relative fz10 fc-c">
              <p>直接收益：{{item.remark}}</p>
              <p>充值时间：2018-08-08</p>
              <div class="sum-box">
                <p>收益金额</p>
                <button type="button" class="btn-sum btn-border">￥{{item.transMoney}}</button>
              </div>
            </div>
          </li>
          <!--<li class="mb-5 bg-f list-con">
                        <p class="fz13 clearfix">
                            <span class="fl-l">用户账号：454545</span>
                            <span class="fl-r fc-r">订单状态</span>
                        </p>
                        <p class="fz12 name"><i class="ico ico-jd "></i>商品标题商品标题商品标题商品标题商品标题商品标题</p>
                        <p class="fc-c fz9">店铺名称：不错仅代表</p>
                        <p class="fc-c fz9">创建时间：2018-0808</p>
                        <p class="fc-c fz9">结算时间：2018-0808</p>
                        <div class="flex-box fz9">
                            <div class="item">
                                <p>收入比例</p>
                                <div class="btn-border">76%</div>
                            </div>
                            <div class="item">
                                <p>分成比例</p>
                                <div  class="btn-border">76%</div>
                            </div>
                            <div class="item">
                                <p>付款金额</p>
                                <div class="btn-border">￥21545</div>
                            </div>
                            <div class="item">
                                <p>预估收入</p>
                                <div class="btn-sum btn-border">￥21545</div>
                            </div>
                        </div>
                    </li>-->
        </ul>
      </div>
      <!--等待-->
      <div class="loading-box" v-show="showLoad">
        <i class="loading"></i>
      </div>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getZstAmounts , getPreincomeAmounts} from '@/assets/js/getData'

  export default {
    props: ['partnerToken'],
    data() {
      return {
        scrollState: true,
        showLoad: false, //是否显示滚动加载状态
        titleList: [], //list内容
        tip: '',
        token: ''
      }
    },
    mounted() {
      var _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
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
      /*获取（已结算）收益列表*/
      getList() {
        let _self = this;
        _self.type = 1;
        if (_self.pageNum == 1) {
          _self.list = [] , _self.titleList = []; //清空列表内容
        }
        let _data = {
          token: _self.token,
          typeGroup: 1,
          pageNum: _self.pageNum,
          limit: _self.limit,
          transYear: _self.transYear,
          transMonth: _self.transMonth,
          platform: _self.platform, //订单类型
          begintime: _self.begintime, //筛选的开始时间
          endtime: _self.endtime, //筛选的结束时间
        };
        _self.$getSignIn(_data).then(sec => {
          getZstAmounts(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              if (_data.data.length < _self.limit) { //获取的数据小于每页数量，已到达最后一页
                _self.scrollState = false; //禁止滚动加载
                console.log("数据小于20")
              }
              _self.list = _self.list.concat(_data.data);
              _self.titleList = _self.titleList.concat(_data.countZstamountlog); //将数据累加
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
      /*获取（预结算）收入列表*/
      getPredictList() {
        let _self = this;
        _self.type = 2;
        if (_self.pageNum == 1) {
          _self.list = [] , _self.titleList = []; //清空列表内容
        }
        let _data = {
          token: _self.token,
          typeGroup: 1,
          pageNum: _self.pageNum,
          limit: _self.limit,
          platform: _self.platform, //订单类型
          begintime: _self.begintime, //筛选的开始时间
          endtime: _self.endtime, //筛选的结束时间
        };
        _self.$getSignIn(_data).then(sec => {
          getPreincomeAmounts(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              if (_data.data.length < _self.limit) { //获取的数据小于每页数量，已到达最后一页
                _self.scrollState = false; //禁止滚动加载
                console.log("数据小于20")
              }
              _self.list = _self.list.concat(_data.data);
              _self.titleList = _self.titleList.concat(_data.countZstamountlog); //将数据累加
            } else {

              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
    }
  }
</script>

<style scoped>
  @import '../../../assets/css/charts.css';
  @import '../../../assets/css/partner_base.css';
  .total-box {
    margin: 0 10px;
    line-height: 45px;
    padding-left: 31px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAqCAMAAAD26OlUAAAA4VBMVEUAAAD/xEX/x0//z1T/xkT/ujH/wTv/vzb9qyP/yEj/0V7/0mf9piD+tCv/34L/12X/zlb/zV3/2G3/x0/8pCD+yE79uzz8pCD/ujb/23b9qyf/wkL/2nn/123/23z/2HP/3Hr/xkz+yFL+wkT/34X9qiP/1WH+uTH/66H/1WL/vjj9qyT/1WX+xk//2Wn+vDz/4ID/y1H9riz/1Wj9vD3/7KX/5pr/23z/7ar/7q79xE7/z1X/12n/yUn/xT//0mH/vzX9qiP+ti3/3nT9sCj/7an/4nf/6Zf/5or/65//5IMB32IpAAAAO3RSTlMAGghMR0PyTkz0IjPu74pe8Q715uPWvXhYOyjl3b+yn3t7bWNRNvLy6uPa2NLAsKyln5KOdGhBzsGji+EyIMgAAAIISURBVDjLhdJnQ+JAEAbgzaKACUVAEVBA2lnPrlcyyeTIkQT+/w+6mU1RDpJ9P7DD5mG2BKHNx6/rd71qvf9crVZrqWFG43rNLpxr3GYTheE6DKOnYmgGQbCJomgTtDVr94e+HwQ+ADSFJhZQEPFBB5uINgdNzS6JOdNpx7aNYniDttOhsaRp+ADU0BLaNIAa/lZbLTz1pU8Nv1Mh78Efa9wpVyUAH/LXVU6msJ3D5Ei5loihnwf7F2p/UiQQ4FvesuSeuVQQ98OPH9zOmYgM0js83mHWk2JHPVEIrbHPt+x0+Z0Zr5cZPNpi81HMzmf8rXUD/mgP7DcuSDGbxKc9QLoWI4ZOAo15qtzbN/nlsGBy4TgMZfN12AZEVuXHijJJRwQ0MihPbe5Eyu2+8fQntBG/QNNVKXdnmZpNZQwpn1A8el73pdISWZ4R7yVDh5JAl6AYGNv/BxsB+gl0FeQVxU7kMcESQ5fCsPIftKwUIh4UwAnCOIZ0hhR6u7DF12sx7NDeCqDJ11tiWKb5QyoOPYqCNBI0LQUNG5FWZEjze2ATYCgZOpR8eCU6dtzI8JLnsr5cLhVcUhSk8UqcU6MeQ57Oh3VxS40qDP9SqgpSwbDKM0ZS1AX/XnX8Q1EwLapcMOxxIe7oY5E+HwhKLSkGPMPnXNBYE4u72ovgVE9qZ9vFWe2kmhX/AEOPeZ+HcKEsAAAAAElFTkSuQmCC) no-repeat left center;
    background-size: 20px;
  }
</style>
