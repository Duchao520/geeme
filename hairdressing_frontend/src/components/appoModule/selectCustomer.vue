<template lang="pug">
  .g-selectpop(
  :style="{width: width}"
  )
    el-popover(
    placement="bottom-start"
    trigger="focus"
    v-model="visible"
    ref='popover'
    popper-class='isCustomer'
    )
      .customer_popover(
      v-show="!customerList.length"
      )
        .pop-tip {{ (!isNaN(this.phoneNumber) && (this.phoneNumber + '').length > 3) ? '该客户不存在，请先新增客户' : '无数据'}}
      .customer_popover(
      v-show="customerList.length"
      )
        ul.customer-list
          li.customer-item(
          v-for="(item, index) in customerList",
          :key="index",
          :class="[current.brandCustomerId === item.brandCustomerId ? 'active' : '']",
          @click="choose(item)"
          )
            span.item.name {{ item.name }}
            span.item.sex {{ item.sex }}
            span.item.tel {{ item.mobile }}
      el-input(
      v-model="phoneNumber",
      placeholder="搜索客户手机号",
      slot="reference",
      @input="search",
      maxlength="11"
      :size="size"
      ref="customerInput"
      )
</template>
<script>
import { mapActions } from "vuex";
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import Bus from "@/util/bus";

export default {
  props: {
    width: String,
    size: String,
    isBrand: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      phoneNumber: null,
      visible: false,
      current: {},
      customerList: []
    };
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    billInfo() {
      return this.$store.state.bill;
    }
  },
  mounted() {
    this.setCustomerHasCard_();
  },
  methods: {
    ...mapActions([
      "saveCustomerInfo",
      "setSelectedVipCardId",
      "setAvailableVipCardList",
      "setCustomerHasCard",
      "setCustomerHasPrepaidCard",
    ]),
    // 清空手机号输入框
    search() {
      if (!isNaN(this.phoneNumber) && (this.phoneNumber + "").length < 3) {
        this.customerList = [];
        return;
      }
      let url = this.isBrand ? "/listBrandCustomerLikeMobile" : api.listCustomerLikeMobile.URL
      axios
        .post(url, {
          likeMobile: this.phoneNumber,
          storeId: this.isBrand ? null : this.currentInfo.shopId,
          brandId: this.isBrand ? this.currentInfo.brandId : null
        })
        .then(res => {
          this.customerList = this.isBrand ? res.brandCustomerLikeMobileInfoList : res.customerForAppointments;
        });
    },
    choose(data) {
      this.current = data;
      this.phoneNumber = data.mobile;
      this.visible = false;
      this.saveCustomerInfo({
        headPortrait: data.headPortrait,
        name: data.name,
        sex: data.sex,
        mobile: data.mobile,
        memberLevel: data.memberLevel,
        id: data.id
      });
      Bus.$emit("get-member-price");
      console.log("发送消息")
      this.handleChooseCustomer(data);
    },
    handleChooseCustomer(data) {
      /**
       * 清除所选择的人
       * */
      this.setSelectedVipCardId(null);
      this.setAvailableVipCardList([]);

      this.$emit("choose", data);
      this.setCustomerHasCard_();
    },
    setCustomerHasCard_(){
      if(this.billInfo.customerInfo.id){
        // 卡买产品、服务
        this.setCustomerHasCard({
          brandId:this.currentInfo.brandId,
          customerId:this.billInfo.customerInfo.id,
          storeId:this.currentInfo.shopId
        });
        // 卡买卡
        this.setCustomerHasPrepaidCard({
          customerId:this.billInfo.customerInfo.id,
          storeId:this.currentInfo.shopId
        });
      }
    },
    handleClose() {
      this.phoneNumber = null
      this.$refs.popover.doClose()
      this.$refs.customerInput.blur()
    },
  }
};
</script>
<style>
.item.sex {
  display: inline-block;
  width: 32px;
}
</style>
