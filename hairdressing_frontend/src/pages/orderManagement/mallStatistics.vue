<template>
  <div class="mall-statistics">
    <!-- 顶部区域 -->
    <div class="container-header">
      <div class="header-left">
        <el-radio-group class="btn-group" v-model="radioLabel">
          <el-radio-button :label="1">今天</el-radio-button>
          <el-radio-button :label="2">本周</el-radio-button>
          <el-radio-button :label="3">本月</el-radio-button>
        </el-radio-group>

        <el-date-picker
          style="margin-left: 20px;"
          v-model="date"
          :clearable="false"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>

        <el-select
          v-if="isBrand"
          v-model="query.storeId"
          placeholder="请选择门店"
          :clearable="true"
          style="margin-left: 20px;"
          @change="shopChange"
        >
          <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div></div>
      <input-search
        width="320px"
        placeholder="搜索客户姓名"
        @search="searchData"
        v-model="query.keywords"
      ></input-search>
    </div>
    <!-- 数据视图区域 -->
    <div class="dataCard">
      <ul class="top-data">
        <li v-for="item in top_data" :key="item.id">
          <div>
            <img :src="item.path" alt />
            <div>
              <h3 v-if="item.id === 3">{{item.data.toFixed(2)}}</h3>
              <h3 v-else>{{item.data.toFixed()}}</h3>
              <p>{{item.text}}</p>
            </div>
          </div>
          <i v-if="item.flag"></i>
        </li>
      </ul>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        stripe
        :data="tableData"
        style="width: 100%"
        height="calc(100vh - 356px)"
        v-loading="loading"
      >
        <el-table-column
          class-name="custom_cell border_left"
          class="c6"
          prop="createTime"
          label="下单时间"
        ></el-table-column>
        <el-table-column prop="orderNo" label="订单号"></el-table-column>
        <el-table-column label="订单类型" prop="revenueName"></el-table-column>
        <el-table-column prop="orderName" label="商品名称"></el-table-column>
        <el-table-column label="单价">
          <template slot-scope="scope">
            <p>￥{{scope.row.unitPrice.toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="amount"></el-table-column>
        <el-table-column label="实收款">
          <template slot-scope="scope">
            <p>￥{{scope.row.received.toFixed(2)}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="客户信息">
          <template slot-scope="scope">
            <p>{{scope.row.customerName}}</p>
            <p class="vip1">{{scope.row.levelName}}</p>
          </template>
        </el-table-column>-->
        <el-table-column show-overflow-tooltip min-width="120" align="left" label="客户信息">
          <template slot-scope="scope">
            <div class="client_area">
              <div class="client_msg">
                <div class="client_img">
                  <img :src="scope.row.businessHeadPortrait" />
                  <img
                    class="sex_icon"
                    v-if="scope.row.sex == '女'"
                    src="@/assets/img/female_tip.png"
                  />
                  <img
                    class="sex_icon"
                    v-else-if="scope.row.sex == '男'"
                    src="@/assets/img/male_tip.png"
                  />
                </div>
                <div class="client_info">
                  <p>{{scope.row.customerName}}</p>
                  <!-- 标签需求变更为单独设置一列 -->
                  <!-- <span v-if='scope.row.tags.length>1' class="text-overflow">{{scope.row.tags|tagsFilter}}</span><span v-if='scope.row.tags.length>1'>...</span> -->
                  <span>
                    <span class="send-type-tags">{{scope.row.levelName}}</span>
                  </span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页区域 -->
    <div class="pagination">
      <div></div>
      <div>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="query.currentPage"
          :page-size="query.pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils.js";
export default {
  data() {
    return {
      // 加载标识
      loading: false,
      // 日期切换label
      radioLabel: 1,
      // 视图数据
      top_data: [
        {
          id: 0,
          text: "商城流量",
          path: "/static/images/ordermanagement/icon_Traffic_volume.png",
          data: 36217678.0,
          flag: true
        },
        {
          id: 1,
          text: "新客数量",
          path:
            "/static/images/ordermanagement/icon_Number_of_new_customers.png",
          data: 20160.0,
          flag: true
        },
        {
          id: 2,
          text: "订单数",
          path: "/static/images/ordermanagement/icon_Order_number.png",
          data: 56850.0,
          flag: true
        },
        {
          id: 3,
          text: "订单金额",
          path: "/static/images/ordermanagement/icon_Order_amount.png",
          data: 29800.0,
          flag: false
        }
      ],
      // 表格数据总数
      total: null,
      // 表格数据
      tableData: [],
      // 请求参数
      query: {
        // beginDay: "",
        brandId: null,
        consumerType: 0,
        currentDateFlag: true,
        currentMonthFlag: false,
        currentPage: 1,
        currentWeekFlag: false,
        // endDay: "",
        keyWords: "",
        pageSize: 10,
        storeId: null,
        beginDay: '',
        endDay: '',
      },
      shopList: [],
      date: []
    };
  },
  methods: {
    // 获取表格数据和流量数据
    async getTableData() {
      const res = await this.getOnlyTableData();
      this.top_data[0].data = res.uvCount;
      this.top_data[1].data = res.newCustomerCount;
      this.top_data[2].data = res.orderCount;
      this.top_data[3].data = res.orderSumAmount;
    },
    // 单纯获取表格数据
    async getOnlyTableData() {
      this.loading = true;
      const copyQuery = JSON.parse(JSON.stringify(this.query));
      copyQuery.currentPage = this.query.currentPage - 1;
      const res = await axios.post(`/getMallStatisticsRecordList`, copyQuery);
      // 赋值
      this.tableData = res.recordList;
      this.total = res.total;
      this.loading = false;
      return res;
    },
    // 分页事件
    handleCurrentChange(index) {
      this.query.currentPage = index;
      this.getTableData();
    },
    // 搜索匹配
    searchData(data) {
      this.query.keyWords = data;
      // 获取数据请求
      this.getOnlyTableData();
    },
    // 获取门店列表
    async getShopList() {
      const res = await axios.get(`findShopList/${this.currentInfo.brandId}`);
      this.shopList = res.shopList;
    },
    shopChange() {
      this.handleCurrentChange(1)
    },
  },
  watch: {
    // 监听切换
    radioLabel(val) {
      if (val) {
        this.date = null
      }
      switch (val) {
        case 2:
          this.query.currentDateFlag = false;
          this.query.currentMonthFlag = false;
          this.query.currentWeekFlag = true;
          break;
        case 3:
          this.query.currentDateFlag = false;
          this.query.currentMonthFlag = true;
          this.query.currentWeekFlag = false;
          break;
        case 1:
          this.query.currentDateFlag = true;
          this.query.currentMonthFlag = false;
          this.query.currentWeekFlag = false;
          break;
      }
      this.handleCurrentChange(1)
    },
    date(val) {
      if (val) {
        this.query.beginDay = val[0]
        this.query.endDay = val[1]
        this.query.currentDateFlag = false
        this.query.currentMonthFlag = false
        this.query.currentWeekFlag = false
        this.radioLabel = 0
      } else {
        this.query.beginDay = ''
        this.query.endDay = ''
      }
    }
  },
  created() {
    this.getShopList()
  },
  mounted() {
    // 查询数据
    // let date = utils.formatDate(new Date());
    // date = date.substr(0, 9) + Number(date.substr(9) - 1);
    // console.log(date);

    // // console.log(`${date} 00:00:00` === this.query.beginDay);
    // this.query.beginDay = `${date} 00:00:00`;
    // this.query.endDay = `${date} 23:59:59`;
    this.query.brandId = this.currentInfo.brandId;
    if (!this.isBrand) {
      this.query.storeId = this.currentInfo.shopId;
    }
    this.getTableData();
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    isBrand() {
      return this.$route.path.indexOf("brand") != -1;
    }
  }
};
</script>
<style lang='scss' scoped>
.mall-statistics {
  background: #fff;
  border-radius: 0 0 8px 8px;
  .container-header {
    background-color: #f4f5f9;
    display: flex;
    -webkit-flex-direction: row;
    box-sizing: border-box;
    padding: 20px 0;
    .header-left {
      display: flex;
      justify-content: space-between;
    }
    :nth-child(2) {
      flex: 1;
    }
  }
  .dataCard {
    //中间数据列表
    .top-data {
      background-color: #fff;
      width: 100%;
      height: 112px;
      display: flex;
      justify-content: space-around;
      li {
        width: 24%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        & > div {
          display: flex;
          align-items: center;
          img {
            display: block;
            width: 60px;
            height: 60px;
            margin: 0 17px 0 43px;
          }
          div {
            h3 {
              font-weight: normal;
              color: rgba(153, 153, 153, 1);
              font-size: 32px;
              text-align: left;
              font-family: PingFangSC-Light;
            }
            p {
              color: rgba(102, 102, 102, 1);
              font-size: 16px;
              text-align: left;
              font-family: PingFangSC-Regular;
            }
          }
        }
        i {
          height: 90px;
          width: 2px;
          border-radius: 2px;
          background-color: rgba(233, 233, 233, 1);
        }
      }
    }
  }
  .table {
    background-color: #f4f5f9;
    box-sizing: border-box;
    padding-top: 20px;
  }
}

.vip1 {
  color: #fff;
  background-color: #a3add1;
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

.pagination {
  display: flex;
  justify-content: space-between;
  padding: 17px 23px;
  border-radius: 10px;
}
</style>
