<template>
  <full-single-page>
    <div class="page-body" v-loading="pageLoading">
      <h2>系统续费</h2>
      <br />
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="品牌名称:">{{brandSoft.name}}</el-form-item>
        <el-form-item label="续费版本:">{{brandSoft.version|versionFilter}}</el-form-item>
        <el-form-item label="续期券:">门店续期券 (1年) &nbsp;&nbsp; {{form.numOfNormal}} 张</el-form-item>
        <el-form-item label="进销存续期券:">门店进销存版续期券 (1年) &nbsp;&nbsp; {{form.numOfSuppor}} 张</el-form-item>
        <el-form-item label="续费门店:">
          <el-button plain class="plain_blue_btn" @click="getShopsList" size="small">选择门店</el-button>
          <br />
          <!-- 页面表格 -->
          <el-table
            :data="tableData"
            v-if="tableData.length"
            :height="tableData.length > 8 ? 8 * 49 + 65 : tableData.length * 49 + 65"
            header-row-class-name="header-row"
          >
            <el-table-column label="所在城市" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.province}}/{{scope.row.city}}</template>
            </el-table-column>
            <el-table-column label="门店名称" show-overflow-tooltip prop="name"></el-table-column>
            <el-table-column label="到期时间" prop="dueTime"></el-table-column>
            <el-table-column label="选择续期券">
              <template slot-scope="scope">
                <span v-if="scope.row.revenueType === 'NORMAL'">门店续期券（1年）</span>
                <span v-else>门店进销存版续期券 (1年)</span>
              </template>
            </el-table-column>
            <el-table-column label="续费后到期时间" prop="newDueTime"></el-table-column>
            <el-table-column label="续费金额" prop="price" width="100"></el-table-column>
            <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                <i
                  class="icon iconfont icon-icon_operate_delete"
                  @click="delSelectedShops(scope.$index)"
                ></i>
              </template>
            </el-table-column>
          </el-table>
          <div class="unenough" v-if="judgeNum">
            <span>已选门店 {{tableData.length}} 家</span>
            <span class="red-font">可用续期券不足，点击</span>
            <router-link class="blue-font" tag="span" to="/center/buy-tickets">购买</router-link>
          </div>
        </el-form-item>
      </el-form>
      <div class="buy-soft-btn-line">
        <el-button class="normal_blue_btn" @click="renewSofts" size="medium">确定提交</el-button>
        <el-button plain class="plain_gray_btn" @click="goBack" size="medium">取消</el-button>
      </div>
    </div>
    <!-- 选择续费门店对话框 -->
    <el-dialog title="选择续费门店" :visible="dialogVisible" :before-close="handleClose">
      <div class="filter-line">
        <div class="left-line">
          <g-address @select="addressChange" class="address" :clearable="true"></g-address>
          <div class="select-box">
            <el-select v-model="query.direct" size="medium" clearable @change="directSelectChanged">
              <el-option :value="false" :label="'所有门店'"></el-option>
              <el-option :value="true" :label="'所有直营店'"></el-option>
            </el-select>
          </div>
          <div class="select-box">
            <el-select
              v-model="query.expiring"
              size="medium"
              clearable
              @change="expiringSelectChanged"
            >
              <el-option :value="false" :label="'全部期限'"></el-option>
              <el-option :value="true" :label="'即将到期'"></el-option>
            </el-select>
          </div>
        </div>
        <div class="search">
          <input-search v-model="query.storeName" placeholder="搜索门店名称" @search="handleSearch"></input-search>
        </div>
      </div>
      <el-table
        stripe
        height="448"
        ref="shopsTable"
        :data="dialogTable"
        v-loading="tableLoading"
        header-row-class-name="header-row"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column label="门店名称" show-overflow-tooltip prop="name"></el-table-column>
        <el-table-column label="所在城市" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.province}}/{{scope.row.city}}</template>
        </el-table-column>
        <el-table-column label="开通时间" prop="createTime"></el-table-column>
        <el-table-column label="到期时间" prop="dueTime"></el-table-column>
      </el-table>
      <div class="pagination-line">
        <el-pagination
          style="margin: 5px 0px 5px 0;"
          @current-change="handleCurrentChange"
          :current-page="query.pageNum"
          :page-size="query.pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <div class="footer-btn-line">
        <el-button plain class="plain_gray_btn" @click="handleClose">取消</el-button>
        <el-button class="normal_blue_btn" @click="sendData">保存当前页</el-button>
      </div>
    </el-dialog>
  </full-single-page>
