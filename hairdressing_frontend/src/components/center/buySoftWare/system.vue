<template>
  <div class="system-wrap">
    <h4>品牌管理者</h4>
    <div class="system-wrap_table">
      <el-table
        class="el-table-re"
        :row-class-name="tableRowClassName"
        :data="brandData"
        height="calc(45vh - 120px)"
      >
        <el-table-column align="left" prop="name" label="品牌" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tradeName" align="left" label="行业" show-overflow-tooltip></el-table-column>
        <el-table-column prop="version" align="left" label="版本">
          <template
            slot-scope="scope"
          >{{scope.row.version===1?'标准版':scope.row.version===2?'专业版':scope.row.version===3?'旗舰版':'未知'}}</template>
        </el-table-column>
        <el-table-column align="left">
          <template slot="header" slot-scope="scope">
            <p>新开券</p>
          </template>
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击查看详情" placement="top">
              <span
                class="ticket"
                @click="openDialog(scope.row,'BUY_NEW',1)"
              >{{scope.row.newNormalUsed+'/'+scope.row.newNormalBought}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="left">
          <template slot="header" slot-scope="scope">
            <p>续期券</p>
          </template>
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击查看详情" placement="top">
              <span
                class="ticket"
                @click="openDialog(scope.row,'RENEWAL',1)"
              >{{scope.row.renewalNormalUsed+'/'+scope.row.renewalNormalBought}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="left">
          <template slot="header" slot-scope="scope">
            <p>新开券(进销存版)</p>
          </template>
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击查看详情" placement="top">
              <span
                class="ticket"
                @click="openDialog(scope.row,'BUY_NEW',2)"
              >{{scope.row.newSupplierUsed+'/'+scope.row.newSupplierBought}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="left">
          <template slot="header" slot-scope="scope">
            <p>续期券(进销存版)</p>
          </template>
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击查看详情" placement="top">
              <span
                class="ticket"
                @click="openDialog(scope.row,'RENEWAL',2)"
              >{{scope.row.renewalSupplierUsed+'/'+scope.row.renewalSupplierBought}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="storeNum" align="left" label="开通门店数"></el-table-column>
        <el-table-column align="left" label="首次开通时间" min-width="120">
          <template slot-scope="scope">
            <span class="text-overflow">{{scope.row.firstStoreCreateTime | fomartTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" min-width="120" label="最近到期时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="text-overflow">{{scope.row.nearestDueTime | fomartTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" width="170" label="操作">
          <template slot-scope="scope">
            <g-button
              :name="'新购'"
              type="red"
              :icon="''"
              @click.native="toNewShop(scope.row)"
              class="btn-button"
            ></g-button>
            <g-button
              :name="'续费'"
              :type="'mgreen'"
              :icon="''"
              @click.native="toRenewal(scope.row, 'brand')"
              class="btn-button"
            ></g-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <h4>门店管理者</h4>
    <div class="system-wrap_table">
      <el-table
        class="el-table-re"
        :row-class-name="tableRowClassName"
        :data="shopData"
        height="calc(45vh - 120px)"
      >
        <el-table-column align="left" label="门店名称" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.city | splitCity}}{{` `+scope.row.name}}</template>
        </el-table-column>
        <el-table-column prop="brandInfo.name" align="left" label="品牌" show-overflow-tooltip></el-table-column>
        <el-table-column prop="brandInfo.tradeName" align="left" label="行业" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="版本">
          <template
            slot-scope="scope"
          >{{scope.row.brandInfo.version===1?'标准版':scope.row.brandInfo.version===2?'专业版':scope.row.brandInfo.version===3?'旗舰版':'未知'}}</template>
        </el-table-column>
        <el-table-column prop="createTime" align="left" label="开通时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dueTime" align="left" label="到期时间"></el-table-column>
        <el-table-column label="门店状态">
          <template slot-scope="scope">
            <status-text
              :name="filterName(scope.row.status,'title')"
              :type="filterName(scope.row.status,'color')"
            />
          </template>
        </el-table-column>
        <el-table-column align="left" width="170" label="操作">
          <template slot-scope="scope">
            <!-- <g-button
                  v-if="scope.row.status !== 'ONLINE' && scope.row.status !== 'OFFLINE' && scope.row.status !== 'OVER_DUE'"
                  :name="'新购'"
                  :type="'red'"
                  :icon="''"
                  @click.native="toEditShop(scope.row, 'shop')"
                  class="btn-button"
            ></g-button>-->
            <g-button
              v-if="scope.row.status === 'ONLINE' || scope.row.status === 'OFFLINE' || scope.row.status === 'OVER_DUE'"
              :name="'续费'"
              :type="'mgreen'"
              :icon="''"
              @click.native="toRenewal(scope.row, 'shop')"
              class="btn-button"
            ></g-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 续费券不足时的模态框 -->
    <g-dialog-with-slot
      :dialogVisible="slotDialogVisible"
      v-if="slotDialogVisible"
      :color="'#FCB322'"
      :title="'暂时不能续费！'"
      :resolveInfo="'立即购买'"
      @close="slotDialogVisible = false"
      @resolve="$router.push('/center/buy-tickets')"
    >
      <div>
        没有可用的续期券，立即
        <router-link title="span" to="/center/buy-tickets" class="link">购买</router-link>
      </div>
    </g-dialog-with-slot>

    <!-- 打开券的模态框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :width="'520px'"
      :before-close="handleClose"
      :lock-scroll="false"
      modal-append-to-body
    >
      <h2 slot="title">{{dialogTitle}}-详情</h2>
      <div>
        <section class="ticket-wrap" v-if="supFlag === 1">
          <el-row type="flex" justify="space-between">
            <div class="ticket-wrap_left">
              <h3>{{dialogTitle}}</h3>
              <p v-text="'￥'+infoData.price"></p>品牌：
              <span v-text="infoData.brandName"></span>
              <br />行业：
              <span v-text="infoData.tradeName"></span>
              <br />进销存版：
              <span v-text="'否'"></span>
              <br />版本：
              <span>{{infoData.version|versionFilter}}</span>
            </div>
            <el-row class="ticket-wrap_right" align="middle" type="flex" justify="center">
              <h2 v-text="infoData.numOfUnused"></h2>
              <span>可用数量</span>
            </el-row>
          </el-row>
          <el-button
            size="small"
            class="normal_blue_btn dialog-inner-btn"
            @click="buyMoreTickets(1,secondFlag)"
          >购买</el-button>
        </section>
        <section class="ticket-wrap" style="margin: 10px 0 0 0;" v-if="secondFlag && supFlag === 2">
          <el-row type="flex" justify="space-between">
            <div class="ticket-wrap_left">
              <h3>{{dialogTitle}}</h3>
              <p v-text="'￥'+infoDataSuppor.price"></p>品牌：
              <span v-text="infoData.brandName"></span>
              <br />行业：
              <span v-text="infoData.tradeName"></span>
              <br />进销存版：
              <span v-text="'是'"></span>
              <br />版本：
              <span>{{infoData.version|versionFilter}}</span>
            </div>
            <el-row class="ticket-wrap_right" align="middle" type="flex" justify="center">
              <h2 v-text="infoData.numOfUnused"></h2>
              <span>可用数量</span>
            </el-row>
          </el-row>
          <el-button
            size="small"
            class="normal_blue_btn dialog-inner-btn"
            @click="buyMoreTickets(2,secondFlag)"
          >购买</el-button>
        </section>
        <h4>消费明细</h4>
        <el-table :row-class-name="tableRowClassName" :data="ticketData" v-loading="ticketLoading">
          <el-table-column prop="createTime" align="left" label="时间" width="170">
            <template
              slot-scope="scope"
            >{{utils.formatDateTimeFromYearToSecond(scope.row.createTime)}}</template>
          </el-table-column>
          <el-table-column align="left" label="消费行为">
            <template
              slot-scope="scope"
            >{{scope.row.optType===1?'购买':scope.row.optType===2?'使用':'开通'}}</template>
          </el-table-column>
          <el-table-column prop="num" align="left" label="增减数量">
            <template slot-scope="scope">
              <span v-if="scope.row.optType===2||scope.row.optType===3">-</span>
              {{scope.row.num}}
            </template>
          </el-table-column>
          <el-table-column prop="residueNum" align="left" label="剩余可用数量">
            <template slot-scope="{row}">
              <p>{{row.residueNum - 1}}</p>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          class="page-bottom"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.currentPage"
          :page-size="pages.pageSize"
          :page-count="5"
          layout="total, prev, pager, next, jumper"
          :total="pages.totalCount"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import * as utils from "@/assets/js/utils";
import * as axios from "@/util/axios";
export default {
  name: "system",
  data() {
    return {
      // 显示券类型标识
      supFlag:null,
      brandData: [],
      shopData: [],
      dialogVisible: false,
      slotDialogVisible: false, // 续费
      dialogTitle: "",
      infoData: {
        price: "",
        brandName: "",
        tradeName: "",
        version: "",
        num: 0,
        numOfUnused:0,
        supportedStore:null,
      },
      // 供货商券信息
      infoDataSuppor: {},
      // 第二种券标识
      secondFlag: false,
      ticketData: [], // 消费明细
      pages: {
        currentPage: 1, // 当前页面
        totalCount: 0, // 总页面
        pageSize: 5 // 每页的条数
      },
      brandId: null,
      type: null, //券的类型
      tableLoading: false,
      ticketLoading: false,
      utils: utils
    };
  },
  methods: {
    ...mapActions([
      "saveCurrentInfo",
      "setBrandSoft",
      "setShopSoft",
      "saveOperate"
    ]),
    tableRowClassName({ row, rowIndex }) {
      let n = rowIndex;
      if ((n + 1) % 2 === 0) {
        return "success-row";
      } else if (n % 2 === 0) {
        return "warning-row";
      }
      return "";
    },
    toNewShop(row) {
      // 买券用
      this.setBrandSoft({
        brandId: row.id, // 品牌id
        name: row.name, // 品牌名称
        version: row.version, // 软件版本
        tradeName: row.tradeName // 所属行业
      });
      this.$router.push({
        path: "/shop-inner/newBuy",
        query: {
          supporFlag: row.hasSupplierStore
        }
      });
    },
    toRenewal(row, type) {
      if (type === "brand") {
        this.setBrandSoft({
          brandId: row.id, // 品牌id
          name: row.name, // 品牌名称
          version: row.version, // 软件版本
          tradeName: row.tradeName // 所属行业
        });
        console.log(row)
        // 如果续期券不足， 不让跳转页面
        if (row.renewalNormalBought+row.renewalSupplierBought - row.renewalNormalUsed-row.renewalSupplierUsed) {
          this.$router.push("/shop-inner/renewal"); // 总部批量续费
        } else {
          this.slotDialogVisible = true;
        }
      } else if (type === "shop") {
        // 门店端暂时不知道续费券数量
        this.setShopSoft({
          shopId: row.id, // 门店id
          shopName: row.name, // 门店名称
          brandId: row.brandId, // 品牌id
          brandName: row.brandInfo.name, // 品牌名称
          version: row.brandInfo.version, // 品牌软件版本
          tradeName: row.brandInfo.tradeName // 所属行业
        });
        this.$router.push("/center/single-shop"); // 单店续费
      }
    },
    /**初始化数据 */
    init() {
      axios.get(`${SERVICE_URL}/service-api/brandList4SoftOrder/`).then(res => {
        this.brandData = res.brandList;
      });
      axios.get(`${SERVICE_URL}/service-api/storeList4SoftOrder/`).then(res => {
        this.shopData = res.storeList;
      });
    },
    /**获取券的详细信息 */
    openDialog(row, type,num) {
      this.secondFlag = row.hasSupplierStore;
      // 判断点击的是普通的还是进销存版的
      this.supFlag = num
      if (type === "BUY_NEW") {
        this.dialogTitle = "门店新开券";
      } else {
        // return utils.showTip(this,{msg:'暂无续期券',type: 'error'});
        this.dialogTitle = "门店续期券";
      }
      // 买券用
      this.setBrandSoft({
        brandId: row.id, // 品牌id
        name: row.name, // 品牌名称
        version: row.version, // 软件版本
        tradeName: row.tradeName // 所属行业
      });
      //券的信息
      this.brandId = row.id;
      this.type = type;
      // 区分有无供应商 《那里取空 ， 避免后端再做处理》 //已废弃 默认有
      let supportedStore = num === 2 ? 'SUPPLIER' : 'NORMAL'
      let info = {
        brandId: row.id,
        type: type,
        supportedStore
      };
      axios.post("/softRecord", info).then(res => {
        let Data = res.softInfo4SoftRecordResponseList;
        this.infoData = Data ? Data[0] : [];
        this.infoDataSuppor = Data.length > 1 ? Data[1] : Data[0];
      });
      this.getRecord(num);
      this.dialogVisible = true;
    },
    buyMoreTickets(num, flag) {
      // 新开券或者续期券购买
      let url = this.type === "BUY_NEW" ? '/shop-inner/newBuy' : '/center/buy-tickets'
      if (flag) {
        num == 2
          ? this.$router.push({
              path: url,
              query: {
                supporFlag: true,
                supporFlagTwo: true
              }
            })
          : this.$router.push({
              path: url,
              query: {
                supporFlag: true
              }
            });
      } else if (!flag) {
        this.$router.push({
          path: url,
          query: {
            supporFlag: false
          }
        });
      }
    },
    /**获取券的消费明细 */
    getRecord(num) {
      let params = {
        brandId: this.brandId,
        pageNum: this.pages.currentPage,
        pageSize: this.pages.pageSize,
        revenueType:num === 2? 'SUPPLIER' : 'NORMAL',
        type: this.type
      };
      this.ticketLoading = true;
      axios.post("/softRecordList", params).then(res => {
        let Data = res.brandSoftRecordInfoList;
        this.ticketData = Data || [];
        this.ticketLoading = false;
        this.pages.totalCount = res.total;
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // 赋值
      this.pages.currentPage = val;
      // 判断是否可调接口
      if (val > this.pages.totalCount || val <= 0) return;
      this.getRecord();
    },
    /*   toEditShop(row, type) {
      this.saveOperate({clickEnter: "edit"});
      this.saveCurrentInfo({shopId: row.id}); // ?
      this.$router.push("/shop-inner/edit/shops"); // 编辑门店新路由
    }, */
    filterName(data, type) {
      let text, color;
      switch (data) {
        case "ONLINE":
          text = "营业中";
          color = "green";
          break;
        case "OFFLINE":
          text = "已下线";
          color = "orange1";
          break;
        case "TRY_OFF_LINE":
          text = "试用下线";
          color = "orange1";
          break;
        case "INSTORE":
          text = "未上线";
          color = "hui";
          break;
        case "TRYING":
          text = "试用中";
          color = "sblue";
          break;
        case "TRY_OVER_DUE":
          text = "试用到期";
          color = "orange";
          break;
        case "OVER_DUE":
          text = "已到期";
          color = "orange";
          break;
      }
      return type === "title" ? text : color;
    }
  },
  filters: {
    fomartTime(time) {
      return time;
    },
    versionFilter(v) {
      let map = {
        1: "标准版",
        2: "专业版",
        3: "旗舰版"
      };
      return map[v];
    },
    splitCity(val) {
      let newVal = val.replace("城区", "");
      return newVal;
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.link {
  color: #58c9f3;
}
.text-overflow {
  width: 100%;
}
.el-dialog__header {
  border-bottom: 1px solid #cdcdcd4d !important;
}
.ticket {
  color: #58c9f3;
  cursor: pointer;
}
.system-wrap {
  padding: 0 20px;
  margin-top: 10px;
  padding-bottom: 20px;
  width: 103%;
  height: 90%;
  overflow: hidden;
  &_table {
    width: 1189px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 8px 0px rgba(174, 184, 229, 0.3);
    border-radius: 6px;
  }
  &_title {
    padding-top: 50px;
    h1 {
      height: 28px;
      color: rgba(102, 102, 102, 1);
      font-size: 20px;
      text-align: center;
    }
    p {
      height: 22px;
      color: rgba(204, 204, 204, 1);
      font-size: 16px;
      text-align: center;
      padding-top: 10px;
    }
  }
}
.el-table::before {
  height: 0px;
}

h4 {
  margin: 30px 0 10px 0;
  color: rgba(51, 51, 51, 1);
  font-size: 14px;
  text-align: left;
}
.el-table-re {
  width: 100%;
  padding: 0 20px 20px 20px;
  border-radius: 6px;
}
.ticket-wrap {
  width: 400px;
  height: 150px;
  background: url("../../../assets/images/bg_ticket.png") no-repeat;
  background-size: 100% 100%;
  color: #fff;
  position: relative;
  .dialog-inner-btn {
    position: absolute;
    bottom: 0;
    right: -80px;
  }
  h2 {
    font-size: 26px;
  }
  &_left {
    width: 65%;
    height: 100%;
    padding: 10px 0 10px 33px;
    p {
      color: rgba(255, 255, 255, 1);
      font-size: 20px;
    }
  }
  &_right {
    width: 39%;
    height: 150px;
    flex-flow: column nowrap;
    h2 {
      text-align: center;
      padding-bottom: 5px;
    }
  }
  span {
    color: rgba(255, 255, 255, 1);
    font-size: 12px;
    text-align: center;
  }
}
.el-pagination {
  padding: 20px 0 0 0 !important;
}
</style>
<style lang="scss">
.el-table .warning-row {
  background: #f4f5f7;
}

.el-table .success-row {
  background: #ffff;
}
</style>