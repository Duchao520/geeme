<template>
  <div class="bind-customer">
    <!-- 表格单选区域 -->
    <div class="radio-group">
      <el-radio-group v-model="params.consumeStatus" size="small">
        <el-radio-button :label="null">全部客户</el-radio-button>
        <el-radio-button :label="'yes'">已成单</el-radio-button>
        <el-radio-button :label="'no'">未成单</el-radio-button>
      </el-radio-group>

      <el-select
        v-model="params.belongStoreId"
        placeholder="请选择"
        clearable
        size="small"
        style="margin-left: 20px;"
      >
        <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
    <!-- 表格主体 -->
    <div class="table-main">
      <el-table stripe :data="bindCustomerData" height="calc(100vh - 289px)" v-loading="loading">
        <el-table-column prop="businessName" label="客户信息">
          <template slot-scope="scope">
            <div class="client_area">
              <div class="client_msg">
                <div class="client_img">
                  <img
                    :src="utils.formatPicImage(scope.row.brandCustomerHeadPortrait, 'style', 40, 'someone', scope.row.brandCustomerSex)"
                  />
                  <img
                    class="sex_icon"
                    v-if="scope.row.brandCustomerSex == '女'"
                    src="@/assets/img/female_tip.png"
                  />
                  <img class="sex_icon" v-else src="@/assets/img/male_tip.png" />
                </div>
                <div class="client_info">
                  <p>{{scope.row.brandCustomerNickName}}</p>
                  <p>{{scope.row.brandCustomerMobile}}</p>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属门店" v-if="isBrand" width="180" show-overflow-tooltip>
          <template slot-scope="{row}">
            <p>{{ row.storeCity + ' ' + row.storeName }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="bindTime" label="绑定时间" width="160" show-overflow-tooltip>
          <template slot-scope="{row}">
            <!-- <p>{{utils.formatDateTimeFromYearToSecond(row.bindTime)}}</p> -->
            <p>{{row.bindTime}}</p>
          </template>
        </el-table-column>
        <el-table-column label="成单状态">
          <template slot-scope="{row}">
            <status-text v-if="row.consumeStatus == 'yes'" :type="'green'" :name="'已成单'"></status-text>
            <status-text v-else :type="'mred'" :name="'未成单'"></status-text>
          </template>
        </el-table-column>
        <el-table-column label="绑定状态">
          <template slot-scope="{row}">
            <status-text v-if="row.status == 'on'" :type="'green'" :name="'已绑定'"></status-text>
            <status-text v-else :type="'mred'" :name="'已解绑'"></status-text>
          </template>
        </el-table-column>
        <el-table-column label="累计收益">
          <template slot-scope="{row}">
            <p v-if="row.takeBonus">￥{{ row.takeBonus }}</p>
            <p v-else>￥0.00</p>
          </template>
        </el-table-column>
        <el-table-column prop="customerNum" label="操作">
          <template slot-scope="{row}">
            <g-button :name="'解绑'" :type="'red'" :icon="'icon_ope_unlock'" @click="unbundle(row)"></g-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pages-line">
      <div class="batch-btn"></div>
      <el-pagination
        style="margin-right: 12px;"
        class="pagination"
        @current-change="handlePageChanged"
        :current-page="params.pageNum"
        :page-size="params.pageSize"
        :pager-count="5"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 解绑 -->
    <g-del-model
      :delTagDialogVisible="unbundleVisible"
      @confirm="unbundleClient"
      @close="unbundleVisible = false"
      title="确定要将该客户解绑吗？"
      content="解绑后，该客户将不再为股东带来收益。"
      icon="icon_popup_question"
      iconColor="#FCB322"
      :btnLoad="btnLoad"
    ></g-del-model>
  </div>
</template>

<script>
import "@/assets/css/tab.scss";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import * as utils from "@/assets/js/utils";
export default {
  data() {
    return {
      utils,
      params: {
        belongStoreId: null,
        consumeStatus: null,
        currentPage: 1,
        pageSize: 10,
        endTime: "",
        startTime: ""
      },
      loading: false,
      bindCustomerData: [],
      total: null,
      unbundleVisible: false,
      storeList: [],
      pitchRow: {},
      btnLoad: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      try {
        this.loading = true;
        // 获取股东的绑定客户
        const [res_1, res_2] = await Promise.all([
          axios.post("/getBrandShareholderBindPagedList", {
            ...this.params,
            brandId: this.currentInfo.brandId,
            shareholderId: this.shareholderDetail.id
          }),
          axios.post("/getStoreListByBrandIdLikeName", {
            brandId: this.currentInfo.brandId,
            pageNum: 1,
            pageSize: 999,
            searchName: null
          })
        ]);
        this.bindCustomerData = res_1.shareholderBindPagedListList;
        this.total = res_1.total;
        this.storeList = res_2.storeBasicInfoList;
      } finally {
        this.loading = false;
      }
    },
    unbundle(row) {
      this.pitchRow = row;
      this.unbundleVisible = true;
    },
    // 解绑
    async unbundleClient() {
      try {
        this.btnLoad = true;
        const res = await axios.post("/relieveBindShareholder", {
          id: this.pitchRow.id
        });
        if (!res.success) return this.$message.error("解绑失败");
        this.$message.success("解绑成功");
        this.unbundleVisible = false;
        this.handlePageChanged(this.params.currentPage);
      } finally {
        this.btnLoad = false;
      }
    },
    handlePageChanged(val) {
      this.params.currentPage = val;
      this.init();
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
      shareholderDetail: state => state.shareholder.shareholderDetail
    }),
    isBrand() {
      return this.currentEntry == "brand";
    }
  },
  watch: {
    "params.belongStoreId"() {
      this.handlePageChanged(1);
    },
    'params.consumeStatus'() {
      this.handlePageChanged(1);
    }
  }
};
</script>

<style lang='scss' scoped>
.bind-customer {
  padding: 20px 20px 0;
}
.pages-line {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
        text-overflow: ellipsis;
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