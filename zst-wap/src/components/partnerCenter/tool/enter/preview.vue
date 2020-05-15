<template>
  <div>
    <!--顶部导航栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">商家入驻娱乐</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
      <span class="icon fc-r fz16" @click="subFormate" v-if="disable">提交</span>
      <span class="icon fc-c fz16" v-else>提交</span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!--商户信息-->
    <div class="mb-7 fz15 business-info bg-f">
      <div class="logo">
        <img :src="userinfo.supplierLogo" width="100%"/>
      </div>
      <p class="fz17 txt-ellipsis">{{userinfo.shopName || ''}}</p>
      <p class="fc-c txt-overflow address">{{userinfo.unitAddress || ''}}</p>
      <p><a class="fc-c fz12 call" :href="'tel:' + userinfo.contactPhone">{{userinfo.contactPhone || ''}}</a></p>
    </div>
    <!--基本信息-->
    <div>
      <ul class="fz14 info-list mb-7 bg-f ">
        <li class="clearfix">
          <span class="fl-l fc-c">经营许可证</span>
          <span class="fl-r">{{userinfo.certificate || ''}}</span>
        </li>
        <li class="clearfix">
          <span class="fl-l fc-c">行业类型</span>
          <span class="fl-r">{{userinfo.dealCateMatchRow || ''}}</span>
        </li>
        <li class="clearfix">
          <span class="fl-l fc-c">掌柜姓名</span>
          <span class="fl-r">{{userinfo.legalPerson || ''}}</span>
        </li>
        <li class="clearfix">
          <span class="fl-l fc-c">掌柜手机号码</span>
          <span class="fl-r">{{userinfo.legalPersonPhone || ''}}</span>
        </li>
        <li class="clearfix">
          <span class="fl-l fc-c">支付宝账号</span>
          <span class="fl-r">{{userinfo.alipayAccount || ''}}</span>
        </li>
        <li class="clearfix">
          <span class="fl-l fc-c">支付宝账号姓名</span>
          <span class="fl-r">{{userinfo.alipayAccountRealName || ''}}</span>
        </li>
        <li class="clearfix">
          <span class="fl-l fc-c">客户经理编号</span>
          <span class="fl-r">{{userinfo.referenceId || ''}}</span>
        </li>
        <li class="clearfix">
          <span class="fl-l fc-c">收货人姓名</span>
          <span class="fl-r">{{userinfo.receiver || ''}}</span>
        </li>
        <li class="clearfix">
          <span class="fl-l fc-c">收货人手机</span>
          <span class="fl-r">{{userinfo.receiverPhone || ''}}</span>
        </li>
        <li class="clearfix">
          <span class="fl-l fc-c">收货人地址</span>
          <span class="fl-r contactway p-hide">{{userinfo.receiverAddress || ''}}</span>
        </li>
      </ul>
    </div>
    <!--门店照片-->
    <div class="clearfix photo-box bg-f">
      <div class="fl-l" style="width: 200px;">
        <img :src="userinfo.licensePhoto" width="100%"/>
        <p class="fz14">营业执照</p>
      </div>
      <div class="fl-r" style="width: 141px;">
        <img :src="userinfo.storeImgs_1" width="100%"/>
        <p class="fz14">门店照片</p>
      </div>
    </div>
    <div class="photo-box bg-f">
      <div class="" style="width: 141px;">
        <img :src="userinfo.storeImgs_2" width="100%"/>
        <p class="fz14">店内环境照片</p>
      </div>
    </div>
    <!--<button type="button" class="btn bg-blue" @click="subFormate">提交</button>-->
    <!--确认弹窗-->
    <div v-show="subState">
      <div class="mask"></div>
      <div class="alert-box bg-f">
        <button type="button" class="close-btn" @click="hideAlert"></button>
        <img src="@/assets/imgs/partnerCenter/BG.png" width="100%"/>
        <p class="fc-blue fz18">提交申请成功</p>
        <p class="fz14">审核将在7个工作日内短信通知您结果</p>
        <router-link to='/receivables' tag='button' class="bg-blue btn fz18" @click.native='clear'>确定</router-link>
      </div>
    </div>
    <!--提交错误返回第一步-->
    <div v-show="subErrorState">
      <div class="mask"></div>
      <div class="alert-box bg-f">
        <button type="button" class="close-btn" @click="hideErrorAlert"></button>
        <p class="fc-blue fz18">{{subErrorMsg}}</p>
        <router-link to='/' tag='button' class="bg-blue btn fz18">返回第一步</router-link>
      </div>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {dataURLtoBlob , IMGFORMDATA , removeStore , getStore} from "@/assets/js/deal";
  import axios from 'axios';
  import {getSignIn} from "@/assets/js/jsBridge";

  export default {
    name: 'preview',
    props: ['partnerToken'],
    data() {
      return {
        userinfo: {},
        subState: false,
        subErrorState: false,
        subErrorMsg: '',
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        tip: '',
        token: '',
        disable: true, //禁止按钮多次提交，true为可提交，false为禁止提交
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
      subFormate() {
        let _self = this;
        let _formate = new FormData();
        let _data = _self.userinfo;
        _data.token = _self.token;
        let _licensePhoto = dataURLtoBlob(IMGFORMDATA.licensePhoto),
          _storeImgs_1 = dataURLtoBlob(IMGFORMDATA.storeImgs_1),
          _storeImgs_2 = dataURLtoBlob(IMGFORMDATA.storeImgs_2),
          _supplierLogo = dataURLtoBlob(IMGFORMDATA.supplierLogo);
        delete _data.licensePhoto;
        delete _data.storeImgs_1;
        delete _data.storeImgs_2;
        delete _data.supplierLogo;
        getSignIn(_data).then(_sec => {
          const list = Object.keys(_data).map((item, index) => ({key: item, value: _data[item]}));
          list.forEach((i) => {
            _formate.append(i.key, i.value);
          });
          _formate.append('licensePhoto', _licensePhoto);
          _formate.append('storeImgs_1', _storeImgs_1);
          _formate.append('storeImgs_2', _storeImgs_2);
          _formate.append('supplierLogo', _supplierLogo);
          _self.disable = false;
          axios.post('/api/voip/add/shop',
            _formate,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'sec': _sec,
                'userAgent': ' zst-android-broswer',
              }
            }
          ).then(function (res) {
            _self.disable = true;
            if (res.data.state == 1) { //上传商家信息成功，跳转二维码支付页面
              //_self.subState = true ;
              _self.$router.push({path: '/receivables', query: {shopId: res.data.data}});  //跳转支付二维码页面并且带商家id
              //_self.clear();
            } else if (res.data.state == 802903) {
              _self.subErrorState = true;
              _self.subErrorMsg = decodeURIComponent(res.data.msg);
            } else if (res.data.state == 802902) {
              _self.subErrorState = true;
              _self.subErrorMsg = decodeURIComponent(res.data.msg);
            } else if (res.data.state == 900104) {
              _self.subErrorState = true;
              _self.subErrorMsg = decodeURIComponent(res.data.msg);
            } else {
              _self.toast(decodeURIComponent(res.data.msg));
            }
          })
            .catch(function (error) {
              _self.toast(error);
            });
        })
      },
      //提交成功后清除缓存
      clear() {
        removeStore('userinfo');
        delete IMGFORMDATA.licensePhoto;
        delete IMGFORMDATA.storeImgs_1;
        delete IMGFORMDATA.storeImgs_2;
        delete IMGFORMDATA.supplierLogo;
      },
      hideAlert() {
        this.subState = false;
      },
      hideErrorAlert() {
        this.subErrorState = false;
      }
    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.userinfo = JSON.parse(getStore('userinfo')); //从缓存中信息
      });
    },
    components: {
      //'v-subnav':subnav ,
    },
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  .business-info {
    position: relative;
    padding: 20px 15px 20px 150px;
    min-height: 110px;
  }

  .logo {
    width: 110px;
    height: 110px;
    position: absolute;
    left: 15px;
    top: 20px;
    overflow: hidden;
  }

  .address {
    padding-right: 30px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAuCAMAAAB6WzuLAAAAOVBMVEUAAAAlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6Mlw6OKCBbbAAAAEnRSTlMA8uEqFwtwPrTDf0zQo5mOY1dEgMfpAAABBElEQVQ4y4XTW5KFIAwE0A4vRXxg9r/YqRqnIDHCnO9UX5O+QAplO9f13ErAp5gyNzlFGNWxQglayGzsHsJC/IGKmOCBNuN5aMHD8RA9ExtPnL/L8JQHcLJCxMoKRFL38jH65FgIKNzl8NfFyl3FxY1Ds3NzIOsj2FPtcDrExhBIJArn58gFYRMjTl6gO8RIfvVhettlQ6lP3LIlr/t4BOKmyEim+5kopP8OSZVWl6Wu/Oh7Es8E9JjOhMxjIvBPzNbvNOBM9cZiGulsa5GGC8+f7A3lmPzMcCuKePF2GyOZy1uZhR2fnPkQw5sPsappz7rMo7Ny73ckOmYKmAr9qQzdFS8/K4Q+KmE0sU4AAAAASUVORK5CYII=) no-repeat right center;
    background-size: auto 22px;
  }

  .call {
    display: inline-block;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAMAAAApB0NrAAAAYFBMVEUAAAD3CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU2f/8QNAAAAH3RSTlMAFaTz6NxwQLWTMAzj18u+mYNiXFVLNwfPqZ6KIXke42QBUgAAAM9JREFUOMuN1NkSgjAMQNEApSxlU3ZB8/9/6ShtIw4JnOc7QyCl8GH0rEHWKUScAilZ8KsQojtaMZuMETohOwySnGkyJBnTNEhqptFIUqbJkQzAmHySAJw8LBqAZfzXEYTupQSrH0eQ2oGM0LxwU4El7WOWosgvjNejdROix5WovBAF/jguYEn7b9xBr6vwb4cJHSND/0ITMFHRAbS4Uf3+ccpXcYleux+8wiOH50RuQPMNSeLzBka3F/Ee6MvfRDH3ybOgZAXG2IbbXGkA8AY2DC9+ehlDvgAAAABJRU5ErkJggg==) no-repeat right center;
    padding-right: 30px;
    background-size: auto 100%;
  }

  .mb-7 {
    border-bottom: 7px solid #f2f2f2;
  }

  .info-list {
    padding: 9px 12px 9px 15px;
    line-height: 42px;
  }

  .photo-box {
    padding: 30px 11px 15px 11px;
    text-align: center;
  }

  .photo-box img {
    height: 141px;
    overflow-y: hidden;
  }

  .alert-box img {
    margin-bottom: 32px;
  }

  .alert-box .btn {
    width: 235px;
    border-radius: 35px;
  }

  .contactway {
    width: 60%;
    display: inline-block;
    text-align: right;
  }

  .icon {
    line-height: 44px;
  }
</style>
