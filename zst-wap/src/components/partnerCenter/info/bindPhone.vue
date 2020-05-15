<template>
  <div style="height: 100%;">
    <!--标题栏-->
    <header class="relative border-buttom bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3>更改绑定手机号码</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
    </header>
    <div class="main">
      <!--绑定手机号-->
      <div class="bg-f form-box" v-if="formState">
        <div class="border-buttom ico-phone flex-box" style="align-items: center;padding-top: 15px;padding-bottom: 15px">
          <input type="number" placeholder="请输入原绑定手机号" maxlength="11" pattern="[0-9]*" class="fz16" v-model="usedPhone"
                 readonly="readonly"/>
        </div>
        <div class="ico-code relative flex-box" style="align-items: center;padding-top: 15px;padding-bottom: 15px">
          <input type="text" placeholder="请输入验证码" class="fz16" v-model="usedCode"/>
          <button type="button" class="btn-code fz12" @click="getUsedCode" v-show="!computedTime">获取验证码</button>
          <button type="button" class="btn-code fz12 " v-show="computedTime">倒计时（{{computedTime}}）</button>
        </div>
      </div>
      <div class="bg-f form-box" v-else>
        <div class="border-buttom ico-phone">
          <input type="number" placeholder="请输入新绑定手机号" maxlength="11" pattern="[0-9]*" class="fz16" v-model="newPhone"/>
        </div>
        <div class="ico-code relative">
          <input type="text" placeholder="请输入验证码" class="fz16" v-model="newCode"/>
          <button type="button" class="btn-code fz12" @click="getNewCode" v-show="!newcomputedTime">获取验证码</button>
          <button type="button" class="btn-code fz12 " v-show="newcomputedTime">倒计时（{{newcomputedTime}}）</button>
        </div>
      </div>
      <!--确定按钮-->
      <button type="button" class="btn" v-if="formState" @click="testUsed">确定</button>
      <button type="button" class="btn" v-else @click="testNew">确定</button>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getTestCode} from '@/assets/js/getData'
  import fetch from '@/assets/js/fetch'
  import {postColor} from "@/assets/js/jsBridge";
  import {rule , getNowFormatDate} from "@/assets/js/deal";
  import axios from 'axios';
  import md5 from 'js-md5';
  import Qs from 'qs'

  export default {
    props: ['partnerToken'],
    data() {
      return {
        formState: true, //输入手机号状态：true为原绑定手机号获取验证码，false为新手机号绑定验证码
        computedTime: 0,
        newcomputedTime: 0,
        usedPhone: this.$route.query.phone || '', //旧手机号码
        newPhone: '', //新手机号码
        usedCode: '', //旧手机号验证码
        newCode: '', //新手机号验证码
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: ''
      }
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
      /*验证码倒计时*/
      sendMess() {
        let _self = this;
        _self.computedTime = 60;
        //倒计时
        _self.timer = setInterval(() => {
          _self.computedTime--;
          if (_self.computedTime == 0) {
            clearInterval(_self.timer)
          }
        }, 1000);
      },
      /*新验证码倒计时*/
      sendNewMess() {
        let _self = this;
        _self.newcomputedTime = 60;
        //倒计时
        _self.timer = setInterval(() => {
          _self.newcomputedTime--;
          if (_self.newcomputedTime == 0) {
            clearInterval(_self.timer)
          }
        }, 1000);
      },
      /*获取旧手机号的验证码*/
      getUsedCode() {
        let _self = this;
        if (rule.empty(_self.usedPhone, '手机号不能为空')){
          let data = {
            phone: _self.usedPhone,
            smsType: 1,
            type: 2
          }
          _self.sendMess();
          _self.requreCode(data, () => {
          });
        }
      },
      /*获取新绑定手机号的验证码*/
      getNewCode() {
        let _self = this;
        if (rule.empty(_self.newPhone, '手机号不能为空') && rule.phone(_self.newPhone)) {
          console.log(1);
          _self.sendNewMess();
          let data = {
            phone: _self.newPhone,
            smsType: 1,
            type: 2
          }
          _self.requreCode(data, () => {
          });
        }
      },
      /*验证旧手机号与验证码是否正确*/
      testUsed() {
        let _self = this;
        let data = {
          token: _self.token,
          phone: _self.usedPhone,
          smsCode: _self.usedCode
        };
        if (rule.empty(_self.usedCode, '验证码不能为空')) {
          _self.$getSignIn(_data).then(sec => {
            getTestCode(data,sec).then(res => {
              let _data = res.data;
              if (_data.state == 1) {
                //验证旧手机号成功，跳转输入新手机号
                _self.formState = false;
                _self.computedTime = 0;
              } else {
                _self.toast(decodeURIComponent(_data.msg));
              }
            }).catch(function (error) {
              _self.toast(error);
            });
          })

        }
      },
      /*验证并绑定新的手机号码*/
      testNew() {
        let _self = this;
        let data = {
          token: _self.token,
          phone: _self.newPhone,
          smsCode: _self.newCode,
          type: "edit"
        };
        if (rule.empty(_self.newPhone, '手机号不能为空') && rule.phone(_self.newPhone) && rule.empty(_self.newCode, '验证码不能为空')) {
          getTestCode(data).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              //绑定新手机号成功，跳转首页
              this.$router.push({path: '/partnerCenter'});
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        }
      },
      //请求验证码接口获取验证码
      requreCode(_data, callback) {
        var _self = this;
        let _time = getNowFormatDate();
        let _sec = md5('1hehe^_^haha!ysyhl9t@flzx3000c' + _time + _data.phone);
        _data = Qs.stringify(_data);
        axios.post('/api/voip/v2/smsSecurityCode',
          _data,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'sec': _sec
            }
          }
        ).then(function (res) {
          let _data = res.data;
          if (_data.state == 1) {
            callback();
          } else {
            _self.toast(decodeURIComponent(_data.msg))
          }
        })
          .catch(function (error) {
            _self.toast(error);
          });
      }
    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
      });
    },
    mounted() {
      postColor('ffffff'); //传递顶部的手机导航栏的色值给安卓
    }
  }
