<template>
  <div>
    <!--顶部-->
    <div class="head-bg">
      <!--标题栏-->
      <div class="border-buttom" id="head-bg" :style="'height:'+(status_bar_height+44)+'px'"></div>
      <header class="fc-f " :style="'padding-top:'+status_bar_height+'px'">
        <h3>收益统计</h3>
        <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
        <i class="icon ico-select" @click="showSelect"></i>
      </header>
      <div :style="'height:'+(status_bar_height+44)+'px'"></div>
      <!--顶部总收益详情-->
      <div class="fc-f head-box">
        <p class="fz25"><span class="fz40">{{userCash.thisMonthProfit || "0"}}</span></p>
        <p class="fz15">本月收益(元)</p>
        <div class="flex-box fz14">
          <div class="item border-right">
            <p>本月预估收入(元)</p>
            <p>{{userCash.thisMonthEstimateProfit || "0"}}</p>
          </div>
          <div class="item">
            <p>上月预估收入(元)</p>
            <p>{{userCash.lastMonthEstimateProfit || "0"}}</p>
          </div>
        </div>
        <p class="fz10 p-tip">注：上月预估收入在本月23号结算</p>
      </div>
    </div>
    <!--list-->
    <div class="bg-f list-box">
      <!--list-head-->
      <div>
        <p class="fc-f fz12 sum-total">历史总收益:{{userCash.totalProfitNumber || "0"}}元</p>
        <div class="flex-box fz14">
          <div class="item">
            <input type="radio" name="shouyi" id="shouyi1" value="1" v-model="type" :checked="type == 1"
                   @change="selectList"/>
            <label for="shouyi1">已结算</label>
          </div>
          <div class="item">
            <input type="radio" name="shouyi" id="shouyi2" value="2" v-model="type" :checked="type == 2"
                   @change="selectList"/>
            <label for="shouyi2">预结算</label>
          </div>
        </div>
      </div>
      <!--list-con-->
      <div>
        <!--已结算-->
        <div>
          <div class="nullImg" v-if="titleList.length == 0"><img src="@/assets/imgs/partnerCenter/null.png"
                                                                 width="50%"/></div>
          <div else>
            <ul v-for="con in titleList">
              <div class="bg-c fz10 con-title">
                <p class="fw-6">{{con.transDateStr}}</p>
                <p class="fc-c">共{{con.totalOrder}}笔收入 <span v-show="type == 1">已结算</span><span
                  v-show="type == 2">预估</span>收入￥{{con.transMoney}}</p>
              </div>
              <li v-for="item in list " class="mb-5 bg-f list-con"
                  v-if="item.transTimeStr.indexOf(con.transDateStr)>=0">
                <p class="fz13 clearfix" v-show="item.platform != 4">
                  <span class="fl-l" v-show="!(item.transType == 20 || item.transType == 60 || item.transType == 65 || item.transType == 66) && type==2">用户账号：{{item.username}}</span>
                </p>
                <p class="fz12 name">
                  <!--platform : （0其他 1淘宝  2京东 3推广 4会员推荐联盟商家充值 9为拼多多-->
                  <i class="ico ico-tb" v-if="item.platform == 1"></i>
                  <i class="ico ico-jd" v-else-if="item.platform == 2"></i>
                  <i class="ico ico-vip" v-else-if="item.platform == 3"></i>
                  <i class="ico ico-pdd" v-else-if="item.platform == 9"></i>
                  <i class="ico ico-store" v-else></i>
                  {{item.title}}
                </p>
                <div v-if="item.platform == 1 || item.platform == 2 || item.platform == 9">
                  <p class="fc-c fz9" v-html="item.remark"></p>
                  <div class="flex-box fz9">
                    <div class="item">
                      <p>收入比例</p>
                      <div class="btn-border">{{(item.incomeRatio*100).toFixed(2)}}%</div>
                    </div>
                    <div class="item">
                      <p>分成比例</p>
                      <div class="btn-border">{{(item.fenChengRate*100).toFixed(2)}}%</div>
                    </div>
                    <div class="item">
                      <p>付款金额</p>
                      <div class="btn-border">￥{{item.payMoney}}</div>
                    </div>
                    <div class="item">
                      <p>收益金额</p>
                      <div class="btn-sum btn-border">￥{{item.transMoney || 0}}</div>
                    </div>
                  </div>
                </div>
                <div class="relative fz10 fc-c" v-else>
                  <p v-html="item.remark"></p>
                  <p v-show="!(item.transType == 20 || item.transType == 60 || item.transType == 65 || item.transType == 66) && type==2">充值时间：{{item.transTimeStr }}</p>
                  <div class="sum-box">
                    <p>收益金额</p>
                    <button type="button" class="btn-sum btn-border">￥{{item.transMoney}}</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!--预结算-->
      </div>
      <!--等待-->
      <div class="loading-box" v-show="showLoad">
        <i class="loading"></i>
      </div>
    </div>
    <!--筛选条件-->
    <div v-show="selectShow">
      <div class="mask" @click="hideSelect"></div>
      <div class="select-box bg-f fz14" :style="'top:' +(44+status_bar_height)+'px'">
        <!--tab-->
        <div class="flex-box border-buttom tab-box">
          <div class="item">
            <input type="radio" name="tabType" id="tabType1" checked="checked" value="1" v-model="tabCon"/>
            <label for="tabType1">订单类型</label>
          </div>
          <div class="item">
            <input type="radio" name="tabType" id="tabType2" value="2" v-model="tabCon"/>
            <label for="tabType2">时间</label>
          </div>
        </div>
        <!--tab-con-->
        <div v-if="tabCon == 1">
          <ul>
            <li class="relative">
              <input type="radio" name="select" id="select0" value="" @change="selectType" v-model="platform"/>
              <label for="select0">全部</label>
            </li>
            <li class="relative">
              <input type="radio" name="select" id="select1" value="1" @change="selectType" v-model="platform"/>
              <label for="select1">淘宝</label>
            </li>
            <li class="relative">
              <input type="radio" name="select" id="select2" value="2" @change="selectType" v-model="platform"/>
              <label for="select2">京东</label>
            </li>
            <li class="relative">
              <input type="radio" name="select" id="select9" value="9" @change="selectType" v-model="platform"/>
              <label for="select9">拼多多</label>
            </li>
            <!--<li class="relative">
              <input type="radio" name="select" id="select3" value="3" @change="selectType" v-model="platform"/>
              <label for="select3">用户会员</label>
            </li>
            <li class="relative">
              <input type="radio" name="select" id="select4" value="4" @change="selectType" v-model="platform"/>
              <label for="select4">加盟商加盟</label>
            </li>-->
          </ul>
        </div>
        <div class="select-time" v-else>
          <div class="clearfix">
            <input class="" type="datetime" placeholder="请选择开始时间" v-model="begintime"/>
            ———
            <input class="" type="datetime" placeholder="请选择结束时间" v-model="endtime"/>
          </div>
          <div class="clearfix">
            <button type="button" class="btn fl-l" @click="resetTime">重置</button>
            <button type="button" class="btn fl-r" @click="selectType">完成</button>
          </div>
        </div>
      </div>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getAgZstMenuData , getZstAmounts , getPreincomeAmounts} from '@/assets/js/getData'
  import {closeWebView , timestampToTime , postColor} from "@/assets/js/jsBridge";

  export default {
    // props: ['partnerToken'],
    data() {
      return {
        scrollState: true,
        showLoad: false, //是否显示滚动加载状态
        pageNum: 1, //list的页数
        limit: 20,
        userCash: {}, //用户现金账户信息
        list: [], // 已结算收益列表内容
        titleList: [], //列表头的内容
        type: this.$route.query.entryType || 1, //1为已结算  ， 2为预结算
        selectShow: false, //筛选内容框是否出现
        tabCon: 1, //筛选tab切换 ，1为订单类型 ，2为时间
        begintime: '', // 开始时间
        endtime: '', //结束时间
        platform: '', //订单类型
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        tip: '',
        token: '',
        entryType: this.$route.query.entryType, // 页面入口，假如为2，则从上月结算收益进入本页面
        lastRecordTime: 0,
      }
    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getCashAccount();
        _self.entryType == 2 ? _self.getPredictList() : _self.getList();
      });
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /*返回上一页*/
      back() {
        if (window.history.length <= 1) {
          closeWebView(); //关闭webview
        } else {
          this.$route.query.close == 1 ? closeWebView() : this.$router.go(-1);//返回上一层
        }
        //上面都没执行就说明卡在当前页不是最后一条， histroy记录数量大于1，又没有回退记录，只能返关闭webview
        //如果上面都执行了 页面都跳走了，这个也就不用管了
        /*setTimeout(() => {
            comm.closeWebView(); //关闭webview
        },500);*/
      },
      /*获取现金账户信息*/
      getCashAccount() {
        let _self = this;
        let _data = {
          token: _self.token,
        };
        _self.$getSignIn(_data).then(sec => {
          getAgZstMenuData(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.userCash = _data.data.accountInfo;
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          })
        })
      },
      /*获取（已结算）收益列表*/
      getList() {
        let _self = this;
        _self.type = 1;
        let _data = {
          token: _self.token,
          typeGroup: 1,
          pageNum: _self.pageNum,
          pageSize: 9,
          limit: _self.limit,
          transYear: _self.transYear,
          transMonth: _self.transMonth,
          platform: _self.platform, //订单类型
          begintime: _self.begintime, //筛选的开始时间
          endtime: _self.endtime, //筛选的结束时间
          lastRecordTime: _self.lastRecordTime,
        };
        _self.$getSignIn(_data).then(sec => {
          getZstAmounts(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              if (_data.data.length < _self.limit) { //获取的数据小于每页数量，已到达最后一页
                _self.scrollState = false; //禁止滚动加载
              }else{
                _self.scrollState = true
              }
              if (_self.pageNum == 1) {
                _self.list = [] , _self.titleList = []; //清空列表内容
              }
              _data.data.forEach((n) => {
                n.createTimeStr = timestampToTime(n.createTime);
                n.transTimeStr = timestampToTime(n.transTime); //将时间戳转为正确格式
              });
              _self.list = _self.list.concat(_data.data);
              _self.titleList = _self.titleList.concat(_data.countZstamountlog); //将数据累加
              _self.lastRecordTime = _data.data.pop().transTime;
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          })
        })

      },
      /*获取（预结算）收入列表*/
      getPredictList() {
        let _self = this;
        _self.type = 2;
        let _data = {
          token: _self.token,
          typeGroup: 1,
          pageNum: _self.pageNum,
          pageSize: 9,
          limit: _self.limit,
          platform: _self.platform, //订单类型
          begintime: _self.begintime, //筛选的开始时间
          endtime: _self.endtime, //筛选的结束时间
          lastRecordTime: _self.lastRecordTime,
        };
        _self.$getSignIn(_data).then(sec => {
          getPreincomeAmounts(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              if (_data.data.length < _self.limit) { //获取的数据小于每页数量，已到达最后一页
                _self.scrollState = false; //禁止滚动加载
              }else{
                _self.scrollState = true
              }
              if (_self.pageNum == 1) {
                _self.list = [] , _self.titleList = []; //清空列表内容
              }
              _data.data.forEach((n) => {
                n.createTimeStr = timestampToTime(n.createTime);
                n.transTimeStr = timestampToTime(n.transTime); //将时间戳转为正确格式
              });
              _self.list = _self.list.concat(_data.data);
              _self.titleList = _self.titleList.concat(_data.countPreincomeOrderlog); //将数据累加
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          })
        })

      },
      //选择收益的类型
      selectList() {
        let _self = this;
        _self.lastRecordTime = 0;
        _self.pageNum = 1;
        if (_self.type == 1) { //1为已结算
          _self.getList();
        } else if (_self.type == 2) {//2为预结算
          _self.getPredictList();
        }
      },
      //选择订单类型
      selectType() {
        let _self = this;
        _self.lastRecordTime = 0;
        _self.pageNum = 1;
        if (_self.type == 1) { //1为已结算
          _self.getList();
        } else if (_self.type == 2) {//2为预结算
          _self.getPredictList();
        }
        _self.selectShow = false;
      },
      //点击显示选择框
      showSelect() {
        this.selectShow = true;
      },
      //点击隐藏选择框
      hideSelect() {
        this.selectShow = false;
      },
      //重置时间输入框内容
      resetTime() {
        this.endtime = '';
        this.begintime = '';
      }
    },
    mounted() {
      let _self = this;
      postColor('ff8b8b'); //传递顶部的手机导航栏的色值给安卓
      window.addEventListener('scroll', function () {
        let _head_h = document.querySelector('.head-bg').clientHeight; //渐变背景色的div高度
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        let header = document.querySelector('#head-bg');
        _self.headRgba = scrollTop / _head_h;
        header.style.opacity = _self.headRgba;
        document.querySelector('header').setAttribute("class", "fc-black");
        if (_self.headRgba == 0) {
          document.querySelector('header').setAttribute("class", "fc-f");
        }
        // 判断是否滚动到底部
        if ((scrollTop + window.screen.availHeight) >= (document.body.offsetHeight - 100)) {
          if (_self.scrollState == true) { //加下状态
            _self.scrollState = false;
            _self.showLoad = true;
            _self.pageNum = _self.pageNum + 1;
            setTimeout(() => {
              _self.showLoad = false;
              if (_self.type == 1) { //已结算
                _self.getList();
              } else if (_self.type == 2) { //预结算
                _self.getPredictList();
              }
            }, 1500);
          }
        }
      });

    }
  }


