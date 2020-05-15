import {encodeStr , accMul} from '/util/jsBridge';
import { Page } from '/util/ix';
var app = getApp();

Page({
  data: {
    phone:'',
    encodePhone: '',
    code: '',
    encodeCode: '',
    timer: null,
    time:60,
    route: '',
    ALIUSERID: '',
    input: 'phone',
    keyBoard: ['1','2','3','4','5','6','7','8','9','','0','00']
  },
  onShow(){
  },
  onHide(){
    clearInterval(this.data.timer);
    this.setData({
      time: 0
    })
  },
  onLoad(options){
    var pages = getCurrentPages(),route ;
    route = pages.length>1 ? pages[pages.length-2].route : 'pages/index/index';
    this.setData({
      route: route,
      ALIUSERID: options.aliUserId
    })
  },
  onKeyPress(r){
    switch (r.keyCode) {
        case 133:
          my.reLaunch({url: '/pages/index/index',});
          break
      }
  },
  hideKeyBoard(){
    my.hideKeyboard();
  },
  onfocus(event){
    var _self = this , 
        {input} = event.target.dataset;
        _self.setData({
          input: input
        })
  },
  keyBoardEvent(event){
    var _self = this , 
        {input,phone,code} = this.data,
        {key} = event.target.dataset;
    switch(key){
      case "del":
        if(input == 'phone'){
          _self.setData({
            phone: phone.slice(0,-1),
            encodePhone: encodeStr(phone.slice(0,-1))
          })
        }else if(input == 'code'){
          _self.setData({
            code: code.slice(0,-1)
          })
        }
        break;
      case "put":
        _self.register();
        break;
      case "exit":
        my.navigateBack();  
        break;
      default:
        if(input == 'phone' && phone.length < 11){
          _self.setData({
            phone: phone + key,
            encodePhone: encodeStr(phone + key)
          })
        }else if(input == 'code'){
          _self.setData({
            code: code + key
          })
        }
    }
  },
  phoneInput(e){
    var value = e.detail.value,result;
    this.setData({
      phone: e.detail.value
    })
  },
  codeInput(e){
    var value = e.detail.value,result;
    this.setData({
      code: value
    })
  },
  clearPhone(){
    this.setData({
      phone: ''
    })
  },
  sendMsCode(){
    var _self = this , timer , _data , phoneReg = /^(1)[0-9]{10}$/;
    if(phoneReg.test(this.data.phone)){
      _data = {
        userName: _self.data.phone,
        type: 1
      }
      app.API.sendMsCode(_data).then(res => {
        _self.setData({
          timer: setInterval(() => {
            if(_self.data.time == 0){
              clearInterval(_self.data.timer);
              _self.setData({
                time: 60
              })
            }else{
              _self.setData({
                time: _self.data.time-1
              })
            }
          },1000)
        })
        
      })
    }else{
      my.showToast({
        content: '请输入规范手机号'
      });
    }
  },
  register(){
    var _self = this , _data , USERINFO , phoneReg = /^(1)[0-9]{10}$/;
    if(phoneReg.test(this.data.phone) && _self.data.code){
      _data = {
        smsSecurityCode: _self.data.code,
        phone: _self.data.phone,
        storeId: app.store.storeId.getStore().data,
        aliUserId: _self.data.ALIUSERID
      }
      app.API.memberRegister(_data).then(res => {
        if(res.state == 1){
          USERINFO = res.data;
          USERINFO.isUser = 1;
          USERINFO.totalmoney = accMul(USERINFO.totalmoney,1);
          app.store.USERINFO.setStore(USERINFO);
          if(_self.data.route == 'pages/packageA/pages/pay/pay'){
            my.redirectTo({url: '/pages/packageA/pages/svipPay/svipPay'});
          }else{
            my.redirectTo({url: '/pages/packageA/pages/maincardList/maincardList'});
          }
        }
      })
    }else{
      if(!phoneReg.test(this.data.phone)){
        my.showToast({
          content: '请输入规范手机号'
        });
      }else{
        my.showToast({
          content: '请输入验证码'
        });
      }
    }
  }

});
