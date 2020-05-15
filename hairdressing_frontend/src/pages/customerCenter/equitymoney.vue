<template>
  <div class="pages-main-box scrollbar" v-loading="loading">
    <div class="pages-edit-container">
      <div class="customer-wallet">
        <!-- 操作门店 -->
        <div class="select-box" v-if="this.currentEntry == 'brand'">
          <el-select v-model="storeId" placeholder="操作门店" @change="shopChangeSelect">
            <el-option
              v-for="item in shopsOptions"
              :key="item.storeId"
              :label="item.city ? item.city + ' ' + item.storeName : item.storeName"
              :value="item.storeId"
            ></el-option>
          </el-select>
        </div>

        <div class="header-boxs">
          <div class="item-box" v-for="item in headerData" :key="item.desc">
            <img :src="item.path" />
            <div class="right-info">
              <div
                :class="{'h3-income': item.desc == '累计权益金收入', 'h3':item.desc !== '累计权益金收入'}"
                :title="item.money"
              >{{item.money}}</div>
              <span class="frozen-money" v-if="item.desc == '累计权益金收入'">{{`(含冻结金额：￥${frozenMoney})`}}</span>
              <p>{{item.desc}}</p>
            </div>
          </div>
        </div>
        <div class="container-info">
          <div class="main-box">
            <div class="table-title">权益金明细</div>
            <el-table
              :data="tableData"
              stripe
              :height="this.currentEntry == 'brand' ? 'calc(100vh - 380px)' : 'calc(100vh - 330px)'"
            >
              <el-table-column label="时间" prop="createTime"></el-table-column>
              <el-table-column label="类型">
                <template slot-scope="{ row }">
                  <p>{{ row.type | incomeDescribe}}</p>
                </template>
              </el-table-column>
              <el-table-column label="金额">
                <template slot-scope="{row}">
                  <p
                    class="roll-out"
                    v-if="row.type == 1 || row.type == 2 || row.type == 9"
                  >{{row.amount ? `-${row.amount}元` : `-0元`}}</p>
                  <p class="income" v-else>{{row.amount ? `+${row.amount}元` : `+0元`}}</p>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pages-box">
              <el-pagination
                class="pagination"
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
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      shopsOptions: [],
      storeId: null,
      loading: false,
      headerData: [
        {
          money: 0,
          desc: "累计权益金收入",
          path: "/static/images/ordermanagement/icon_rights01.png"
        },
        {
          money: 0,
          desc: "累计权益金转出",
          path: "/static/images/ordermanagement/icon_rights02.png"
        },
        {
          money: 0,
          desc: "权益金余额",
          path: "/static/images/ordermanagement/icon_rights03.png"
        }
      ],
      frozenMoney: 0
    };
  },
  created() {
    this.currentEntry == 'brand' && this.getShopList();
    this.init();
  },
  methods: {
    // 获取门店列表
    async getShopList() {
      const res = await axios.get(
        `/getStoreListByBrandId/${this.currentInfo.brandId}`
      );
      this.shopsOptions = JSON.parse(
        JSON.stringify(res.storeBasicInfoList || [])
      );
      this.shopsOptions.unshift({
        storeId: null,
        storeName: "全部"
      });
    },
    async init(flag) {
      this.loading = true;
      if (flag !== "onlyList") {
        let res_1 = await this.getStatisticsDate();
        this.headerData[0].money = res_1.totalIn || 0; // 收入
        this.headerData[1].money = res_1.totalOut || 0; // 转出
        this.headerData[2].money = res_1.preMoney || 0; // 余额
        this.frozenMoney = res_1.frozenMoney || 0; // 冻结
      }
      let res_2 = await this.getPreMoneyRecord();
      this.total = res_2.total;
      this.tableData = res_2.recordList || [];
      this.loading = false;
    },
    // 统计数据
    async getStatisticsDate() {
      // 如果在门店， 还需要通过门店客id获取品牌客id
      let res_1 = null
      if (this.currentEntry != 'brand') {
        res_1 = await axios.post('getCustomerById', {
          id: this.$route.params.id * 1
        })
      }
      let params = {
        brandCustomerId: this.currentEntry == 'brand' ? this.$route.params.id * 1 : res_1.brandCustomerId,
        brandId: this.currentInfo.brandId
      };
      let res = await axios.post("/getPreMoneyListInCustomerDetail", params);
      return res;
    },
    // 变动明细
    async getPreMoneyRecord() {
      // 如果在门店， 还需要通过门店客id获取品牌客id
      let res_1 = null
      if (this.currentEntry != 'brand') {
        res_1 = await axios.post('getCustomerById', {
          id: this.$route.params.id * 1
        })
      }
      let params = {
        brandCustomerId: this.currentEntry == 'brand' ? this.$route.params.id * 1 : res_1.brandCustomerId,
        brandId: this.currentInfo.brandId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchType: null,
        storeId:
          this.currentEntry == "brand" ? this.storeId : this.currentInfo.shopId
      };
      const res = await axios.post(`/getPreMoneyAccountRecordList`, params);
      return res;
    },
    handleCurrentChange(page, flag) {
      this.pageNum = page;
      this.init(flag);
    },
    shopChangeSelect() {
      this.handleCurrentChange(1, "onlyList");
    }
  },
  computed: {
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry,
      currentInfo: state => state.manage.currentInfo
    })
  },
  filters: {
    incomeDescribe(val) {
      switch (val) {
        case 1:
          return "转出到钱包余额";
        case 2:
          return "转出到银行卡";
        case 3:
          return "推广佣金";
        case 4:
          return "推广邀请奖励";
        case 5:
          return "礼品卡奖励";
        case 6:
          return "拼团奖励";
        case 7:
          return "股东介绍费";
        case 8:
          return "股东分红";
        case 9:
          return "推广撤单";
        case 10:
          return '股东返还金'
        case 11:
          return '股东分红回退'
        case 12:
          return '股东介绍费'
        case 13:
          return '股东保证金回退'
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.pages-main-box {
  width: calc(100vw - 40px);
  height: calc(100vh - 105px);
  padding: 0 20px 20px;
  margin-top: 85px;
  overflow-y: auto;
  box-sizing: content-box;
  .pages-edit-container {
    min-height: calc(100vh - 105px);
  }
}

.customer-wallet {
  max-width: 1440px;
  min-height: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  // background: #fff;
  border-radius: 6px;
  .header-boxs {
    padding: 12px 0;
    height: 90px;
    // background: red;
    margin-bottom: 10px;
    border-radius: 6px;
    display: flex;
    background: #fff;
  }
  .container-info {
    width: 100%;
    max-width: 1440px;
    // min-height: calc(100vh - 287px); // 165 112
    box-sizing: content-box;
    border-radius: 8px;
    flex-flow: column nowrap;
    background: #fff;
  }
  .main-box {
    margin: 0 10px;
    padding-top: 8px;
  }
}

.item-box {
  width: 33.33%;
  display: flex;
  align-items: center;
  img {
    width: 60px;
    height: 60px;
    margin: 0 6%;
  }
  div.right-info {
    flex: 1;
    margin-right: 16px;
    overflow: hidden;
    .h3 {
      width: 100%;
      display: inline-block;
      font-weight: normal;
      color: #363636;
      font-size: 32px;
      text-align: left;
      font-family: PingFangSC-Light;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .h3-income {
      max-width: 50%;
      display: inline-block;
      font-weight: normal;
      color: #363636;
      font-size: 32px;
      text-align: left;
      font-family: PingFangSC-Light;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: middle;
    }
    .frozen-money {
      max-width: 50%;
      display: inline-block;
      font-weight: normal;
      color: #a0a0a0;
      font-size: 14px;
      text-align: left;
      font-family: PingFangSC-Light;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: -55%;
    }
    p {
      color: rgba(102, 102, 102, 1);
      font-size: 16px;
      text-align: left;
      font-family: PingFangSC-Regular;
    }
  }
}
.item-box + .item-box {
  border-left: 2px solid rgb(233, 233, 233);
}
.pages-box {
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.table-title {
  // margin-top: 10px;
  font-size: 18px;
  line-height: 18px;
  font-weight: 700;
}

.roll-out {
  color: #e33a48;
}
.income {
  color: #7bc957;
}

.select-box {
  margin-bottom: 10px;
}
</style>