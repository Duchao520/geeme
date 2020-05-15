<template>
  <el-dialog
    :title="showTitle"
    :visible="selectShopModelVisible"
    @close="hideThisDialog"
    @open="prepareData"
    width="800px"
  >
    <div class="select-shop-container">
      <div class="header">
        <div class="area">
          <g-address v-if="selectShopModelVisible" @select="addressChange" class="address"></g-address>
          <!-- <el-checkbox v-model="allAreaShop" @change="checkAllShopsInArea">该地区全部门店</el-checkbox> -->
        </div>
        <div class="search">
          <input-search v-model="name" placeholder="搜索门店名称" @search="search"></input-search>
        </div>
      </div>
      <div class="content">
        <el-table
          :data="list"
          :header-cell-style="headerRowStyle"
          @selection-change="handleSelectionChange"
          empty-text="查找为空"
          ref="multipleTable"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="门店名称"></el-table-column>
          <el-table-column prop="type" label="门店性质">
            <template slot-scope="scope">
              {{scope.row.type === 'DIRECT' ? '直营店': '加盟店'}}
            </template>
          </el-table-column>
          <el-table-column prop="city" label="所在城市"></el-table-column>
          <!-- <el-table-column label="会员数"></el-table-column>
          <el-table-column label="门店创建时间"></el-table-column> -->
        </el-table>
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="pageParam.pageSize"
            :current-page="pageParam.currentPage"
            layout="total, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
        <div class="operation">
          <el-button type="primary" @click="confirm">确 定</el-button>
          <el-button @click="$emit('close')" style="margin-right: 10px;">取 消</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import * as axios from "@/util/axios";
import * as api from "@/assets/js/interface";
export default {
  props: {
    selectShopModelVisible: Boolean,
    type: String,
    defualt: Array,
  },
  data() {
    return {
      headerRowStyle: { background: "#F4F5F7" },
      brandId: this.$store.state.manage.currentInfo.brandId,
      province: null,
      city: null,
      name: null,
      pageParam: {
        currentPage: 1,
        pageSize: 10
      },
      total: 0,
      list: [],
      selection: [],
      savedSelection: [],
      allAreaShop: false
    };
  },
  computed: {
    showTitle() {
      switch (this.type) {
        case "upper":
          return "选择上架门店";
        case "suit":
          return "选择适用门店";
      }
    }
  },
  methods: {
    prepareData() {
      this.city = this.province = this.name = null;
      this.pageParam.currentPage = 1;
      this.allAreaShop = false;
      this.getMyShops(true);
    },
    hideThisDialog() {
      this.$emit("close");
    },
    addressChange(data) {
      this.province =
        data.province === "所有省份" || data.province === ""
          ? null
          : data.province;
      this.city =
        data.city === "所有城市" || data.city === "" ? null : data.city;
      this.pageParam.currentPage = 1;
      this.getMyShops();
      this.allAreaShop = false;
    },
    search(data) {
      this.pageParam.currentPage = 1;
      this.getMyShops();
    },
    getMyShops(/* isInit */) {
      /* if (isInit === true) {
        this.savedSelection = JSON.parse(JSON.stringify(this.defualt))
      } else {
        this.savedSelection.push(...this.selection);
        this.savedSelection = this.dedupeSelection(this.savedSelection);
        console.log(this.savedSelection)
      } */
      axios
        .post(api.getBasicStoreListByFilter.URL, {
          brandId: this.brandId,
          city: this.city,
          name: this.name,
          province: this.province,
          pageParam: {
            currentPage: this.pageParam.currentPage,
            pageSize: this.pageParam.pageSize
          }
        })
        .then(res => {
          this.list = res.listStoreInfo;
          this.total = res.total;
         /*  if (isInit === true) { */
          this.$nextTick(() => { this.setSelection(this.defualt)})
          /* } else {
            this.$nextTick(() => { this.setSelection(this.savedSelection)})
          } */
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCurrentChange(val) {
      this.pageParam.currentPage = val;
      this.getMyShops();
    },
    handleSelectionChange(data) {
      this.selection = data.map(i => i = {storeId: i.id, storeName: i.name});
    },
    checkAllShopsInArea() {
      if (this.province == null && this.city == null) {
        this.$message.error("请先选择地区");
        this.allAreaShop = false;
      }
    },
    confirm() {
      let data;
      if (this.allAreaShop) {
        data = {
          city: this.city,
          provide: this.province
        };
      } else {
        data = {
          shops: this.dedupeSelection(this.selection)
        };
      }
      this.$emit("change", {
        type: this.type,
        data
      });
      this.$emit("close");
    },
    setSelection(arr) {
      if (arr.length === 0) {
        this.$refs.multipleTable.clearSelection()
        return
      }
      this.list.forEach(row => {
        if (arr.filter(i => i.storeId === row.id).length > 0) {
          this.$refs.multipleTable.toggleRowSelection(row, true)
        }
      })
    },
    /* 通用数组按id去重方法 */
    dedupeSelection(arr) {
      const idList = arr.map(i => i = i.storeId)
      let selection = arr.filter((i, index) => {
        return idList.indexOf(i.storeId) === index
      })
      return selection
    }
  }
};
</script>

<style lang="scss" scoped>
.select-shop-container {
  padding: 12px 20px 20px 20px;
  box-sizing: border-box;
  border-top: 1px solid #f0f1f4;
  .header {
    display: flex;
    justify-content: space-between;
    margin: 0 0 15px 0;
    .area {
      display: flex;
      align-items: center;
      .address {
        margin: 0 20px 0 0;
      }
    }
  }
  .content {
    .pagination {
      margin: 10px 0 20px 0;
    }
    .operation {
      display: flex;
      flex-direction: row-reverse;
    }
    /deep/ .el-table th td {
      padding: 8px 0;
    }
  }
}
</style>
  