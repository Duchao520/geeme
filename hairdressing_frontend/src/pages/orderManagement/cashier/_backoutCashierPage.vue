<template>
  <div class="backout-main">
    <div class="header-line" v-loading="loading">
      <red-button
        v-if="checkHasBtnPermission('/shop-inner/choose-person','path')"
        buttonText="快速开单"
        @click="toChoosePerson"
      ></red-button>
    </div>
    <div class="filter-line">
      <div class="left-part">
        <b>已撤单服务单</b>
        &nbsp;&nbsp;&nbsp;
        <el-radio-group v-model="dateType">
          <el-radio-button :label="0">今天</el-radio-button>
          <el-radio-button :label="-1">昨天</el-radio-button>
          <el-radio-button :label="-7">近7天</el-radio-button>
        </el-radio-group>
        <el-date-picker
          style="margin-left:12px;"
          class="date-picker"
          v-model="dateRange"
          type="datetimerange"
          align="left"
          :clearable='false'
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="handleDateRangeChanged"
        ></el-date-picker>
        <switch-menu style="margin-left:12px;" v-model="showType"></switch-menu>
      </div>
      <div class="right-part">
        <el-button plain class="plain_gray_btn" @click="toInitPage">返回列表</el-button>
      </div>
    </div>
    <div>
      <el-row v-if="showType==='card'" id="con" class="cash-list-card">
        <div class="cashier-list" v-show="orderList && orderList.length">
          <!-- takeOrder 取单, superToPay 支付 -->
          <checkout-counter-card
            v-for="(data,index) in orderList"
            :key="index"
            :orderData="data"
            :currentStatus="'cashier'"
            :inBackout="true"
          ></checkout-counter-card>
          <div
            v-for="index in 30"
            :key="index+Math.random()"
            style="visibility:hidden;width:227px;margin: 0 20px 0 0;"
          ></div>
        </div>
      </el-row>
      <div v-if="showType==='list'">
        <cashier-card-list 
          :orderList="orderList"
          :inBackout="true"            
        ></cashier-card-list>
      </div>
    </div>
    <div class="footer" :style="{'background':showType==='list'?'#fff':'transparent'}">
      <div class="footer-right" v-if="total">
        <cash-pagination
          :pageSize="pageSize"
          :currentPage="currentPage"
          :totalCount="total"
          @handleCurrentChange="handleCurrentChange"
        ></cash-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from '@/util/axios'
import { mapActions, mapState } from "vuex"
import checkoutCounterCard from "@/components/order/CheckoutCounterCard.vue"
import cashierCardList from "@/components/order/CashierListList.vue"
import cashPagination from "@/components/order/Cashpagination.vue"
  import base from "@/util/base"
export default {
  data() {
    return {
      dateType: 0, // 今天 0, 昨天 -1, 近7天 -7, 范围 1
      dateRange: null, // 日期选择器的时间
      form: {
        end: '',
        begin: '',
        keyword: '',
      },
      pageSize: 10,
      cachePageSize: 0, // 卡用
      cacheListSize: 10, // 列表用
      currentPage: 1,
      showType: 'card',
      loading: false,
      orderList: null, //
      total: 0,
    }
  },
  created() {
    let today = new Date(+(new Date(new Date().toLocaleDateString()))).format('yyyy-MM-dd')
    this.form.begin = `${today} 00:00:00`
    this.form.end = `${today} 23:59:59`
  },
  mounted() {
    this.sizeChange();
    let _this = this;
    window.onresize = base.debounce(function () {
      _this.sizeChange();
    });
  },
  methods: {
    sizeChange() {
      this.$nextTick(() => {
        let DOM = document.getElementById("con");
        if (!DOM) {
          return;
        }
        let w = DOM.clientWidth;
        let pageSize = Math.floor(w / 247) * 3;
        this.cachePageSize = this.pageSize = pageSize;
        this.currentPage = 1
        this.esConsumerOrderList()
      });
    },
    async esConsumerOrderList() {
      this.loading = true;
      let params = {
        ...this.form,
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        storeId: this.currentInfo.shopId,
      }
      let res = await axios.post('/esRescindConsumerOrderList', params)
      this.orderList = res.consumerOrders
      this.total = res.total
      this.loading = false
    },
    handleDateRangeChanged() {
      if (this.dateRange) {
        this.dateType = 1
        this.form.begin = this.dateRange[0]
        this.form.end = this.dateRange[1]
      } else {
        this.dateType = 0
      }
    },
    toChoosePerson() {
      this.$router.push("/shop-inner/choose-person");
    },
    toInitPage() {
      this.$emit('suberEmit', 'init')
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.esConsumerOrderList()
    }
  },
  watch: {
    dateType(v, o) {
      let today = new Date(+(new Date(new Date().toLocaleDateString()))).format('yyyy-MM-dd')
      if (v === 0) {
        this.form.begin = `${today} 00:00:00`
        this.form.end = `${today} 23:59:59`
        this.dateRange = null
      } else if (v === -1) {
        let timestamp = +(new Date(today)) - 8.64e7
        let yesterday = new Date(+(new Date(new Date(timestamp).toLocaleDateString()))).format('yyyy-MM-dd')
        this.form.begin = `${yesterday} 00:00:00`
        this.form.end = `${yesterday} 23:59:59`
        this.dateRange = null
      } else if (v === -7) {
        let timestamp = +(new Date(today)) - (8.64e7 * 7)
        let oneWeek = new Date(+(new Date(new Date(timestamp).toLocaleDateString()))).format('yyyy-MM-dd')
        this.form.begin = `${oneWeek} 00:00:00`
        this.form.end = `${today} 23:59:59`
        this.dateRange = null
      }
      this.currentPage = 1
      this.esConsumerOrderList()
    },
    showType(v, o) {
      this.currentPage = 1
      this.pageSize = this.showType === 'list' ? this.cacheListSize : this.cachePageSize,
      this.esConsumerOrderList()
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
    })
  },
  components: {checkoutCounterCard, cashierCardList, cashPagination}
}
</script>
<style lang='scss' scoped>
.header-line {
  height: 75px;
  display: flex;
  align-items: center;
}
.filter-line {
  height: 65px;
  display: flex;
  justify-content: space-between;
  background: #fff;
  align-items: center;
  padding: 0 20px 0 15px;
  b {
    font-size: 18px;
  }
  .left-part {
    display: flex;
    align-items: center;
  }
}
.cash-list-card {
  .cashier-list {
    // 撤单这里可以高一点
    min-height: calc(100vh - 260px);
    padding: 16px 10px 0px;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 4px;
}
</style>