</template>
<script>
import * as axios from "@/util/axios";
import { mapState, mapActions } from "vuex";
export default {
  name: "brand-softs",
  data() {
    return {
      form: {
        numOfNormal: 0, // 普通票数
        numOfSuppor: 0, // 进销存票数
        normalPrice: 0, // 普通店铺续费价格
        supporPrice: 0 // 供应商店铺续费价格
      },
      tableData: [], // 选中的门店,
      dialogTable: [], // 被选门店
      query: {
        province: null,
        city: null,
        direct: false, // true: 直营店; false: 全部门店。
        expiring: false, // true: 即将到期
        storeName: null, //
        type: "RENEWAL",
        pageNum: 1,
        pageSize: 20
      },
      dialogVisible: false,
      tableLoading: false,
      pageLoading: false,
      total: 0,
      dialogTableSelectedShops: [], // 门店选中的id (一页)
      checkedShopIds: new Set(), // 选中的门店id
      checkedShopObj: {} // 键值对化的选中门店 key: shopId, value: shopObj
    };
  },
  created() {
    this.getTicketsNum();
  },
  methods: {
    ...mapActions(["setBrandSoft"]),
    async getTicketsNum() {
      this.pageLoading = true;
      let res = await axios.post("softRecord", {
        brandId: this.brandSoft.brandId,
        type: "RENEWAL"
      });
      this.$set(
        this.form,
        "numOfNormal",
        res.softInfo4SoftRecordResponseList[0].numOfUnused
      );
      this.$set(
        this.form,
        "numOfSuppor",
        res.softInfo4SoftRecordResponseList[1].numOfUnused
      );
      this.$set(
        this.form,
        "normalPrice",
        res.softInfo4SoftRecordResponseList[0].price
      );
      this.$set(
        this.form,
        "supporPrice",
        res.softInfo4SoftRecordResponseList[1].price
      );
      this.setBrandSoft({
        normalPrice: res.softInfo4SoftRecordResponseList[0].price,
        supporPrice: res.softInfo4SoftRecordResponseList[1].price
      });
      this.pageLoading = false;
    },
    async getShopsList() {
      this.tableLoading = true;
      let data = JSON.parse(JSON.stringify(this.query));
      let res = await axios.post("/getStoreList4UseSoft", {
        brandId: this.brandSoft.brandId,
        ...data
      });
      this.dialogTable = res.storeList;
      this.total = res.total;
      // 通过父组件数据渲染表格勾选
      this.$nextTick(() => {
        this.dialogTable.map(i => {
          this.checkedShopIds.has(i.id) &&
            this.$refs.shopsTable.toggleRowSelection(i, true);
        });
      });
      this.tableLoading = false;
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleCurrentChange(page) {
      this.query.pageNum = page;
      this.getShopsList();
    },
    addressChange(data) {
      this.query.province = data.province || null;
      this.query.city = data.city || null;
      this.handleCurrentChange(1);
    },
    directSelectChanged(data) {
      this.query.direct = data || false;
      this.handleCurrentChange(1);
    },
    expiringSelectChanged(data) {
      this.query.expiring = data || false;
      this.handleCurrentChange(1);
    },
    handleSearch(key) {
      this.query.storeName = key;
      this.handleCurrentChange(1);
    },
    // 勾选变化存储当地页ids
    handleSelectionChange(data) {
      this.dialogTableSelectedShops = data;
    },
    // 保存数据到对话框外面的表格
    sendData() {
      // 没选中的数据
      let difference = this.dialogTable.filter(
        v => !this.dialogTableSelectedShops.map(i => i.id).includes(v.id)
      );
      // this.dialogTableSelectedShops // 选中的数据
      difference.map(i => {
        if (this.checkedShopIds.has(i.id)) {
          this.checkedShopIds.delete(i.id);
          delete this.checkedShopObj[i.id];
        }
      });
      this.dialogTableSelectedShops.map(i => {
        if (!this.checkedShopIds.has(i.id)) {
          this.checkedShopIds.add(i.id);

          let now = +new Date();
          let time =
            new Date(i.dueTime) > now
              ? i.dueTime
              : new Date(now).format("yyyy-MM-dd hh:mm:ss"); // 处理已过期门店的续期
          let year = new Date(time).getFullYear() + 1;
          let newDueTime = year + time.slice(4);
          // 在此区分进销存版的续费价格的差异
          let price =
            i.revenueType === "SUPPLIER"
              ? this.form.supporPrice
              : this.form.normalPrice;
          this.checkedShopObj[i.id] = {
            ...i,
            price,
            newDueTime: newDueTime
          };
        }
      });
      this.tableData = Object.values(this.checkedShopObj);
    },
    delSelectedShops(idx) {
      // 先执行删除set/obj
      let id = this.tableData[idx].id;
      this.checkedShopIds.delete(id);
      delete this.checkedShopObj[id];
      // 再执行删除表格
      this.tableData.splice(idx, 1);
    },
    async renewSofts() {
      if (this.tableData.length < 1) {
        this.$message({
          type: "error",
          message: "请至少选择一个门店"
        });
        return false;
      }
      if (this.judgeNum) {
        this.$message({
          type: "error",
          message: "可用续期券不足!"
        });
        return false;
      }
      this.pageLoading = true;
      let res = await axios.post("/multiStoreRenewal", {
        brandId: this.brandSoft.brandId,
        storeIds: [...this.checkedShopIds]
      });
      this.$message({
        type: res.success ? "success" : "error",
        message: res.message
      });
      if (res.success) {
        this.goBack();
      } else {
        this.pageLoading = false;
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  filters: {
    versionFilter(v) {
      let map = {
        1: "标准版",
        2: "专业版",
        3: "旗舰版"
      };
      return map[v];
    }
  },
  computed: {
    ...mapState({
      brandSoft: state => state.soft.brandSoft
    }),
    // 判断续期券数量是否足够
    judgeNum() {
      console.log(this.tableData);
      let normalData = [];
      let supporData = [];
      this.tableData.forEach(item => {
        item.revenueType === "NORMAL"
          ? normalData.push(item)
          : supporData.push(item);
      });
      if(normalData.length > this.form.numOfNormal || supporData.length > this.form.numOfSuppor) {
        return true
      } else {
        return false
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.page-body {
  margin: 32px 78px 20px;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}
.filter-line {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin-bottom: 12px;
  .left-line {
    display: flex;
    flex-wrap: nowrap;
  }
  .select-box {
    width: 140px;
    margin-left: 8px;
  }
}
/deep/ .header-row {
  th {
    background: #f4f5f7;
  }
}
.pagination-line {
  margin-top: 8px;
}
.footer-btn-line {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
.red-font {
  color: #f52d56;
}
.blue-font {
  color: #58c9f3;
  cursor: pointer;
}
.buy-soft-btn-line {
  margin-left: 32px;
  margin-top: 24px;
}
</style>