</script>

<style scoped>
  @import '../../assets/css/partner_base.css';
  .head-bg {
    background: linear-gradient(#ff8b8b, #f81552);
  }

  .head-box {
    text-align: center;
    padding-top: 6px;
    padding-bottom: 17px;
  }

  .head-box .fz15 {
    padding: 10px 0;
    line-height: 1;
  }

  .border-right:after {
    background: #fff;
  }

  .ico-select {
    width: 13px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAlCAMAAACEemK6AAAAM1BMVEUAAAD///////////////////////////////////////////////////////////////+3leKCAAAAEHRSTlMA75uAkxP5qIh7BaENMBrn+IJ8jQAAAH5JREFUOMvd0GEOgjAQROHH0hYQUO5/WhNNNpbpXMD5+/I16RJtGq8F5+V2wmJSAE/TKiRU1kFhsA9S4btqWEJhDraDXNzaChYmS6hMYXvQrQgTmMzAjfsOZQqVQZ0+6ZVM/zgzWpEnxf1tW3xjzWaga0TX9NwbbvNVsNt/2hvT6hhadxnp7gAAAABJRU5ErkJggg==) no-repeat center;
    background-size: 13px 18px;
  }

  .sum-total {
    text-align: center;
    margin: 0 auto;
    line-height: 27px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAXQAAAA3CAMAAAArBkEXAAAAgVBMVEUAAAD/Snz/ZIL/YoH/Y4L/dYb/TXz/THz/cYX/c4b/Z4P/cYX/UX7/hYr/XID/Tnz/Tn3/c4X/V3//dob/kI3/hYr/YIH/THz/R3v/dYf/U37/V3//foj/W4D/YIH/ZIL/bIT/aIP/cIX/UH3/hYr/gon/eYf/jIz/iIv/kI3/k41FXBQ7AAAAF3RSTlMA4WAYCndQsUUy3qAls5DTovLwxvPhw4y1WTEAAAIiSURBVHja7dLXViJREIXh3TnRTVJbnbGdJBPe/wFHpJEOJwCncAnsr67r5l8b6T+tv/J+f4Q/h/ol6sUmRXjDsjJl7b6+3UsIlCwrVbZNq753JYCIZSXCtreHCECmCsGyhrSOMry6ueqy2s0KWnXNsVZeflldWPGydg8l1qILKeuwWfGyBhHWsnMq+5k2a7DS3kOGN7efrex5bHZlOL0cGyU3e0za4xTY8LlZ/R3rh4aPjYCblSprF6B1y82aygr6lmOr4GZFyxoU2PK5WZmydj62Am5WU1bS97UA75bcrFRZsxw7BTcrUdauwk7KzY7LSnpupdgJV9ysQFm7EB1Lbta9rN0duiKW7ZUV1rQqdKUs66yxS9EVzlnWtazdc4ieJcvuNIKeOneHvohlpdI+aUXoy1jWtaxdhoE5y47LylpgqGBZEV/0Egz5LOtW1i7C0IRlh2WlZRjJWVbcY9cCYwXLupS1m2HMZ1lTWXc+xgKWfTypCRRylpXwU8ODSsWyDmWtZlDxm4Zle2Ul1TFUApZ1VRsEUMpZ1qGsxRRqVS8Ey4qqoBaz7OnEUAsXLCvlfqAOoZGwrEPZvrp39wl0YpYdM4U13EAMrSnLHpJ2/68p9NJrLasPe8zXWAyD2SWXddis6g6QwCScnntZ2c3K8AIYTbxzKCu82RPzJoCtem103ZsVb94KEm5WUhJgH77HzUrxfOwrTjxu1lntzeIQCv8BMsQDGtv+9fEAAAAASUVORK5CYII=) no-repeat center;
    background-size: auto 27px;
    margin-bottom: 6px;
  }

  input[type="radio"] {
    opacity: 0;
    position: absolute;
  }


  .p-tip {
    width: 86.66666%;
    text-align: center;
    border-radius: 19px;
    margin: 6px auto 0;
    background: rgba(0, 0, 0, 0.1);
    color: #fea2af;
    padding: 3px 10px;
  }


  /*ico小图标*/
  .ico {
    display: inline-block;
    width: 13px;
    height: 13px;
    vertical-align: text-bottom;
    margin-right: 11px;
  }

  .ico-store {
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAflBMVEX5HFL/VED5HFP/VUD4G1P/VUAAAAD////6HlH/VED6K037Mkv+TEL8Okn9Qkb+09z/zdf/u7T+4OT+t7z/8/X9tML+o6r9hY//+fr/7vD/6Or+wsj+usP/vb3+sLf+qq78lqz9j6L+nZz/i4P+dXn9XGv8T1/+XFj/gXT+amDePmN1AAAAB3RSTlPy8q6uKCYAafyiBwAAAMJJREFUKM9ty9kSgjAMheHI1oIWEARkXxV9/xc0DQ5TWv6LXJxvAp5rX3y9i+164NJumgu2f54N9PK5q830BDdZyQ7RhuLfVnbsuwk2azLt0moS71Jp8iAJw3BleguuUiZD+r+khrRShBCLIQWuUkTHsPy531qQyIq0f4l3GjV487QQJFcs7q5qYyIvSZUcpGYkAZZEgVrzkPdMsk04VkZcLWPyAg84H1isxjISojFSGzhuABY/zwIHTgF3z7FMA8vxfmvNGn2bZhd7AAAAAElFTkSuQmCC) no-repeat center;
    background-size: cover;
  }

  .ico-vip {
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAYFBMVEX/vxr/1hr/qhr/1hr/qRoAAAD/0xr/////rBr/yRv/uRr/whr/+Of/9Nf/7r///fL/0zT/3nb/7LD/66X/8sn/6J//5JD/34X/zEP/21n/xy3/5rb/5oP/1nz/zGv/wUEMAYPYAAAABnRSTlMn8vKurgCJ9g4DAAAA5ElEQVQoz3WOWZLCMAxERbaOI8eOsxO2+99yJBMGF5DnH3W/kspUUn6qPjnl0lPsvx1RXv0m15WDpSRc26F7J6rMazx74PoKRs3+qgBgqP5zcq0bYc/JNWO6ee6MEjAYpZsmKcT02BuHVppYuGgsMGqhPwg6jIAXw7x49CxMAHrDrDszsxgO3s+GVyvGrrxN8ItRIzhg2AKUsElwzLtZIKmF0o4AlmgaQQ6l2FVLMYJDimve5oaU225qeQ+bHns8Ta00l8RcmtiJ0eHeRqxyr58mq3+TUXFgCqLsYIVKKr5dVlD5B8sTFf9kj99rAAAAAElFTkSuQmCC) no-repeat center;
    background-size: cover;
  }

  .ico-jd {
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAATlBMVEWgBASgBASgBAQAAACgBAT////99/ewLCznvr7LdHTFY2P36OjOfHyqHx/tzs7IbGymExPz39/v1dXhrq7Shoa/U1P57e3Ujo7BW1vanZ06TnTxAAAABHRSTlPyrSYAjYL1oQAAAKlJREFUKM+V0lsSgyAMBdCAuaA8xLd2/xtthdo61nz0/mXOTAaSUKUV8TWkdEWa+C6kSfF9FJEgB4zeMQ9+WYwfVluoSIvAjCPTSWo0zAaztXYegcePdLlwgLuKLVWC6e6FBwRBElpBIowgDMjyd7cG9Xc621l6pLdYIJ5k+vw0eoy8S4EAzPySza2A7/KDgnMu9GXYlGffxtzdIMenvZJ3Kt+BfDvyvT0Be4cM+zi71z4AAAAASUVORK5CYII=) no-repeat center;
    background-size: cover;
  }

  .ico-tb {
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAABICAMAAACN8ShLAAAAP1BMVEUAAAD/VQD/VQD/VQD/VAD/UwD/UwD/VAD/VAD/VAD/VQD/UwD/UwD/VAD/VAD/VQD/VAD/VQD/VAD/VAD/VQD6evJ+AAAAFHRSTlMA9N3FkGwfqZoz00ITXVHpgp+1eamSi6oAAALuSURBVFjDrZhbloMgDECR8JCXWGX/ax2ljVFAz0yH+1VavEAMUGCIktoOf8VqqdgVpdO3jBeXTP9BkuiV/sfYSUQqmf5PyMFOPfCbKb+1HuPzqQ8eo9QhUrqT6cWgkwkY72Sy3Uz80STH+LVpdMpIDN3MmJ9G/o2JG5ZZPyN/48SfTcOx0uRnj5LC3+G1Bmc2XJg1fzAJdjCktDJkH23U0rArZuZ3Jke1lmQZ4lIUjjWRQ9t0ahSSouqS3aKgaTo9gSOt8RvnMrRM9tTr8nnjwjpqsHHYI6+nS0jRVK/HJrmrB+pppo5Wm5kJu8HL89ic2tW2UkVPnWrOFgswJE69WRaPb6lA03uuTdjy0fOQEr6k0kS15tr0Yi6XAqU6VpcPG6asTPB+mEz6SFZjLVzhW8PYcTQVOTANKY0omtkdMrecma4mirKKW8FR3TYr/epKkyRVDgJPkbGnPtnahK4JVbmE81CANpix4wFQn0wjC7Q/x9Cx8hWERJBJkYmI7jQthcG9Hjs7/dZED5lP3ZCV3/QJx7R/y0cNenltUJwEMgNNF3Njeq8nIyVeG0kmencF4ZMu429N5s6kP7OSC2SkLBAIUFPu0aSxdBtxMk2Po4t7xDJ1FlgpL6ZwY+LYYeczojDlDcsM+6fWqlLuw5pm9FqYKOHm1kpHIoO5tmCLFxNNIjKJlokrXJlonzmZQo4SJjaadMO0eEp/cdoaA1pnp/BrmyRWKE1FI4IWNXCsZjlMvDRxd5mRwJ6BFLB6YaLJIXATahJgys8PWMFdTbbe6Jfa4icdU4rvhLLt3XyuTo3VFDZy+bSx5joYDCDTZeFl54V9Nflbr6Z14YmAlCIt+mWcomutsNEC8AFLA2wlzq0dA0N0YaIRQroHWusUma7/iczziaJkvvk/PkzPR6voGeGVm/n9GUEP6VHFLdgd4DzW/8c70NVk+50U+51e+52o+53yu9089LsN6XZD0+vWSHS7yep2u9b5xq/fLeQPIooLrF9eJtcAAAAASUVORK5CYII=) no-repeat center;
    background-size: cover;
  }

  .ico-pdd {
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAdVBMVEX0AAj4AAT0AAn0AAn2AAj1AAj2AAf2AAf4AAX5AAT0AAn0AAT////9ycv8trj1DxP9v8H7lJn+0tT4WFz+3t/8rbD8pKf/9vf/7/D7nJ77hYr3O0D6fID2LDH5aGz5Ymb3TlH1HiL6i47+5Ob+2Nr5dnr5bnM0FOilAAAAC3RSTlPyAdzmt6GNeR0Lz4z7kz4AAAEuSURBVCjPddHZbgIxDIXhDKUF6mPH2WbfWd7/ETuNUEGI/jeR8km+sE1RHL7Na7uvojDFnt61O5kDve/TfPwj28zfx6463n8mccNDOkChGVb4qg53sS0cy3qV0XaXfvHN7JslS4eKbhgIsIx2RKAeIUvLa5M0qrNkE6BaOm6yKJSjR9+1bTPNVeTIqLOIC96FhfooVUk2OA1tk6UcqJaFyDFXl21iEze1WapUen8eZue4t56FFZGy1FqJIF2ttUGgfElRskxA07GlS0kzbks90Q1tFit1z2maHY+ld+N5XJwf7tsJgMCn2scyQWu0j40OwtyHa4qSRHSmh2xWoQv+SkD3dIVcFwFN63miF9kqoThb+pOnmwa5Pd/0i963N8XuLZijKU6fO/Pax/5Y/AD4SiGSNPY6EQAAAABJRU5ErkJggg==) no-repeat center;
    background-size: cover;
  }


  /*list*/
  .list-box {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    margin-top: -13px;
  }

  .con-title {
    padding: 3px 13px;
  }

  .list-con {
    padding: 11px 10px 16px 12px;
  }

  .list-con .name {
    padding: 8px 0 6px 0;
  }

  .sum-box {
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
  }

  .btn-border {
    min-width: 77px;
    border-radius: 22px;
    line-height: 22px;
    height: 22px;
    margin-top: 2px;
    border: 1px solid #e5e5e5;
    display: inline-block;
  }

  .btn-sum {
    background: #ffa61a;
    color: #fff;
    border-color: #ffa61a;
  }


  /*筛选条件*/
  .select-box {
    position: fixed;
    width: 100%;
    top: 44px;
    z-index: 8;
  }

  .select-box ul {
    padding: 10px 0;
  }

  .select-box li {
    padding: 0 10px;
  }

  .select-box li input[type="radio"]:checked + label:after {
    content: none;
  }

  .select-box input[name="select"] {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .select-box li input[type="radio"]:checked ~ .icon-gou {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEUAAAD3CEz3CEz/AE7/AEr3CEz5Bkz2CUz3CEz4B0z5Bkz3CE33CEv3CEz3CEz4B0v2CUz3CU0WS5bBAAAAEXRSTlMA9uUJFZpPz8OMJXta2qhtsgEYyOEAAADMSURBVDjLhZNbDsUgCEQHEfX27f43exNtxLYa5qdNziAiABWHIzoiF4/A+MoL5SYS/8K8VqyWlR/hKX+UvPLF5YHc0uIr/zr8nT/miWK9xy9P9SsJaG4gD0DGsWe5mAA8PGAD1nIEI0w4rvIXICOumQXprpl6rqUl7OV7sW+vEfrSd9TIFfBxwDOB2rtzUq6GkkIdFFAL1BQpd45LebukvLt75l6C0PdfuZbEpA7/4cSPZrnt3Xox220NjDly1tCaY28vjr169vKa6/8HLvot+ZG8C7AAAAAASUVORK5CYII=) no-repeat center;
    background-size: cover;
    position: absolute;
    right: 10px;
    top: 7px;
  }

  .select-box button {
    width: 100px;
    height: 32px;
    line-height: 32px;
  }

  .tab-box {
    height: 32px;
    line-height: 32px;
  }

  .select-time {
    padding: 10px;
    text-align: center;
  }

  .select-time input {
    border: 1px solid #808080;
    border-radius: 5px;
    height: 34px;
    line-height: 34px;
    width: 40%;
  }
</style>
