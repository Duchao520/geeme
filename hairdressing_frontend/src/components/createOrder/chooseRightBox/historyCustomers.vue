<template>
  <div class="history-customers">
    <div>最近选择: </div>
    <div class="history-container">
      <div 
        class="customer-box" 
        v-for="(customer, index) in customerList" 
        :key="`${customer.id}-${index}`"
        @click="handleChangeCustomer(customer)"
      >
        <img class="customer-img" :src="utils.formatPicImage(customer.headPortrait, 'style', 40, 'someone', customer.sex)" alt="">
        {{customer.name}}
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import {mapActions, mapState} from "vuex";
import Bus from "@/util/bus";
export default {
  props: {
    customer: {
      type: Object,
    }
  },
  data() {
    return {
      utils,
      customerList: [], // 客户列表
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions([
      "saveCustomerInfo",
      "setSelectedVipCardId",
      "setAvailableVipCardList",
      "setCustomerHasCard",
      "setCustomerHasPrepaidCard",
    ]),
    init() {
      axios.get(`/getRecentBillCustomer/${this.currentInfo.shopId}`).then(res => {
        this.customerList = res.customerForAppointments || []
      })
    },
    // - 保存客户信息到最近的操作列表
    async commitNewCustomer(data) {
      let res = await axios.post('/recordRecentBillCustomer', {customerId: data.id, storeId: this.currentInfo.shopId})
    },
    // - 切换当前客户为目标客户
    handleChangeCustomer(customerInfo) {
      if (customerInfo.id === this.customerInfo.id) {
        return
      }
      let data = {
        headPortrait: customerInfo.headPortrait,
        name: customerInfo.name,
        sex: customerInfo.sex,
        mobile: customerInfo.mobile,
        memberLevel: customerInfo.memberLevel,
        id: customerInfo.id
      }
      this.saveCustomerInfo(data);
      Bus.$emit("get-member-price");
      this.setSelectedVipCardId(null);
      this.setAvailableVipCardList([]);
      this.setCustomerHasCard_();
      this.$emit("choose", data);
    },
    setCustomerHasCard_(){
      if(this.customerInfo.id){
        // 卡买产品、服务
        this.setCustomerHasCard({
          brandId: this.currentInfo.brandId,
          storeId: this.currentInfo.shopId,
          customerId: this.customerInfo.id,
        });
        // 卡买卡
        this.setCustomerHasPrepaidCard({
          storeId: this.currentInfo.shopId,
          customerId: this.customerInfo.id,
        });
      }
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      customerInfo: state => state.bill.customerInfo, // 监听这个数据， 说明有选择操作
    })
  },
  watch: {
    customerInfo: {
      handler: function(v, o) {
        // - 监听选中的客户信息变化，或者新增了客户
        // console.log(v, v.id) // 客户可能被清空
        if (o && v.id !== o.id && v.id) {
          this.init()
          this.commitNewCustomer(v)
        }
      },
      deep: true,
      immediate: true
    }
  },
}
</script>
<style lang='scss' scoped>
.history-customers {
  display: flex;
  flex-direction: row;
  
  justify-content: flex-start;
  align-items: center;
  align-content: flex-start;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  overflow: hidden;
}
.history-container {
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.customer-box {
  margin-left: 12px;
  display: flex;
  cursor: pointer;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 2px 4px;
  &:hover {
    border-color: #ccc;
  }

}
.customer-img {
  border-radius: 50%;
  width: 26px;
  margin-right: 4px;
}
</style>
