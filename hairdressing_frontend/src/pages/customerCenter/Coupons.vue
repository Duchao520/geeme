<template>
  <div class="pages-main-box scrollbar">
    <div class="pages-edit-container">
      <div class="coupons-list">
        <div class="coupon-tabs-line">
          <div
            v-for="tag in tags"
            :key="tag.id"
            class="tags"
            :class="{active: active === tag.id}"
            @click="setCurrentActive(tag.id, 1)"
          >
            {{tag.name}}
            <div class="flag-line"></div>
          </div>
        </div>
        <div class="coupon-list-box" ref="cardBox">
          <div class="has-info" v-if="hasinfo">
            <!-- <el-table
              stripe
              :data="list"
              height="calc(100vh - 228px)"
            >
                <el-table-column label="优惠券名称" prop="couponTemplateSnapshot.couponName"></el-table-column>
                <el-table-column label="优惠券金额" prop="couponTemplateSnapshot.money"></el-table-column>
                <el-table-column label="有效期限">
                    <template slot-scope="{row}">
                        {{row.validDateFrom}} 至 {{row.validDateTo}}
                    </template>
                </el-table-column>
                <el-table-column label="优惠券状态" prop="customerCouponStatus" v-if="!active">
                    <template slot-scope="{row}">
                        <span>
                            {{row.customerCouponStatus|statusFilter}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="可用服务" show-overflow-tooltip>
                    <template slot-scope='{row}'>
                        <p v-if="row.couponTemplateSnapshot.allServicePromote">全部服务</p>
                        <p v-else>{{row.couponTemplateSnapshot.serviceLevelTwoNameList.join(',')}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="可用产品" show-overflow-tooltip>
                    <template slot-scope='{row}'>
                        <p v-if="row.couponTemplateSnapshot.allProductPromote">全部产品</p>
                        <p v-else>{{row.couponTemplateSnapshot.productLevelTwoNameList.join(',')}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope='{row}'>
                        <g-button
                        :name="'明细'"
                        :type="'green'"
                        :icon="'icon_operate_eyes'"
                        @click="lookDetail(row)"
                        ></g-button>
                    </template>
                </el-table-column>
            </el-table> -->
            <singleCoupon
               v-for="(item, idx) in list" 
              :key="idx" 
              :superData="item" 
              :singleData="item.couponTemplateSnapshot"
              :status="active"
            />
            <div class="bottom-page-line">
              <el-pagination
                style="margin: 5px 0px 5px 0;"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-size="pageSize"
                :pager-count="5"
                layout="total, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
          <div class="no-info" v-else>
            <img :src="require('@/assets/img/bg_default_goods.png')"/>
            <p>暂无该类型的优惠券</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 详情 -->
    <el-dialog 
      width="800"
      title="优惠券详情"
      v-if="visible"
      :visible.sync="visible"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="110px">
        <el-form-item label="优惠券名称:">
          <p>{{form.couponTemplateSnapshot.couponName}}</p>
        </el-form-item>
        <el-form-item label="优惠券金额:">
          <p>{{form.couponTemplateSnapshot.money}}</p>
        </el-form-item>
        <el-form-item label="使用门槛:">
          <p>{{form.couponTemplateSnapshot.useUnLimited ? '无门槛' : `满${form.couponTemplateSnapshot.purchaseAboveMoney}可用`}}</p>
        </el-form-item>
        <el-form-item label="派发时间:">
          <p>{{form.sendTime}}</p>
        </el-form-item>
        <el-form-item label="生效日期:">
          <p v-if="form.validDateType === 'APPOINT_DATE'">{{form.appointDateFrom}} 至 {{form.appointDateTo}}</p>
          <p v-else>领取后{{form.validDays}}天内有效 </p>
        </el-form-item>
        <el-form-item label="派发数量:">
          <p>{{form.sendAmount}}</p>
        </el-form-item>
        <el-form-item label="每人限领:">
          <p v-if="form.isLimitPerMan">{{form.limitPerManNum}}张</p>
          <p v-else>不限量</p>
        </el-form-item>
        <el-form-item label="适用商品:">
          <p v-if="form.couponTemplateSnapshot.allServicePromote">全部服务</p>
          <el-table :data="form.couponTemplateSnapshot.serviceList" v-if="form.couponTemplateSnapshot.serviceList.length" :height="productTableHeight">
            <el-table-column label="一级分类" show-overflow-tooltip prop="levelOneName"></el-table-column>
            <el-table-column label="二级分类" show-overflow-tooltip prop="levelTwoName"></el-table-column>
            <el-table-column label="服务名称" show-overflow-tooltip prop="simpleTitle"></el-table-column>
          </el-table>
          <p v-if="form.couponTemplateSnapshot.allProductPromote">全部产品</p>
          <el-table :data="form.couponTemplateSnapshot.productList" v-if="form.couponTemplateSnapshot.productList.length" :height="productTableHeight">
            <el-table-column label="一级分类" show-overflow-tooltip prop="levelOneName"></el-table-column>
            <el-table-column label="二级分类" show-overflow-tooltip prop="levelTwoName"></el-table-column>
            <el-table-column label="产品名称" show-overflow-tooltip prop="simpleTitle"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import singleCoupon from '@/pages/marketManagement/marketSoft/coupon/components/singleCoupon';
export default {
  data() {
    return {
      active: 0,
      tags: [
        // { name: "全部", id: null },
        { name: "未使用", id: "UN_USE" },
        { name: "已使用", id: "USED" },
        { name: "已过期", id: "INVALID" }
      ],
      // pageSize: 10,
      pageSize: 0,
      pageNum: 1,
      total: 0,
      loading: false,
      visible: false,
      hasinfo: true, //
      list: []
    };
  },
  mounted() {
    this.calculateItems()
    this.setCurrentActive(this.tags[0].id, 1);
  },
  methods: {
    setCurrentActive(id, page) {
      if (this.active !== id) {
        this.active = id;
        this.pageNum = page;
        this.loading = true;
        let customerType =
          this.currentEntry === "brand" ? "BRAND_CUSTOMER" : "STORE_CUSTOMER";
        let params = {
          customerCouponStatus: id,
          customerType: customerType,
          pageNum: this.pageNum,
          customerId: this.$route.params.id * 1,
          pageSize: this.pageSize
        };
        this.hasinfo = true;
        axios
          .post("/getCustomerCouponsByType", params)
          .then(res => {
            this.list = res.customerCouponInfoList || [];
            this.hasinfo = !!this.list.length;
            this.total = res.total;
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
            this.hasinfo = false;
          });
      }
    },
    handleCurrentChange(page) {
      this.setCurrentActive(this.active, page);
    },
    // 详情UI暂时没有,接口既是本行内容,调用与否看需求
    lookDetail(row) {
      this.visible = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    // 
    calculateItems() {
      // big-box
      let bw = this.$refs.cardBox.clientWidth
      let bh = this.$refs.cardBox.clientHeight
      // single-box
      let sw = 314
      let sh = 150
      let col = Math.floor(bw / sw)
      let row = Math.floor(bh / sh)
      this.pageSize = col * row
      // console.log(bh, col, row)
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
      // customerId: state => state.queryParams.beautyRecordId
    })
  },
  filters: {
      statusFilter(status) {
          let map = {
              'UN_USE': '未使用',
              'USED': '已使用',
              'INVALID': '已失效',
          }
          return map[status]
      }
  },
  components: { singleCoupon }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.pages-main-box {
  width: calc(100vw - 40px);
  height: calc(100vh - 105px);
  padding: 0 20px 20px;
  margin-top: 85px;
  overflow-y: auto;
  box-sizing: content-box;
  .pages-edit-container {
    min-height: calc(100vh - 105px);
  }
}
.coupons-list {
  padding: 0 20px;

  max-width: 1440px;
  min-height: calc(100vh - 105px);
  box-sizing: border-box;
  margin: 0 auto;
  background: #fff;
  border-radius: 6px;

  .coupon-tabs-line {
    height: 49px;
    line-height: 49px;
    border-bottom: solid 1px #d8d8d8;
    display: flex;
    .tags {
      width: 76px;
      margin-right: 15px;
      height: 100%;
      text-align: center;
      font-size: 14px;
      color: #999;
      position: relative;
      &:hover {cursor: pointer;}
      .flag-line {
        visibility: hidden;
        position: absolute;
        width: 40px;
        height: 3px;
        bottom: 0;
        left: 18px;
        background-color: #E4393C;
      }
      &.active {
        color: #E33443;
        .flag-line {
          visibility: visible;
        }
      }
    }
  }
  .coupon-list-box {
    height: calc(100vh - 228px);
    margin: 10px 0;
    .has-info {
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      position: relative;
    }
    .no-info {
      height: 100%;
      text-align: center;
      img{
        width: 276px;
        margin: 200px auto 0;
      }
      p {
        color: rgba(153, 153, 153, 1);
        font-size: 16px;
        text-align: center;
        margin-top: 40px;
      }
    }
  }
  .bottom-page-line {
    width: 100%;
    display: flex;
    position: absolute;
    bottom: -52px;
    right: 0;
    justify-content: flex-end;
  }
}
</style>
