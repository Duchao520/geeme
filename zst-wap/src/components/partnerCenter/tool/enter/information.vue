<template>
  <div>
    <!--导航头-->
    <v-subnav></v-subnav>
    <!---->
    <!--商户基本信息-->
    <div class="info-box bg-f">
      <h4 class="fz18 title">商户基本信息</h4>
      <ul class="fz14">
        <li class="border-buttom">
          <span>商家名称：</span>
          <input type="text" placeholder="请输入商家名称 " v-model="shopName" @blur="testShopName"/>
        </li>
        <li class="border-buttom bg-arrow">
          <span>所在城市：</span>
          <input type="text" placeholder="请选择所在城市 " :data-areaCode="areaCode" v-model="areaName" @click="showPicker"
                 readonly="readonly"/>
        </li>
        <li class="border-buttom">
          <span>详细地址：</span>
          <input type="text" placeholder="请输入详细地址 " v-model="unitAddress" @blur="testUnitAddress"/>
          <!--<span id="select-city"  @click="showMap"></span>-->
        </li>
        <li class="border-buttom">
          <span>经营许可证编号：</span>
          <input type="text" placeholder="请输入经营许可证编号 " v-model="certificate" @blur="testCertificate"/>
        </li>
        <li class="clearfix">
          <span>行业类型：</span>
          <span>{{dealCateMatchRow}}</span>
          <span class="fc-r fl-r select" @click="getTradeType">选择</span>
        </li>
      </ul>
    </div>
    <!--掌柜信息-->
    <div class="info-box bg-f">
      <h4 class="fz18 title">掌柜信息</h4>
      <ul class="fz14">
        <li class="border-buttom">
          <span>真实姓名：</span>
          <input type="text" placeholder="请输入法人（经营者）姓名" v-model="legalPerson" @blur="testLegalPerson"/>
        </li>
        <li class="">
          <span>手机号码：</span>
          <input type="tel" maxlength="11" placeholder="请输入法人（经营者）手机号码" v-model="legalPersonPhone"
                 @blur="testLegalPersonPhone"/>
        </li>
      </ul>
    </div>
    <!--提现绑定账号-->
    <div class="info-box bg-f">
      <h4 class="fz18 title" @click="aa">提现绑定账号</h4>
      <ul class="fz14">
        <li class="border-buttom">
          <span>支付宝账户：</span>
          <input type="text" placeholder="请输入支付宝账户" @blur="testZFB" v-model="alipayAccount"/>
        </li>
        <li class="border-buttom">
          <span>支付宝账户姓名：</span>
          <input type="text" placeholder="请输入支付宝账户姓名" @blur="testZFBname" v-model="alipayAccountRealName"/>
        </li>
        <li class="">
          <span>客户经理编号：</span>
          <span>{{referenceUsername }}</span>
          <!--<input type="text" placeholder="请输入客户经理编号" v-model="referenceUsername" @change="testManagerNum" v-else/>-->
        </li>
      </ul>
    </div>
    <!--下一步-->
    <div class="bg-f">
      <!--<p style="text-align: center;"><a class="call fz11 fc-c" href="tel:4008090775">若无客户经理编号，请来电获取</a></p>-->
      <button type="button" class="btn bg-r fz18" :class=" next != '111111111'?'btn-layer':'' " @click="sub"> 下一步
      </button>
      <!--<router-link to='/loginInfo' tag='button' @click.native="sub" class="btn bg-blue fz18" v-else >下一步</router-link>-->
    </div>
    <!--Popup-->
    <mt-popup v-model="popupSelect" position="bottom">
      <ul class="type-list">
        <Li class="fz16" :class=" dealCateId == item.id ? 'fc-r' : '' " v-for="(item,index) in typeList" :key="index"
            @click="selectTrade(item.name,item.id)">{{item.name}}
        </Li>
      </ul>
    </mt-popup>
    <!--选择省市区-->
    <v-picker :showPickerState.sync="showPickerState" :areaName.sync='areaName' :areaCode.sync='areaCode'
              :firstTime.sync='firstTime'></v-picker>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import subnav from './subnav'
  import picker from './picker'
  import {getTypeList , getDefaultLocation , testReferee} from '@/assets/js/getData'
  import {postColor} from "@/assets/js/jsBridge";
  import {replaceNext , USERINFO , rule , setStore} from "@/assets/js/deal";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        firstTime: 0, // 页面首次进入获取地址为0，更改城市后，选择为1
        popupSelect: false,
        next: '000000000',
        shopName: '',
        unitAddress: '',
        legalPerson: '',
        legalPersonPhone: '',
        areaCode: '',
        certificate: '',
        dealCateId: '',
        dealCateMatchRow: '',
        typeList: [],
        showPickerState: false,
        areaName: '请选择地址',
        lng: '',
        lat: '',
        showMapState: false,
        alipayAccount: '',
        alipayAccountRealName: '',
        referenceId: '',
        USERINFO: {},
        readState: false,
        referenceUsername: this.$route.query.username,// 推荐人的名称
        confirmState: false, //confirm对话框是否显示
        tip: '',
        token: ''
      }
    },
    components: {
      'v-subnav': subnav,
      'v-picker': picker,
    },
    mounted() {
      var _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
      });
      postColor('ffffff'); //传递顶部的手机导航栏的色值给安卓
    },
    created: function () {

    },
    watch: {
      areaName: function () {
        let _self = this;
        _self.areaCode != '' ? _self.next = replaceNext(_self.next, '1', 1) : _self.next = replaceNext(_self.next, '0', 1);
        if (_self.firstTime == 1) {
          _self.unitAddress = '';
          _self.lng = '';
          _self.lat = '';
        }
        USERINFO.areaCode = _self.areaCode;
      }
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      aa() {
        console.log(this.next)
      },
      testShopName() {
        let _self = this;
        if (rule.empty(_self.shopName, '商家名称不能为空')) {
          _self.next = replaceNext(_self.next, '1', 0);
          USERINFO.shopName = _self.shopName;
        } else {
          _self.next = replaceNext(_self.next, '0', 0);
        }
      },
      testUnitAddress() {
        let _self = this;
        if (rule.empty(_self.unitAddress, '商家详细地址不能为空')) {
          _self.next = replaceNext(_self.next, '1', 2);
          if (_self.unitAddress.includes("省") && _self.unitAddress.includes("市") && _self.unitAddress.includes("区")) {
            USERINFO.unitAddress = _self.unitAddress;
          } else {
            USERINFO.unitAddress = _self.areaName + _self.unitAddress;
          }
        } else {
          _self.next = replaceNext(_self.next, '0', 2);
        }
      },
      testCertificate() { //验证经营许可证编号
        let _self = this;
        if (rule.empty(_self.certificate, '经营许可证编号不能为空')) {
          _self.next = replaceNext(_self.next, '1', 8);
          USERINFO.certificate = _self.certificate;
        } else {
          _self.next = replaceNext(_self.next, '0', 8);
        }
      },
      testLegalPerson() {
        let _self = this;
        if (rule.empty(_self.legalPerson, '法人（经营者）姓名不能为空')) {
          _self.next = replaceNext(_self.next, '1', 5);
          USERINFO.legalPerson = _self.legalPerson;
        } else {
          _self.next = replaceNext(_self.next, '0', 5);
        }
      },
      testLegalPersonPhone() {
        let _self = this;
        if (rule.empty(_self.legalPersonPhone, '法人（经营者）手机号不能为空') && rule.phone(_self.legalPersonPhone)) {
          _self.next = replaceNext(_self.next, '1', 4);
          USERINFO.legalPersonPhone = _self.legalPersonPhone;
        } else {
          _self.next = replaceNext(_self.next, '0', 4);
        }
      },
      testZFB() {//验证支付宝账户
        let _self = this;
        if (rule.empty(_self.alipayAccount, '支付宝账户不能为空') && rule.testZFB(_self.alipayAccount, '请输入正确格式的支付宝账户')) {
          _self.next = replaceNext(_self.next, '1', 6);
          USERINFO.alipayAccount = _self.alipayAccount;
        } else {
          _self.next = replaceNext(_self.next, '0', 6);
        }
      },
      testZFBname() {//验证支付宝账户姓名
        let _self = this;
        if (rule.empty(_self.alipayAccountRealName, '支付宝账户姓名不能为空') && rule.name(_self.alipayAccountRealName, '请输入正确的姓名')) {
          _self.next = replaceNext(_self.next, '1', 7);
          USERINFO.alipayAccountRealName = _self.alipayAccountRealName;
        } else {
          _self.next = replaceNext(_self.next, '0', 7);
        }
      },
//		testManagerNum(){//验证客户经理编号
//			let _self  = this ;
//			if(comm.rule.empty(_self.referenceUsername,'邀请码不能为空') ){
//				_self.next = comm.replaceNext(_self.next , '1' , 8);
//				comm.USERINFO.referenceUsername = _self.referenceUsername ;
//			}else{
//				_self.next = comm.replaceNext(_self.next , '0' , 8);
//			}
//		},
      //隐藏confirm弹窗
      hideConfirm() {
        this.confirmState = false;
      },
      //显示三级联动的弹出框
      showPicker() {
        this.showPickerState = true;
      },
      //获取行业类型
      getTradeType() {
        let _self = this;
        var _data;
        _self.$getSignIn(_data).then(sec => {
          getTypeList(_data,sec).then((res) => {
            if (res.data.state == 1) {
              _self.popupSelect = true;
              _self.typeList = res.data.data;
            } else {
              _self.toast(decodeURIComponent(res.data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })
      },
      //选择行业
      selectTrade(name, id) {
        let _self = this;
        _self.dealCateId = id;
        _self.dealCateMatchRow = name;
        _self.next = replaceNext(_self.next, '1', 3);
        USERINFO.dealCateId = id;
        USERINFO.dealCateMatchRow = name;
        setStore('userinfo', USERINFO);
        _self.popupSelect = false;
      },
      //输入详细地址获取经纬度
      getDefaultLocation(callback) {
        let _self = this;
        _self.$getSignIn(_self.unitAddress).then(sec => {
          getDefaultLocation(_self.unitAddress,sec).then((res) => {
            if (res.data.state == 1) {
              if (res.data.data.status == 0) {
                _self.lng = res.data.data.result.location.lng;
                _self.lat = res.data.data.result.location.lat;
                USERINFO.longitude = res.data.data.result.location.lng;
                USERINFO.latitude = res.data.data.result.location.lat;
                setStore('userinfo', USERINFO);
                callback();
              } else {
                _self.toast(decodeURIComponent("找不到输入的地址"));
                //comm.toast(decodeURIComponent(res.data.data.msg));
              }
            } else {
              _self.toast(decodeURIComponent(res.data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
      //点击下一步时验证表单
      sub() {
        let _self = this;
        if (_self.next == '111111111') {
          _self.getDefaultLocation(() => { //逆地址解析
            let _data = {
              token: _self.token,
              shopName: _self.shopName
            };
            _self.$getSignIn(_data).then(sec => {
              testReferee(_data,sec).then((res) => {
                if (res.data.state == 1) {
                  USERINFO.unitAddress = USERINFO.unitAddress.replace(/请选择地址/g, "");
                  setStore('userinfo', USERINFO);
                  _self.$router.push({path: '/loginInfo'});
                } else {
                  _self.toast(decodeURIComponent(res.data.msg));
                }
              }).catch(function (error) {
                _self.toast(error);
              });
            })
          });
        }
      },
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/enter.css';
  @import '../../../../assets/css/partner_base.css';
  .btn.bg-r {
    background: #F7094D;
  }

  .call {
    display: inline-block;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAMAAAApB0NrAAAAYFBMVEUAAAD3CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU2f/8QNAAAAH3RSTlMAFaTz6NxwQLWTMAzj18u+mYNiXFVLNwfPqZ6KIXke42QBUgAAAM9JREFUOMuN1NkSgjAMQNEApSxlU3ZB8/9/6ShtIw4JnOc7QyCl8GH0rEHWKUScAilZ8KsQojtaMZuMETohOwySnGkyJBnTNEhqptFIUqbJkQzAmHySAJw8LBqAZfzXEYTupQSrH0eQ2oGM0LxwU4El7WOWosgvjNejdROix5WovBAF/jguYEn7b9xBr6vwb4cJHSND/0ITMFHRAbS4Uf3+ccpXcYleux+8wiOH50RuQPMNSeLzBka3F/Ee6MvfRDH3ybOgZAXG2IbbXGkA8AY2DC9+ehlDvgAAAABJRU5ErkJggg==) no-repeat right center;
    padding-right: 30px;
    background-size: auto 100%;
    margin-top: 10px;
  }

  .bg-address {
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAuCAMAAAB6WzuLAAAAOVBMVEUAAAAlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6OKCBbbAAAAEnRSTlMA8uEqFwtwPrTDf0zQo5mOY1dEgMfpAAABBElEQVQ4y4XTW5KFIAwE0A4vRXxg9r/YqRqnIDHCnO9UX5O+QAplO9f13ErAp5gyNzlFGNWxQglayGzsHsJC/IGKmOCBNuN5aMHD8RA9ExtPnL/L8JQHcLJCxMoKRFL38jH65FgIKNzl8NfFyl3FxY1Ds3NzIOsj2FPtcDrExhBIJArn58gFYRMjTl6gO8RIfvVhettlQ6lP3LIlr/t4BOKmyEim+5kopP8OSZVWl6Wu/Oh7Es8E9JjOhMxjIvBPzNbvNOBM9cZiGulsa5GGC8+f7A3lmPzMcCuKePF2GyOZy1uZhR2fnPkQw5sPsappz7rMo7Ny73ckOmYKmAr9qQzdFS8/K4Q+KmE0sU4AAAAASUVORK5CYII=) no-repeat right 25px center;
    background-size: auto 23px;
  }

  .bg-arrow {
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAJ1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADdEvm1AAAADHRSTlMA8DCgENBgwLCQcCA4rAWlAAAAXklEQVQ4y2MYZoClCIcE+0EF7BJMMkI4tCiOaqGWFo4zBdglbI46YBVnPhOCQ8Nh7OIeZwywJ4gYHBpccWo4hV3D1jMJOILjGI7QwKlBjLTgY8MV4MxQDZhgEsPwBAB6Yhoo4B/IgwAAAABJRU5ErkJggg==) no-repeat right 20px center;
    background-size: auto 23px;
  }

  .select {
    padding: 0px 25px;
  }

  .type-list {
    width: 100%;
    height: 280px;
    overflow-y: auto;
  }

  .type-list li {
    height: 35px;
    line-height: 35px;
    text-align: center;
  }

  #city {
    display: inline-block;
  }

  #select-city {
    display: block;
    width: 29px;
    height: 40px;
    position: absolute;
    right: 20px;
    top: 10px;
    opacity: 0.2;
  }
</style>
