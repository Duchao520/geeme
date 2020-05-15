<template>
  <el-dialog title="选择服务" :visible="visible" :before-close="handleClose">
    <div class="time-card-select-service">
      <div class="dialog-body-filter-line">
        <div class="level-filter-box" v-if="!isSort">
          <!-- 下拉组件 -->
          <el-select
            v-model="params.levelOne"
            placeholder="选择一级分类"
            clearable
            @change="levelOneChanged"
          >
            <el-option
              v-for="item in levelOneOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="params.levelTwo"
            placeholder="选择二级分类"
            clearable
            @change="levelTwoChanged"
          >
            <el-option
              v-for="item in levelTwoOptions"
              :key="item.jimeiClassId"
              :label="item.sortName"
              :value="item.jimeiClassId"
            ></el-option>
          </el-select>
        </div>
        <div v-else></div>
        <div class="search-box">
          <g-search :placeholder="'搜索服务名称'" v-on:search="handleSearch" v-if="!isSort"></g-search>
          <g-search :placeholder="'搜索二级分类名'" v-on:search="handleSearch" v-else></g-search>
        </div>
      </div>
      <el-table
        stripe
        height="420"
        v-loading="tableLoading"
        :data="tableData"
        ref="goodsTable"
        :header-cell-style="headerRowStyle"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="42px"></el-table-column>
        <!-- <el-table-column label="服务项目名称" show-overflow-tooltip prop="serviceName"></el-table-column> -->
        <el-table-column label="服务项目名称" show-overflow-tooltip prop="goodsName" v-if="!isSort"></el-table-column>
        <el-table-column label="门店价" show-overflow-tooltip prop="shopPrice" v-if="!isSort">
          <template slot-scope="scope">￥{{scope.row.shopPrice}}</template>
        </el-table-column>
        <el-table-column label="会员价" show-overflow-tooltip prop="shopPrice" v-if="!isSort">
          <template slot-scope="scope">￥{{scope.row.memberPrice}}</template>
        </el-table-column>
        <el-table-column label="一级分类" show-overflow-tooltip prop="sortOneName" v-if="isSort"></el-table-column>
        <el-table-column label="二级分类" show-overflow-tooltip prop="sortTwoName" v-if="isSort"></el-table-column>
        <el-table-column label="商品数" show-overflow-tooltip prop="goodsCount" v-if="isSort"></el-table-column>
      </el-table>
      <div class="bottom-line">
        <el-pagination
          v-if="!isSort"
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
  name: "service-dialog",
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    isSort: {
      type: Boolean,
      default: false
    },
    // 选中项
    superCheckedGoods: {
      type: Set,
      required: true
    },
    isBrand: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      params: {
        currentPage: 1,
        pageSize: 10,
        goodsName: null,
        goodsType: "service",
        levelOne: null,
        levelTwo: null
      },
      sortParams: {
        searchType: "service",
        sortName: ""
      },
      tableData: [],
      total: 0,
      tableLoading: false,
      goodsOptions: [],
      levelTwoOBJ: {},
      headerRowStyle: { background: "#f4f5f7" }, // 表头样式
      multipleSelection: [], // 组件自带的勾选数组对象
      checkedIds: [], // 选中的id们, 用于匹配输入框直接输入的文本是不是打勾了
      idType: ""
    };
  },
  created() {
    if (!this.isSort) {
      let serviceData = {
        goodsTypeScope: "service",
        storeId: this.currentInfo.shopId
      };
      axios.post("/getSortInfoFromStoreGoods", serviceData).then(res => {
        this.goodsOptions = res.storeSortInfoList;
      });
    }
    this.idType = this.isSort ? "sortTwo" : "goodsId";
    this.init();
  },
  methods: {
    init() {
      this.tableLoading = true;
      let params = JSON.parse(
        JSON.stringify(this.isSort ? this.sortParams : this.params)
      );
      params.currentPage--;
      let url = this.isSort ? "/getSortInfo" : "/getStoreGoodsListForAd";
      axios
        .post(
          // '/getStoreServiceListForPerformance',
          url,
          {
            storeId: this.isBrand ? null : this.currentInfo.shopId,
            brandId: this.isBrand ? this.currentInfo.brandId : null,
            ...params
          }
        )
        .then(res => {
          // this.tableData = res.serviceInfoList
          this.tableData = this.isSort
            ? res.infoList
            : res.adGoodsInfoForLevelList;
          // this.tableData.forEach(i => {
          //   i.goodsName = i.serviceName
          // })
          this.total = res.total;
          this.tableLoading = false;
          this.$nextTick(() => {
            this.tableData &&
              this.tableData.map(i => {
                this.superCheckedGoods.has(i[this.idType]) &&
                  this.$refs.goodsTable.toggleRowSelection(i, true);
              });
          });
        });
    },
    // 第一列勾选的变化
    handleSelectionChange(checkedRows) {
      this.multipleSelection = checkedRows;
    },
    levelOneChanged() {
      this.params.levelTwo = null;
      this.handleCurrentChange(1);
    },
    levelTwoChanged() {
      this.handleCurrentChange(1);
    },
    handleClose() {
      this.$emit("close");
    },
    sendData() {
      // 比对数据
      let difference = this.tableData.filter(
        v =>
          !this.multipleSelection
            .map(i => i[this.idType])
            .includes(v[this.idType])
      );
      let template = {
        no: difference, // 没选中的数据
        yes: this.multipleSelection // 选中的数据
      };
      this.$emit("suberData", template);
    },
    handleCurrentChange(page) {
      this.params.currentPage = page;
      this.init();
    },
    handleSearch(goodsName) {
      if (this.isSort) {
        this.sortParams.sortName = goodsName;
      } else {
        this.params.cardName = goodsName;
      }
      this.handleCurrentChange(1);
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    levelOneOptions() {
      let o = [];
      this.goodsOptions.map(p => {
        o.push({ id: p.jimeiClassId, name: p.sortName });
        this.levelTwoOBJ[p.jimeiClassId] = p.sortTwoList;
      });
      return o;
    },
    levelTwoOptions() {
      return this.levelTwoOBJ[this.params.levelOne];
    }
  },
  watch: {
    multipleSelection(rows, old) {
      this.checkedIds = [];
      rows.map(i => {
        this.checkedIds.push(i[this.idType]);
      });
    }
  }
};
</script>
<style lang='scss' scoped>
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
</style>
