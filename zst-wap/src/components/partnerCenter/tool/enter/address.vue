<template>
  <div>
    <!--导航头-->
    <v-subnav></v-subnav>
    <!--商户登录信息-->
    <div class="info-box bg-f">
      <h4 class="fz18 title" @click="aa">商户收货信息</h4>
      <ul class="fz14">
        <li class="border-buttom">
          <span>收货人姓名：</span>
          <input type="text" placeholder="请输入收货人姓名" v-model="receiver" @blur="testContacts"/>
        </li>
        <li class="border-buttom">
          <span>收货人电话：</span>
          <input type="tel" maxlength="11" placeholder="请输入收货人电话" v-model="receiverPhone" @blur="testContactPhone"/>
        </li>
        <li class="border-buttom">
          <span>收货人详细地址：</span>
          <textarea placeholder="请输入收货人详细地址" v-model="receiverAddress" @blur="testContactway" rows="2"></textarea>
        </li>
      </ul>
    </div>
    <!--下一步-->
    <div class="bg-f">
      <p class="fz11 pd-tb-5 fc-c p-tip">该收货地址将作为赠送助商通话呗卡的邮寄地址，请如实填写</p>
      <button type="button" class="btn bg-r fz18" :class=" next != '111'?'btn-layer':'' " @click="sub"> 下一步</button>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {rule , replaceNext , USERINFO , setStore} from "@/assets/js/deal";
  import subnav from './subnav'

  export default {
    data() {
      return {
        receiver: '', //收货人
        receiverPhone: '', //   联系人电话
        receiverAddress: '',// 收货地址
        next: '000',
        tip: ''
      }
    },
    components: {
      'v-subnav': subnav,
    },
    mounted() {

    },
    created: function () {

    },
    methods: {
      /*返回上一页*/
      back() {
        this.$router.go(-1);//返回上一层
      },
      aa() {
        console.log(this.next)
      },
      testContacts() { //验证收货人姓名
        let _self = this;
        if (rule.empty(_self.receiver, '收货人姓名不能为空')) {
          _self.next = replaceNext(_self.next, '1', 0);
          USERINFO.receiver = _self.receiver;
        } else {
          _self.next = replaceNext(_self.next, '0', 0);
        }
      },
      testContactway() {
        let _self = this;
        if (rule.empty(_self.receiverAddress, '收货地址 不能为空')) {
          _self.next = replaceNext(_self.next, '1', 2);
          USERINFO.receiverAddress = _self.receiverAddress;
        } else {
          _self.next = replaceNext(_self.next, '0', 2);
        }
      },
      testContactPhone() {
        let _self = this;
        if (rule.empty(_self.receiverPhone, '收货人电话不能为空') && rule.phone(_self.receiverPhone)) {
          _self.next = replaceNext(_self.next, '1', 1);
          USERINFO.receiverPhone = _self.receiverPhone;
        } else {
          _self.next = replaceNext(_self.next, '0', 1);
        }
      },
      //跳转第四步
      sub() {
        let _self = this;
        if (_self.next == '111') {
          setStore('userinfo', USERINFO);
          _self.$router.push({path: '/aptitude'});
        }
      }
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/enter.css';
  @import '../../../../assets/css/partner_base.css';
  .info-box {
    border-bottom: 0;
  }

  .p-tip {
    text-align: center;
    padding-top: 20px;
  }
</style>
