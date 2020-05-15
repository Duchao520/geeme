<template>
  <div class="record-wrapper">
    <div class="record-title">销售记录</div>
    <div class="record-content">
      <el-table :data="list" :stripe="true">
        <el-table-column prop="cardName" label="卡项名称"></el-table-column>
        <el-table-column label="购买人">
          <template slot-scope="scope">
            <div>
              {{scope.row.businessName}}
              <br>
              {{scope.row.customerPhone}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="buyTime" label="购买时间"></el-table-column>
        <el-table-column label="实付金额">
          <template slot-scope="scope">
            <div style="color:#FF6D61;">￥{{scope.row.paidMoney}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="buyStore" label="购买门店"></el-table-column>
        <!-- 禁用启用相关暂时不做 -->
        <!-- <el-table-column label="启用">
          <template slot-scope="scope">
            <div class="card-status">
              <div
                class="status-tag"
                style="background:#A9D86E;"
                v-show="scope.row.cardUseStatus === 0 "
              >已启用</div>
              <div
                class="status-tag"
                style="background:#E22C37;"
                v-show="scope.row.cardUseStatus === 1 "
              >已禁用</div>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
      <el-pagination
        class="pageNation"
        @current-change="handleCurrentChange"
        :current-page="queryParam.pageNum + 1"
        :page-size="queryParam.pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import * as api from "@/assets/js/interface";
export default {
  props: {
    /* list: Array */
    id: Number
  },
  data() {
    return {
      queryParam: {
        cardKindId: this.id,
        cardKindSnapshotId: null,
        pageNum: 0,
        pageSize: 9
      },
      list: [
        {
          buyStore: "杭州庆春路店",
          buyTime: "2019-01-23 10:00:12",
          cardName: "至尊卡",
          cardUseStatus: 0,
          customerName: "赵丽颖",
          customerPhone: "18668313322",
          paidMoney: 500
        },
        {
          buyStore: "杭州庆春路店",
          buyTime: "2019-01-23 10:00:12",
          cardName: "至尊卡",
          cardUseStatus: 1,
          customerName: "赵丽颖",
          customerPhone: "18668313322",
          paidMoney: 500
        },
        {
          buyStore: "杭州庆春路店",
          buyTime: "2019-01-23 10:00:12",
          cardName: "至尊卡",
          cardUseStatus: 0,
          customerName: "赵丽颖",
          customerPhone: "18668313322",
          paidMoney: 500
        },
        {
          buyStore: "杭州庆春路店",
          buyTime: "2019-01-23 10:00:12",
          cardName: "至尊卡",
          cardUseStatus: 1,
          customerName: "赵丽颖",
          customerPhone: "18668313322",
          paidMoney: 500
        },
        {
          buyStore: "杭州庆春路店",
          buyTime: "2019-01-23 10:00:12",
          cardName: "至尊卡",
          cardUseStatus: 0,
          customerName: "赵丽颖",
          customerPhone: "18668313322",
          paidMoney: 500
        },
        {
          buyStore: "杭州庆春路店",
          buyTime: "2019-01-23 10:00:12",
          cardName: "至尊卡",
          cardUseStatus: 1,
          customerName: "赵丽颖",
          customerPhone: "18668313322",
          paidMoney: 500
        }
      ],
      total: 0
    };
  },
  watch: {
    id(val) {
      this.queryParam.cardKindSnapshotId = val
      this.queryParam.pageNum = 0
      this.getSnapshotSalesRecordList()
    }
  },
  mounted() {
    this.getSalesRecordList();
  },
  methods: {
    /* 用 queryParam获取销售记录 */
    getSalesRecordList() {
      axios.post(api.pagedQueryCardKindSalesRecord.URL,this.queryParam).then(res => {
        this.list = res.listCardSellInfo
        this.total = res.total
      }).catch(err => {
        console.log(err)
      })
    },
    getSnapshotSalesRecordList() {
      axios.post(api.pagedQueryCardKindSnapshotSalesRecord.URL, this.queryParam).then(res => {
        this.list = res.listCardSellInfo
        this.total = res.total
      }).catch(err => {
        console.log(err)
      })
    },
    handleCurrentChange(page) {
      this.queryParam.pageNum = page - 1
      this.getSalesRecordList()
    },
  }
};
</script>

<style lang="scss" scoped>
.record-wrapper {
  /* margin: 20px; */
  .record-title {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
    line-height: 20px;
    margin: 0 0 6px 0;
  }
  .record-content {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    border-radius: 8px;
    padding: 0 11px 20px 11px;
    .card-status {
      display: flex;
      align-items: center;
      .status-tag {
        padding: 0 7px;
        height: 17px;
        line-height: 17px;
        text-align: center;
        color: #ffffff;
        border-radius: 8px;
      }
    }
    .pageNation {
      margin: 14px 0 0 0;
    }
  }
}
</style>