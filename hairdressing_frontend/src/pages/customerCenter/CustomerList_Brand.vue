<template>
  <div class="brand-customer-list-page" v-loading="loading">
    <div class="search-line">
      <div class="search-box">
        <input-search
          :placeholder="'请输入客户姓名/手机号'"
          width="auto"
          v-model="form.keyword"
          @search="handleSearch"
        />
      </div>
    </div>
    <div class="filter-line">
      <div class="left-area">
        <el-form :model="form" label-width="70px" class="query-form">
          <el-form-item label="客户来源: ">
            <el-select v-model="form.source" placeholder="选择客户来源" clearable @change="handleCurrentChange(1)">
              <el-option
                :key="item.id"
                :value="item.id"
                :label="item.name"
                v-for="item in sources"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属门店: ">
            <el-input placeholder="请输入归属门店名称" @keyup.enter.native="handleCurrentChange(1)" v-model="form.belongStore"/>
          </el-form-item>
          <el-form-item label="服务者: ">
            <el-input placeholder="请输入服务者名称" @keyup.enter.native="handleCurrentChange(1)" v-model="form.serverName"/>
          </el-form-item>
        </el-form>
      </div>
      <div class="right-area">
        <el-button class="normal_blue_btn" @click="getTableData">查询</el-button>
        <div class="clear-form-btn" @click="resetFormStatus">清空条件</div>
      </div>
    </div>
    <div class="table-main">
      <div class="user-defined-tab">
        <el-tabs @tab-click="handleCurrentChange(1)" v-model="form.tabEnum" type="card">
          <el-tab-pane
            v-for="(item, index) in selectStatus"
            :key="index"
            :label="item.value"
            :name="item.code"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="table-box">
        <el-table 
          stripe 
          :data="tableData"
          height="calc(100vh - 360px)"
        >
          <el-table-column label="客户信息">
            <template slot-scope="scope">
              <div class="client_area">
                <div class="client_msg">
                  <div class="client_img">
                    <img
                      :src="formatPicImage(scope.row.headPortrait, 'style', 40, 'someone', scope.row.sex)"
                    >
                    <img
                      class="sex_icon"
                      v-if="scope.row.sex == '女'"
                      src="@/assets/img/female_tip.png"
                    >
                    <img
                      class="sex_icon"
                      v-else-if="scope.row.sex == '男'"
                      src="@/assets/img/male_tip.png"
                    >
                  </div>
                  <div class="client_info">
                    <p>{{scope.row.customerName}}</p>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="telephone" width="120" label="手机号"></el-table-column>
          <el-table-column prop="birthDay" label="生日"></el-table-column>
          <el-table-column prop="createDate" show-overflow-tooltip label="录入时间"></el-table-column>
          <el-table-column prop="resource" width="120" label="客户来源"></el-table-column>
          <el-table-column prop="belongStoreName" label="归属门店"></el-table-column>
          <el-table-column prop="serverName" label="服务者"></el-table-column>
          <el-table-column align="left" label="操作" width="100px" v-if="checkHasBtnPermission(`/${currentEntry}-inner/customerRecord`,'path')">
            <template slot-scope="scope">
              <g-button
                :name="'档案'"
                title="美丽档案"
                :type="'green'"
                :icon="'icon_operate_file'"
                @click="lookRecord(scope.row.brandCustomerId)"
              ></g-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages-line">
        <el-pagination
          style="margin-right: 12px;"
          class="pagination"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import "@/assets/css/tab.scss";
import * as utils from "@/assets/js/utils";
export default {
  data() {
    return {
      form: {
        source: null,
        keyword: null,
        serverName: null,
        belongStore: null,
        tabEnum: "ALL"
      },
      selectStatus: [
        { code: "ALL", value: "全部" },
        // { code: "TOP_100", value: "TOP100" },
        // { code: "INACTION", value: "静止客" },
        { code: "NOT_CONSUMED", value: "未消费者" },
        { code: "FEMALE", value: "女性顾客" },
        // { code: "HIGH_AVERAGE_PRICE", value: "高客单价" }
      ],
      tableData: [],
      sources: [],
      total: 0,
      pageSize: 20,
      currentPage: 1,
      loading: false,
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
    };
  },
  created() {
    this.getTableData()
    this.getBrandSource()
  },
  methods: {
    getTableData() {
      this.loading = true
      axios.post("/esBrandCustomerList", {
        brandId: this.currentInfo.brandId, 
        pageSize: this.pageSize,
        currentPage: this.currentPage - 1,
        ...this.form
      }).then(res => {
        this.total = res.total
        this.tableData = res.rows
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    resetFormStatus() {
      this.form = {
        source: null,
        keyword: null,
        serverName: null,
        belongStore: null,
        tabEnum: "ALL",
      };
      this.handleCurrentChange(1)
    },
    handleSearch(keyword) {
      this.form.keyword = keyword;
      this.handleCurrentChange(1)
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.getTableData()
    },
    // 来源选项
    getBrandSource() {
      axios.get('/getCustomerChannelInfos').then(res => {
        this.sources = res.channels
      })
    },
    // 查看档案
    lookRecord(id) {
      this.toPagesInNewTags(`/brand-inner/customerRecord/${id}`)
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  }
};
</script>
<style lang="scss" scoped>
.brand-customer-list-page {
  height: calc(100vh - 55px);
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  flex-direction: column;
  margin-left: 20px;
  & > div {
    width: calc(100% - 20px);
  }
}
.search-line {
  height: 75px;
  display: flex;
  // 主轴对齐
  justify-content: flex-end;
  .search-box {
    width: 280px;
    display: flex;
    // 主轴对齐
    justify-content: flex-end;
    // 交叉轴对齐
    align-items: center;
  }
}
.filter-line {
  height: 75px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  & > div {
    display: flex;
    height: 40px;
  }
  .left-area {
    flex: 1;
    margin-left: 20px;
  }
  .right-area {
    width: 218px;
    border-left: 2px solid #f0f1f4;
    .normal_blue_btn {
      margin-left: 20px;
    }
    .clear-form-btn {
      color: #999;
      margin-left: 10px;
      font-size: 14px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
    }
  }
  .query-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 240px;
      margin-right: 26px;
      margin-bottom: 0;
    }
  }
}
.table-main {
  margin-top: 20px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  height: calc(100vh - 245px);
  border-radius: 6px;
  .table-box {
    padding: 0 20px;
  }
  .pages-line {
    height: 82px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
// 拷贝来的用户信息，可能有冗余
.client_area {
  display: flex;
  .check_single {
    margin: 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }
  .client_msg {
    display: flex;
    align-items: center;
    width: 80%;
    .client_img {
      margin-left: 5px;
      margin-right: 15px;
      position: relative;
    }
    .client_info {
      width: 95%;
      p {
        text-align: left;
        width: 120px;
        overflow: hidden;
        text-overflow:ellipsis; 
        white-space: nowrap;
      }
    }
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: middle;
    }
    .sex_icon {
      position: absolute;
      width: 14px;
      height: 14px;
      left: 22px;
      top: 0;
    }
  }
}
</style>
