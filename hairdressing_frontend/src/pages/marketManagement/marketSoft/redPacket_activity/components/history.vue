<template>
  <div class="arp-history-main">
    <div class="arp-filter-line">
      <el-form ref="form" :model="form" label-width="80px" class="arp-form">
        <el-form-item label="红包类型:">
          <el-select v-model="form.packetType" @change="handleSelectTypeChange">
            <el-option
              v-for="status in TypeOptions"
              :key="status.value"
              :value="status.value"
              :label="status.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="派发时间:">
          <el-date-picker
            v-model="date"
            unlink-panels
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00','23:59:59']"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="arp-table-main">
      <div class="arp-table-box">
        <div class="user-defined-tab">
          <el-tabs type="card" v-model="packetStatus" @tab-click="handleSelectChange">
            <el-tab-pane
              v-for="item in statusOptions"
              :key="item.value"
              :name="item.value"
              :label="item.label"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <el-table :data="tableData" stripe height="calc(100vh - 372px)" v-loading="tableLoading">
          <el-table-column label="红包名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="first-col">
                <div class="red-packet-name">{{scope.row.packetName}}</div>
                <span
                  class="red-packet-type-tag text-cant-copy"
                  :class="'tag-' + scope.row.packetType"
                >{{scope.row.packetTypeName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="红包金额" prop="totalMoney">
            <template slot-scope="{ row }">
              <p>{{ row.totalMoney ? `￥${row.totalMoney}` : '-'}}</p>
            </template>
          </el-table-column>
          <el-table-column label="适用门店" width="130">
            <template slot-scope="scope">
              {{scope.row.suitStoreStrategy|shopsFilter}}
              <span
                v-if="scope.row.suitStoreStrategy === 2"
                class="btn-text"
                @click="shopsDetails(scope.row.redPacketId)"
              >详情</span>
            </template>
          </el-table-column>
          <el-table-column label="使用/领取数量">
            <template slot-scope="scope">{{scope.row.useNumber||0}} / {{scope.row.sendNumber||0}}</template>
          </el-table-column>
          <el-table-column label="消费金额" prop="consumeMoney">
            <template slot-scope="{ row }">
              <p>{{ row.consumeMoney ? `￥${row.consumeMoney}` : '-'}}</p>
            </template>
          </el-table-column>
          <el-table-column label="抵扣金额" prop="savedMoney">
            <template slot-scope="{ row }">
              <p>{{ row.savedMoney ? `￥${row.savedMoney}` : '-'}}</p>
            </template>
          </el-table-column>
          <el-table-column label="实收金额" prop="receivedMoney">
            <template slot-scope="{ row }">
              <p>{{ row.receivedMoney ? `￥${row.receivedMoney}` : '-'}}</p>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="派发时间" prop="sendTime"></el-table-column>
          <el-table-column label="派发人" prop="senderName"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span
                :class="'tag-' + scope.row.packetStatus"
                class="red-packet-status-tag text-cant-copy"
              >{{scope.row.packetStatus|statusFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            v-if="checkHasBtnPermission('/brand-inner/market/market-list/red-packet-details', 'path')"
          >
            <template slot-scope="scope">
              <g-button
                :name="'详情'"
                class="text-cant-copy"
                :type="'green'"
                :icon="'icon_operate_eyes'"
                @click="toDetails(scope.row.redPacketId)"
              ></g-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="arp-pagination">
        <el-pagination
          style="margin: 5px 0px 5px 0;"
          @current-change="handleCurrentChange"
          :current-page="form.pageNum"
          :page-size="form.pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="适用门店">
      <el-table :data="shopsTable" height="530" stripe>
        <el-table-column prop="storeName" label="门店名称"></el-table-column>
        <el-table-column show-overflow-tooltip label="所在城市">
          <template slot-scope="scope">{{`${scope.row.province}/${scope.row.city}`}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="门店性质" width="80">
          <template slot-scope="scope">{{scope.row.type === 'DIRECT' ? '直营店' : '加盟店'}}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" label="门店创建时间" width="160">
          <template
            slot-scope="scope"
          >{{new Date(scope.row.createTime).format('yyyy-MM-dd hh:mm:ss')}}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      form: {
        packetStatus: 0, // 0–全部，1–已生效，2–未生效，3–已停用，4–暂停使用
        packetName: "",
        packetType: null, // 此处仅限活动红包
        sendStartTime: null,
        sendStopTime: null,
        pageNum: 1,
        pageSize: 10
      },
      statusOptions: [
        {
          value: '0',
          label: "全部"
        },
        {
          value: '1',
          label: "已启用"
        },
        {
          value: '2',
          label: "未生效"
        },
        {
          value: '3',
          label: "已停用"
        },
        {
          value: '4',
          label: "已禁用"
        }
      ],
      TypeOptions: [
        {
          value: null,
          label: "全部"
        },
        {
          value: 1,
          label: "新人红包"
        },
        {
          value: 2,
          label: "老客红包"
        },
        {
          value: 3,
          label: "生日红包"
        },
        {
          value: 4,
          label: "活动红包"
        }
      ],
      date: null, // -
      total: 0,
      tableData: [],
      tableLoading: false,
      dialogVisible: false,
      shopsTable: [],
      packetStatus: '0'
    };
  },
  mounted() {
    this.init();
    this.$root.$on("needRefreshPage", data => {
      this.init(); // - 详情新窗口
    });
  },
  methods: {
    // ...mapActions(['']),
    async init() {
      let data = {
        ...this.form,
        pageNum: this.form.pageNum - 1,
        brandId: this.currentInfo.brandId
      };
      this.tableLoading = true;
      let res = await axios.post("/pagedQueryRedPacketBasicInfo", data);
      this.total = res.total;
      this.tableData = res.listRedPacketBasicInfo;
      this.tableLoading = false;
    },
    handleSelectChange(val) {
      this.form.packetStatus = Number(val.name)
      this.handleCurrentChange(1);
    },
    handleSelectTypeChange() {
      this.handleCurrentChange(1);
    },
    handleCurrentChange(page) {
      this.form.pageNum = page;
      this.init();
    },
    // 适用门店详情
    shopsDetails(id) {
      this.tableLoading = true;
      this.shopsTable = [];
      axios
        .post("/getRedPacketPartSuitStore", { redPacketId: id })
        .then(res => {
          this.tableLoading = false;
          this.dialogVisible = true;
          this.shopsTable = Object.freeze(res.listSuitStoreInfo);
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    // 红包详情
    toDetails(id) {
      // 新标签页打开
      this.toPagesInNewTags(
        "/brand-inner/market/market-list/red-packet-details",
        { id: id }
      );
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    })
  },
  watch: {
    date: {
      handler: function(v, o) {
        if (v) {
          this.form.sendStartTime = v[0];
          this.form.sendStopTime = v[1];
        } else {
          this.form.sendStartTime = null;
          this.form.sendStopTime = null;
        }
        this.handleCurrentChange(1);
      }
    },
    packetName: {
      handler: function(v, o) {
        this.form.packetName = v;
        this.handleCurrentChange(1);
      }
    },
  },
  filters: {
    statusFilter(status) {
      let statusMap = {
        1: "已启用",
        2: "未生效",
        3: "已停用",
        4: "暂停启用"
      };
      return statusMap[status];
    },
    shopsFilter(type) {
      let typeMap = {
        0: '所有门店',
        1: '所有直营店',
        2: '指定门店',
      }
      return typeMap[type]
    }
  },
  beforeDestroy() {
    this.$root.$off("needRefreshPage");
  },
  props: {
    packetName: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang='scss' scoped>
$default_peacock_blue: #41cac0;
$default_blue: #58c9f3;
$default_green: #75c74f;
$default_red: #f52d56;
$default_yellow: #fcb322;
$hover_gray: #bec3c6;
/* arp ==> activity-red-packet */
.arp-history-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  .arp-filter-line {
    height: 75px;
    margin-bottom: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    display: flex;
    .arp-form {
      display: flex;
      align-items: center;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .arp-table-main {
    flex: 1;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    .arp-table-box {
      flex: 1;
    }
    .arp-pagination {
      height: 75px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}

.first-col {
  .red-packet-type-tag {
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 12px;
    &.tag-1 {
      border: 1px solid $default_peacock_blue;
      color: $default_peacock_blue;
    }
    &.tag-2 {
      border: 1px solid $default_yellow;
      color: $default_yellow;
    }
    &.tag-3 {
      border: 1px solid $default_green;
      color: $default_green;
    }
    &.tag-4 {
      border: 1px solid $default_red;
      color: $default_red;
    }
  }
}

.red-packet-status-tag {
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 12px;
  &.tag-1 {
    background: $default_green;
  }
  &.tag-4 {
    background: $default_red;
  }
  &.tag-2 {
    background: $default_yellow;
  }
  &.tag-3 {
    background: $hover_gray;
  }
}

.btn-text {
  color: #58c9f3;
  margin-left: 4px;
  &:hover {
    cursor: pointer;
  }
}
</style>
