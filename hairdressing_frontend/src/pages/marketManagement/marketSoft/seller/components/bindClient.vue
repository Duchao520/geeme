<template>
  <div class="bind-client">
    <!-- 表格单选区域 -->
    <div class="radio-group">
      <el-radio-group v-model="params.sellStatus" size="small">
        <el-radio-button :label="null">全部客户</el-radio-button>
        <el-radio-button :label="1">已成单</el-radio-button>
        <el-radio-button :label="0">未成单</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 表格主体 -->
    <div class="table-main">
      <el-table stripe :data="bindSellerData" height="calc(100vh - 423px)" v-loading="loading">
        <el-table-column prop="businessName" label="客户信息">
          <template slot-scope="scope">
            <div class="client_area">
              <div class="client_msg">
                <div class="client_img">
                  <img v-if="scope.row.headPortrait" :src="scope.row.headPortrait" />
                  <img
                    v-else
                    :src="utils.formatPicImage(scope.row.headPortrait, 'style', 40, 'someone', scope.row.sex)"
                  />
                  <img
                    class="sex_icon"
                    v-if="scope.row.sex == '女'"
                    src="@/assets/img/female_tip.png"
                  />
                  <img class="sex_icon" v-else src="@/assets/img/male_tip.png" />
                </div>
                <div class="client_info">
                  <p>{{scope.row.businessName}}</p>
                  <p>{{scope.row.mobile}}</p>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="bindTime" label="绑定时间">
          <template slot-scope="{row}">
            <p>{{utils.formatDateTimeFromYearToSecond(row.bindTime)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="sellStatus" label="成单状态">
          <template slot-scope="{row}">
            <p v-if="row.sellStatus === 1">已成单</p>
            <p v-else>未成单</p>
          </template>
        </el-table-column>
        <el-table-column prop="expectAmount" label="累计收益">
          <template slot-scope="{row}">
            <p>￥{{row.expectAmount.toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="customerNum" label="操作">
          <template slot-scope="{row}">
            <g-button
              :name="'解绑'"
              :type="'red'"
              :icon="'icon_ope_unlock'"
              @click="unbundle(row)"
            ></g-button>
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
      content="解绑后，该客户将不再为推客带来收益。"
      icon="icon_popup_question"
      iconColor="#FCB322"
    ></g-del-model>
  </div>
</template>

<script>
import "@/assets/css/tab.scss";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import * as utils from "@/assets/js/utils";
export default {
  props: {
    sellerId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      utils,
      loading: false,
      // 绑定客户数据
      bindSellerData: [],
      // 请求参数
      params: {
        pageNum: 1,
        pageSize: 10,
        sellStatus: null
      },
      total: null,
      // 解绑对话框标识
      unbundleVisible:false,
      // 选中的客户
      currentClient:null,
    };
  },
  mounted() {
    this.getBindSeller();
  },
  methods: {
    ...mapActions(["saveSellerFlag"]),
    // 获取绑定客户
    async getBindSeller() {
      this.loading = true;
      const res = await axios.post("/getCustomerListBySellerId", {
        ...this.params,
        sellerId: this.sellerId
      });
      this.loading = false;
      this.total = res.total;
      this.bindSellerData = res.sellCustomerInfoList;
    },
    // 解绑
    unbundle(row) {
      this.currentClient = row
      this.unbundleVisible = true
    },
    // 解绑确认
    async unbundleClient() {
      // this.saveSellerFlag(!this.$store.state.seller.clientFlag)
      // return
      const res = await axios.post('/unbindCustomer',{
        brandCustomerId: this.currentClient.id
      })
      if(!res.success) return this.$message.error('解绑客户失败')
      this.$message.success('解绑客户成功')
      this.unbundleVisible = false
      this.getBindSeller()
      // 改变vuex中的推客解绑标识
    },
    // 分页切换
    handlePageChanged(index) {
      this.params.pageNum = index;
      this.getBindSeller();
    },
  },
  watch: {
    "params.sellStatus"(val) {
      this.getBindSeller();
    }
  },
  computed: {
    
  },
};
</script>

<style lang='scss' scoped>
.bind-client {
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