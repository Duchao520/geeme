<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">在线购卡</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!---->
    <ul class="fz14 bg-f list">
      <li class="border-buttom">
        <span>收货人姓名：</span>
        <input type="text" placeholder="请输入收货人姓名" v-model="receiptPerson" @blur="testPerson"/>
      </li>
      <li class="border-buttom">
        <span>收货人电话：</span>
        <input type="tel" maxlength="11" placeholder="请输入收货人电话" v-model="receiptPhone" @blur="testPhone"/>
      </li>
      <li class="border-buttom">
        <span>收货人详细地址：</span>
        <textarea placeholder="请输入收货人详细地址" v-model="receiptAddress" @blur="testAddress" rows="2"></textarea>
      </li>
    </ul>
    <!---->
    <button type="button" class="btn " :class="next == '111'? '' : 'btn-opcity'" @click="subForm">确定</button>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>
<script>
  import {replaceNext,rule} from "@/assets/js/deal";

  export default {
    data() {
      return {
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        tip: '',
        receiptPerson: this.$route.query.name,//收货人姓名
        receiptPhone: this.$route.query.phone,//收货人电话
        receiptAddress: this.$route.query.address, //收货人详细地址
        next: '000',
        shopName: this.$route.query.shopName,
        shopId: this.$route.query.shopId,
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
      testPerson() {
        let _self = this;
        if (rule.empty(_self.receiptPerson, '收货人姓名不能为空')) {
          _self.next = replaceNext(_self.next, '1', 0);
        } else {
          _self.next = replaceNext(_self.next, '0', 0);
        }
      },
      testPhone() {
        let _self = this;
        if (rule.empty(_self.receiptPhone, '收货人电话不能为空') && rule.phone(_self.receiptPhone)) {
          _self.next = replaceNext(_self.next, '1', 1);
        } else {
          _self.next = replaceNext(_self.next, '0', 1);
        }
      },
      testAddress() {
        let _self = this;
        if (rule.empty(_self.receiptAddress, '收货地址 不能为空')) {
          _self.next = replaceNext(_self.next, '1', 2);
        } else {
          _self.next = replaceNext(_self.next, '0', 2);
        }
      },
      subForm() {
        let _self = this;
        console.log(_self.next)
        if (_self.next == '111') {
          _self.$router.push({
            path: '/buyCard',
            query: {
              name: _self.receiptPerson,
              phone: _self.receiptPhone,
              address: _self.receiptAddress,
              shopName: _self.shopName,
              id: _self.shopId,
            }
          });
        }
      }
    },
    created: function () {
      let _self = this;
      if (_self.receiptPerson) {
        _self.next = replaceNext(_self.next, '1', 0);
      }
      if (_self.receiptPhone) {
        _self.next = replaceNext(_self.next, '1', 1);
      }
      if (_self.receiptAddress) {
        _self.next = replaceNext(_self.next, '1', 2);
      }
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  .list li {
    line-height: 55px;
    padding-left: 10px;
  }
</style>

