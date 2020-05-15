<template>
  <div>
    <el-button class="button" @click="getOrderInfo(id)" :loading="orderDetailLoading">
      <i class="icon iconfont icon-icon_operate_eyes"></i>
      <span>详情</span>
    </el-button>
    <service-order-detail
      v-if="ShowServiceOrderDetail"
      :infoVisible="ShowServiceOrderDetail"
      @handleClose="ShowServiceOrderDetail=false"
      :detail="cashOrderInfo"
    ></service-order-detail>
  </div>
</template>
<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import ServiceOrderDetail from "@/components/order/billDetail/ServiceOrderDetail.vue";
import {mapActions} from "vuex";
export default {
  components: {
    "service-order-detail": ServiceOrderDetail
  },
  props: { id: [Object, Number] },
  data() {
    return {
      cashOrderInfo: null,
      ShowServiceOrderDetail: false,
      orderDetailLoading: false
    };
  },
  methods: {
    ...mapActions([
      "setBillId",
      "setPaperId",
    ]),
    getOrderInfo(id) {
      this.orderDetailLoading = true;
      axios.get("/getConsumerOrderInfoById/" + id).then(res => {
        this.cashOrderInfo = res;
        this.setBillId(res.billId) // 新的统一处理账单id
        this.setPaperId(res.paperOrderId); // - 纸单
        this.ShowServiceOrderDetail = true;
        this.orderDetailLoading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.button {
  width: 62px;
  height: 32px;
  color: white;
  font-size: 12px;
  text-align: center;
  display: flex;
  padding: 0;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: none;
  transition: all 0.6s;
  background: #75c74f;
  &:hover {
    filter: brightness(90%);
  }
}
</style>
