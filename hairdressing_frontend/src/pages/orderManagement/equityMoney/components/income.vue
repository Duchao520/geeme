<template>
  <div class="income-box">
    <el-table
      :data="tableData"
      height="calc(100vh - 389px)"
      stripe
      style="width: 100%; padding: 0 10px;"
      v-loading.fullscreen.lock="pageLoading"
    >
      <el-table-column prop="createTime" label="收入时间"></el-table-column>
      <el-table-column label="客户姓名">
        <template slot-scope="scope">
          <div class="client_area">
            <div class="client_msg">
              <div class="client_img">
                <img
                  :src="formatPicImage(scope.row.headPortrait, 'style', 40, 'someone', scope.row.sex)"
                />
                <img class="sex_icon" v-if="scope.row.sex == '女'" src="@/assets/img/female_tip.png" />
                <img
                  class="sex_icon"
                  v-else-if="scope.row.sex == '男'"
                  src="@/assets/img/male_tip.png"
                />
              </div>
              <div class="client_info">
                <p>{{scope.row.nickName}}</p>
                <span>
                  <span class="send-type-tags">{{scope.row.memberLevel}}</span>
                </span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column label="收入/回退金额">
        <template slot-scope="scope">
          <p class="green" :class="{'red': scope.row.type == 9 || scope.row.type == 11 || scope.row.type == 13}">￥{{scope.row.type == 9 ? '-' + scope.row.amount.toFixed(2) : scope.row.amount.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="收入/回退来源">
        <template slot-scope="{ row }">
          <p>{{ row.type | incomeSource}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="收入/回退描述">
        <template slot-scope="{ row }">
          <p>{{ row.type | incomeDescribe}}</p>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <div class="pagination">
      <div></div>
      <div>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pageNum"
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
import * as utils from "@/assets/js/utils.js";
import { mapState, mapActions } from "vuex";
export default {
  props: {
    filterData: {
      type: Object,
      default: () => {}
    },
    keyWord: {
      type: String
    }
  },
  watch: {
  },
  filters: {
    incomeSource(val) {
      switch (val) {
        // 收入1.2不管
        // case 1:
        //   return ''
        // case 2:
        case 3:
          return '推广返佣'
        case 4:
          return '推广返佣'
        case 5:
          return '礼品卡'
        case 6:
          return '拼团返现'
        case 7:
          return '股东分红'
        case 8:
          return '股东分红'
        case 9:
          return '推广返佣'
        case 10:
          return '股东分红'
        case 11:
          return '股东分红'
        case 12:
          return '股东分红'
        case 13:
          return '股东分红'
      }
    },
    incomeDescribe(val) {
      switch (val) {
        // 收入1.2不管
        // case 1:
        //   return ''
        // case 2:
        case 3:
          return '推广佣金'
        case 4:
          return '推广邀请奖励'
        case 5:
          return '礼品卡奖励'
        case 6:
          return '拼团奖励'
        case 7:
          return '股东介绍费'
        case 8:
          return '股东分红'
        case 9:
          return '推广撤单'
        case 10:
          return '股东返还金'
        case 11:
          return '股东分红回退'
        case 12:
          return '股东介绍费'
        case 13:
          return '股东保证金回退'
      }
    },
  },
  data() {
    return {
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      total: null,
      tableData: [],
      pageLoading: false,
      pageNum: 1,
      pageSize: 10
    };
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    isBrand() {
      return this.currentEntry == "brand";
    }
  },
  mounted() {
    // this.getIncomeRecord();
  },
  methods: {
    async getIncomeRecord() {
      // 获取数据
      this.pageLoading = true;
      try {
        const res = await axios.post("/getPreMoneyInComeList", {
          ...this.filterData,
          brandId: this.currentInfo.brandId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          storeId: this.isBrand ? this.filterData.storeId : this.currentInfo.shopId,
          timeFrom: this.filterData.timeFrom ? (this.filterData.timeFrom + ' 00:00:00') : null,
          timeTo: this.filterData.timeTo ? (this.filterData.timeTo + ' 23:59:59') : null,
        });
        this.tableData = res.incomeRecordList;
        this.total = res.total;
      } finally {
        this.pageLoading = false;
      }
    },
    // 分页切换事件
    handleCurrentChange(index) {
      this.pageNum = index;
      this.getIncomeRecord();
    },
    // 查看进度事件
    async handleClick(id) {
      console.log(id);
    }
  }
};
</script>

<style lang='scss' scoped>
.stylebtn {
  width: 60px !important;
}

.pagination {
  display: flex;
  justify-content: space-between;
  padding: 17px 23px;
}

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

.send-type-tags {
  border-radius: 12px;
  padding: 2px 4px;
  font-size: 10px;
  border: 1px solid #b2bbdc;
  background: #b2bbdc;
  color: #fff;
}

.green {
  color: green;
  &.red {
    color: red;
  }
}

</style>