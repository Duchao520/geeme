<template>
  <div class="customer-import-main" v-loading="loading">
    <div class="header-btn-line">
      <div class="left-btn">
        <!-- <el-upload
            class="upload-demo"
            accept=".xls"
            :action="action"
            :data="{brandId: currentInfo.brandId}"
            :headers="{Authorization: token}"
            :file-list="fileList"
            :on-success="handleOnSuccess"
            :limit="1"
          >
            <el-button class="resize-btn normal_red_btn">导入客户资料</el-button>
        </el-upload>-->
        <!-- <el-upload
            class="upload-demo"
            accept=".xls"
            :action="CardAction"
            :data="{brandId: currentInfo.brandId}"
            :headers="{Authorization: token}"
            :file-list="fileList"
            :on-success="handleOnSuccess"
            :limit="1"
          >
            <el-button class="resize-btn normal_green_btn">导入会员卡信息</el-button>
        </el-upload>-->
        <el-upload
          class="upload-demo"
          accept=".xls"
          :action="productAction"
          :data="{brandId: currentInfo.brandId,storeId: currentInfo.shopId}"
          :headers="{Authorization: token}"
          :file-list="fileList"
          :on-success="handleOnSuccess"
          :limit="1"
        >
          <el-button class="resize-btn normal_green_btn" :loading="btnLoad">导入产品信息</el-button>
        </el-upload>
      </div>
      <div class="right-btn">
        <!-- <div class="customer-template">
            <i class="icon iconfont icon-icon_operate_down" @click="downloadTemplate('customer')"> 客户资料模板</i>
          </div>
          <div class="vircard-template">
            <i class="icon iconfont icon-icon_operate_down" @click="downloadTemplate('vip')"> 会员卡信息模板</i>
        </div>-->
        <div class="product-template">
          <i
            class="icon iconfont icon-icon_operate_down"
            @click="downloadTemplate('product')"
          >产品信息模板</i>
        </div>
        <div class="vipcard-template"></div>
      </div>
    </div>
    <div class="table-main">
      <el-table
        :data="tableData"
        :header-row-style="headerStyle"
        height="calc(100vh - 228px)"
        stripe
      >
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span>产品导入记录</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="fileName"></el-table-column>
        <el-table-column label="操作人" prop="userName"></el-table-column>
        <el-table-column label="操作时间" prop="modifyTime"></el-table-column>
        <el-table-column label="上传成功数">
          <template slot-scope="scope">
            <div class="progress-line">
              <el-progress
                :text-inside="true"
                :stroke-width="18"
                :percentage="Math.floor((scope.row.successNum / scope.row.total) * 100) || 0"
              ></el-progress>
              <span>{{scope.row.successNum}} / {{scope.row.total}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="上传状态" width="100">
          <template slot-scope="scope">{{scope.row.status|statusFilter}}</template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <g-button
              @click="downloadHistory(scope.row)"
              :name="'下载'"
              :type="'mgreen'"
              :icon="'icon_operate_down'"
              v-if="!btnLoad"
            ></g-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="floor-line">
        <el-pagination
          v-if="total"
          class="pageNation"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
  <script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapState } from "vuex";
  let loadNum = 0
export default {
  name: "import-customer",
  data() {
    return {
      tableData: [], // 表格历史数据
      headerStyle: { height: "66px" },
      total: 1,
      pageNum: 1,
      pageSize: 10,
      action: `${process.env.SERVICE_URL}/service-api/importCustomers`,
      CardAction: `${process.env.SERVICE_URL}/service-api/importCustomerCard`,
      productAction: `${process.env.SERVICE_URL}/service-api/importProducts`,
      token: "",
      fileList: [], // 需求清空文件
      loading: false,
      btnLoad: false
    };
  },
  created() {
    this.getList();
    this.token = utils.getCookieToken("geeme_pc_token")[2];
  },
  methods: {
    getList(type) {
      this.loading = true;
      axios
        .post("/getGoodsImportRecordList", {
          storeId: this.currentInfo.shopId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          type: 1
        })
        .then(res => {
          this.tableData = res.recordInfoList;
          this.total = res.total;
          this.loading = false;
          if (type == "addFile") {
            if (loadNum > 5) {
              loadNum = 0
              this.btnLoad = false
              return
            }
            // 实现自动刷新上传进度
            if (
              res.recordInfoList[0].successNum != res.recordInfoList[0].total ||
              !res.recordInfoList[0].total
            ) {
              this.btnLoad = true
              setTimeout(() => {
                loadNum++
                this.getList('addFile');
              }, 820);
            } else {
              this.btnLoad = false
            }
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    downloadTemplate(type) {
      if (this.btnLoad) return
      // 下载模板文件

      // let api = type === 'customer' ? '/downloadCustomerModel' : '/downloadCustomerCardModel'
      axios.get("/downloadProductModel", { responseType: "blob" }).then(res => {
        let blob = new Blob([res], { type: "application/vnd.ms-excel" });
        let a = document.createElement("a");
        let url = (a.href = window.URL.createObjectURL(blob));
        //   a.download = type === 'customer' ? '客户资料模板.xls' : '会员卡信息模板.xls'
        a.download = "产品信息模板.xls";
        a.click();
        window.URL.revokeObjectURL(url);
      });
    },
    downloadHistory(obj) {
      // 下载当前历史文件
      axios
        .get(`/downloadGoodsImportResult/${obj.resultFileKey}`, {
          responseType: "blob"
        })
        .then(res => {
          let a = document.createElement("a");
          let url = (a.href = window.URL.createObjectURL(res));
          //   a.download = obj.type === 1 ? '客户导入结果.xls' : '会员卡导入结果.xls'
          a.download = "产品信息模板.xls";
          a.click();
          window.URL.revokeObjectURL(url);
        });
    },
    handleCurrentChange(page) {
      this.pageNum = page;
      this.getList();
    },
    handleOnSuccess(res) {
      loadNum = 0
      this.$message({ type: "success", message: res.message });
      this.fileList = [];
      // 只有新增导入文件以后 才会不断刷新
      this.getList("addFile");
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    })
  },
  filters: {
    statusFilter(status) {
      let map = {
        1: "导入中",
        2: "导入完成",
        3: "导入失败"
      };
      return map[status];
    }
  }
};
</script>
  <style lang='scss' scoped>
.customer-import-main {
  width: 100%;
  height: calc(100vh - 55px);
  & > div {
    box-sizing: border-box;
  }
  /deep/ .el-upload-list {
    display: none;
  }
  /deep/ .upload-demo {
    display: inline-block;
  }
}
.header-btn-line {
  height: 75px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  .resize-btn {
    padding: 10px 17px;
  }
  .right-btn {
    display: flex;
    & > div {
      color: #58c9f3;
      margin-left: 20px;
      font-size: 12px;
      line-height: 35px;
      cursor: pointer;
    }
  }
}
.table-main {
  height: calc(100vh - 154px);
  margin: 0 20px 20px;
  background: #fff;
  left: 205px;
  box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
  border-radius: 6px;
  padding: 3px 10px 0;
  .progress-line {
    margin-right: 20px;
  }
  .floor-line {
    height: 55px;
    padding-top: 20px;
  }
}
</style>