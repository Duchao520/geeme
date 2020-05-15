<template>
  <el-dialog title="选择卡项" :visible="visible" :before-close="handleClose">
    <div class="time-card-select-service">
      <div class="dialog-body-filter-line">
        <div>
          <el-select v-model="params.queryType" placeholder="请选择开项类型">
            <el-option
              v-for="item in cardOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="search-box">
          <g-search :placeholder="'搜索卡项名称'" v-on:search="handleSearch"></g-search>
        </div>
      </div>
      <el-table
        height="420"
        v-loading="tableLoading"
        :data="tableData"
        ref="goodsTable"
        class="card-list"
        :header-cell-style="headerRowStyle"
        highlight-current-row
        @current-change="handleSingleChange"
      >
        <!-- <el-table-column type="selection" width="42px"></el-table-column> -->
        <el-table-column label="卡项名称" show-overflow-tooltip>
          <template slot-scope="{ row }">{{row.cardName}}</template>
        </el-table-column>
        <el-table-column label="卡项类型" show-overflow-tooltip>
          <template slot-scope="{ row }">{{cardType(row.cardType)}}</template>
        </el-table-column>
        <el-table-column label="价格" show-overflow-tooltip prop="shopPrice">
          <template
            slot-scope="scope"
          >￥{{ scope.row.cardFirstRechargeNum > 0 ? scope.row.cardFirstRechargeNum : scope.row.cardPrice}}</template>
        </el-table-column>
      </el-table>
      <div class="bottom-line">
        <el-pagination
          style="margin: 5px 20px 5px 0;"
          @current-change="handleCurrentChange"
          :current-page="params.currentPage"
          :page-size="params.pageSize"
          :pager-count="5"
          layout="total, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose" plain class="plain_gray_btn">关 闭</el-button>
      <el-button class="normal_blue_btn" @click="sendData">保存当前页</el-button>
    </span>
  </el-dialog>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
export default {
  name: "cards-dialog",
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    // 选中项
    superCheckedGoods: {
      type: Set,
      required: true
    }
  },
  data() {
    return {
      params: {
        cardName: null,
        pageNum: 0,
        pageSize: 10,
        queryCondition: 0,
        queryType: 0
      },
      tableData: [],
      total: 0,
      tableLoading: false,
      goodsOptions: [],
      levelTwoOBJ: {},
      headerRowStyle: { background: "#f4f5f7" }, // 表头样式
      multipleSelection: [], // 组件自带的勾选数组对象
      singleCardInfo: {}, // 自制列表卡项单选
      checkedIds: [], // 选中的id们, 用于匹配输入框直接输入的文本是不是打勾了
      cardOptions: [
        {
          label: "所有卡项",
          value: 0
        },
        {
          label: "储值卡",
          value: 1
        },
        {
          label: "身份卡",
          value: 2
        },
        {
          label: "次卡",
          value: 3
        },
        {
          label: "时间卡",
          value: 4
        }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.tableLoading = true;
      let params = JSON.parse(JSON.stringify(this.params));
      axios
        .post("/pagedQueryStoreCardKindBasicInfo", {
          storeId: this.currentInfo.shopId,
          brandId: this.currentInfo.brandId,
          giftCard: true,
          ...params
        })
        .then(res => {
          this.tableData = res.listCardKindBasicInfo;
          this.total = res.total;
          this.tableLoading = false;
          this.$nextTick(() => {
            this.tableData.some(i => {
              // this.$refs.goodsTable.setCurrentRow()
              this.superCheckedGoods.has(i.id) &&
                this.$refs.goodsTable.setCurrentRow(i);
            });
          });
        });
    },
    cardType(cardType) {
      switch (cardType) {
        case 0:
          return "身份卡";
          break;
        case 1:
          return "储值卡";
          break;
        case 2:
          return "次卡";
          break;
        case 3:
          return "时间卡";
          break;
      }
    },
    // 第一列勾选的变化
    handleSelectionChange(checkedRows) {
      this.multipleSelection = checkedRows;
    },
    handleSingleChange(row) {
      row && this.$emit('changeSingle', row.id)
      this.singleCardInfo = row
    },
    handleClose() {
      this.$emit("close");
    },
    sendData() {
      this.$emit("suberData", this.singleCardInfo);
    },
    handleCurrentChange(page) {
      this.params.pageNum = page - 1;
      this.init();
    },
    handleSearch(goodsName) {
      this.params.cardName = goodsName;
      this.handleCurrentChange(1);
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  watch: {
    // multipleSelection(rows, old) {
    //   this.checkedIds = [];
    //   rows.map(i => {
    //     this.checkedIds.push(i.id);
    //   });
    // },
    "params.queryType"() {
      this.handleCurrentChange(1);
    }
  }
};
</script>
<style lang="scss" scoped>
$blue: #58c9f3;
$gray: #d5dadf;

#suber-component-dialog {
  /deep/ .el-dialog__body {
    border-top: 1px solid #f0f1f4;
    padding: 18px 20px;
  }
}

.time-card-select-service {
  box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
  border-radius: 6px;
}

.dialog-body-filter-line {
  padding: 22px 20px 15px 10px;
  display: flex;
  justify-content: space-between;
  .search-box {
    width: 220px;
  }
}
.bottom-line {
  height: 45px;
}
#app .el-pagination {
  margin-top: 15px !important;
  padding: 0;
}

.card-list {
 /deep/ .el-table__body tr.current-row>td {
        background: #58C9F3 !important;
    }
}
</style>
