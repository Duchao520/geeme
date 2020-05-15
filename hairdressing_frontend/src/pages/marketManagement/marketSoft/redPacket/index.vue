<template>
  <div class="red-packet-box">
    <div class="header-line-in-page">
      <div v-if="checkHasBtnPermission('/brand-inner/market/market-list/send-red-packet', 'path')">
        <el-button 
        class="normal_red_btn"
        @click="toSendRedPacket(1)" 
      >
        新人红包
      </el-button>
      <!-- <el-button 
        class="normal_red_btn"
        @click="toSendRedPacket(2)" 
      >
        老客红包
      </el-button>
      <el-button 
        class="normal_red_btn"
        @click="toSendRedPacket(3)" 
      >
        生日红包
      </el-button> -->
      </div>
      <i v-else></i>
      <div class="search-box">
        <g-search :placeholder='"搜索红包名称"' v-on:search="handleSearch"></g-search>
      </div>
    </div>
    <div class="filter-line-in-page page-content-area">
      <el-form :model="form" label-width="85px">
        <el-form-item label="红包状态：">
          <el-select clearable v-model="form.packetStatus" @change="handleSelectChanged" placeholder="筛选红包状态">
            <el-option v-for="status in statusOptions" :key="status.value" :value="status.value" :label="status.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 10px;" label="派发时间：">
          <el-date-picker
            v-model="timerange"
            @change="handleTimeChange"
            type="datetimerange"
            unlink-panels
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-in-page page-content-area">
      <el-table :data="tableData" stripe height="calc(100vh - 304px)" v-loading="tableLoading">
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
            <span v-if="scope.row.suitStoreStrategy === 2" class="btn-text" @click="shopsDetails(scope.row.redPacketId)">详情</span> 
          </template>
        </el-table-column>
        <el-table-column label="使用/领取数量">
          <template slot-scope="scope">
              {{scope.row.useNumber||0}} / {{scope.row.sendNumber||0}}
          </template>
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
            <span :class="'tag-' + scope.row.packetStatus" class="red-packet-status-tag text-cant-copy">{{scope.row.packetStatus|statusFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="checkHasBtnPermission('/brand-inner/market/market-list/red-packet-details', 'path')">
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
      <div class="bottom-page-line">
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
           <template slot-scope="scope">
            {{`${scope.row.province}/${scope.row.city}`}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="门店性质" width="80">
          <template slot-scope="scope">
            {{scope.row.type === 'DIRECT' ? '直营店' : '加盟店'}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" label="门店创建时间" width="160">
          <template slot-scope="scope">
            {{new Date(scope.row.createTime).format('yyyy-MM-dd hh:mm:ss')}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import * as axios from '@/util/axios'
import { mapActions, mapState } from "vuex"
export default {
  name: 'red-packet-index',
  data() {
    return {
      // 筛选表单
      form: {
        packetName: '', // 红包名
        packetStatus: null, // 红包状态
        pageNum: 1, // 页码, 新业务接口请求时要减1
        pageSize: 10, // 条数
      }, 
      total: 0,
      tableLoading: false,
      dialogVisible: false,
      timerange: [],
      statusOptions: [
        {
          value: 1,
          name: '已启用'
        },
        {
          value: 2,
          name: '未生效'
        },
        {
          value: 3,
          name: '已停用'
        },
        {
          value: 4,
          name: '暂停启用'
        },
      ],
      tableData: [],
      shopsTable: [], // 对话框里的门店列表
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions(['setRedPacketInfo']),
    init() {
      let params = {
        brandId: this.currentInfo.brandId,
        sendStartTime: this.timerange ? this.timerange[0] : null,
        sendStopTime: this.timerange ? this.timerange[1] : null,
        ...this.form
      }
      params.pageNum--
      this.tableLoading = true
      axios.post('/pagedQueryRedPacketBasicInfo', params).then(res => {
        this.tableData = res.listRedPacketBasicInfo
        this.total = res.total
        this.tableLoading = false
      })
    },
    // 指定门店详情
    shopsDetails(id) {
      this.tableLoading = true
      this.shopsTable = []
      axios.post('/getRedPacketPartSuitStore', {redPacketId: id}).then(res => {
        this.tableLoading = false
        this.dialogVisible = true
        this.shopsTable = Object.freeze(res.listSuitStoreInfo)
      }).catch(err => {
        this.tableLoading = false
      })
    },
    // 红包详情
    toDetails(id) {
      // 新标签页打开
      this.toPagesInNewTags('/brand-inner/market/market-list/red-packet-details', {id: id})
    },
    // 派发红包
    toSendRedPacket(type) {
      this.$router.push({
        path:'/brand-inner/market/market-list/send-red-packet',
        query:{
          type
        }
      })
    },
    handleSearch(keywords) {
      this.form.packetName = keywords
      this.form.pageNum = 1
      this.init()
    },
    handleSelectChanged(v) {
      this.form.packetStatus = v || null
      this.form.pageNum = 1
      this.init()
    },
    handleTimeChange() {
      this.form.pageNum = 1
      this.init()
    },
    handleCurrentChange(page) {
      this.form.pageNum = page
      this.init()
    }
  },
  filters: {
    typeFilter(type) {
      let typeMap = {
        1: '新人红包',
        2: '老客红包',
        3: '生日红包',
      }
      return typeMap[type]
    },
    statusFilter(status) {
      let statusMap = {
        1: '已启用',
        2: '未生效',
        3: '已停用',
        4: '暂停启用',
      }
      return statusMap[status]
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
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
    }),
  }
}
</script>

<style lang="scss" scoped>
$default_peacock_blue: #41CAC0;
$default_blue: #58C9F3;
$default_green: #75C74F;
$default_red: #F52D56;
$default_yellow: #FCB322;
$hover_gray: #BEC3C6;

.red-packet-box {
  height: 100%;
  .page-content-area {
    background: #fff;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  }
  .header-line-in-page {
    height: 35px;
    display: flex;
    justify-content: space-between;
    .el-button {
      padding: 9px 17px;
    }
  }
  .filter-line-in-page {
    height: 65px;
    margin-top: 15px;
    border-radius: 4px;
    display: flex;
    padding: 0px 5px;
  }
  .el-form {
    flex: auto;
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    .el-form-item {
      margin: 7px 0;
    }
  }
  .table-in-page {
    margin-top: 15px;
    padding: 10px 10px 0;
    height: calc(100vh - 234px);
    border-radius: 4px;
  }
  .bottom-page-line {
    height: 75px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
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
}
</style>