</script>

<style scoped>
  @import '../../../assets/css/partner_base.css';
  .main {
    height: 100%;
  }

  .form-box {
    line-height: 60px;
    padding: 0 10px;
  }

  .btn-code {
    right: 18px;
    top: 15px;
  }

  .form-box input {
    height: 30px;
    /*padding-bottom: 15px;*/
  }

  .ico-phone {
    padding-left: 48px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAABDBAMAAAA15KVAAAAAKlBMVEUAAABcX3FcX3FcX3FcX3FcX3FcX3FcX3FcX3FcX3FcX3FcX3FcX3FcX3EtcLNNAAAADnRSTlMAZl0bJy0qIAdETVU7EMCzFDAAAADHSURBVEjHY4ABDrNQFJDewIAGOA4JogEddDVGghhAHVUFL0x8srGxDYxtgKKEGyYMMh3GVkBRUggTnm5sXAlji6IomSiIBUihKNmITYkQihJFQeliYxRgvhBDiTh6SBliKBEZVTKqZFTJqJJRJSNWiVBYGgpI3YihBBNQokRqISElQgbMGwkokWVgaMKuBK5zAQMDJ3YlE5GU8MCdhb0ql2BgYMJalSOEpS9wLEQoRwbMcJ9KToIzC1BjpAgz5EQINnEkL0ClAIeLVaI3BVYrAAAAAElFTkSuQmCC) no-repeat left 15px center;
    background-size: auto 24px;
  }

  .ico-code {
    padding-left: 48px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAABDBAMAAAA15KVAAAAAKlBMVEUAAABcX3FcX3FcX3FcX3FcX3FcX3FcX3FcX3FcX3FcX3FcX3FcX3FcX3EtcLNNAAAADnRSTlMAZVhREz8iGwsxB0kqOf2cGtgAAAG+SURBVEjH7ZU7SyNRGIa/dbM32YU8GZNlNxvYsOyuhYWpbaIiCFp4QUGwiIi9YmkTb4Wdtx8wiggWghHsR9BewR9kJsH55pwzk7QWPk0S8uT9Xr6ZnJFXzeFDN2MUb7WzcQnk652MC0JKHZw9oNjRGYNmk4lwVnKfzBGQq4ksh69PrrBzXw6/CUTaDn/vjGkrc9eEeE0jcsjdzAWRQpt8VVu1yVrKvK+55zOu8mehKgaTs2VTGReX3pG4kpMk3r8p1n0xVO+mrDHYRfkEWVexQqi5ihVSSK+rIa5ih6Qp2wMakqI02Bf5GIakKhV+aEiyMgyBNklUMlBoarV0pRWjIZaCvMTEQqQnppSpRjEaIicxpUEQxdRUWWIwen/L1ctR90+UafRo3OSnJADVWPWSuHzVS9dauu8q7/hlRF65yiNZiXcvOEYGAuPv4E7qMW+0z/DbVhr0iRiTipbxDfYlzgeYMpUDPDGpkDc+f3FHn1oxjxAdzVrY843BfWKzBd91J2W9PkpvBR60K/2iaHb0zFvH3oH+tNhyNrB2YhTwjv2zI+C/KNYuIEeTki8p7OpTJ5UxNVI5n8VbrMtr5RnxUVRGyJm0DwAAAABJRU5ErkJggg==) no-repeat left 15px center;
    background-size: auto 20px;
  }
</style>
