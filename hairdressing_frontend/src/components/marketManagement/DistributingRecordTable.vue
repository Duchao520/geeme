<template>
  <div>
    <div class="table-main">
      <div class="user-defined-tab">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item,index) in redPacketStatus"
            :key="index"
            :label="item.name"
            :name="item.status"
          >用户管理</el-tab-pane>
        </el-tabs>
      </div>
      <div class="table">
        <el-table stripe :data="redPackages" style="width: 100%">
          <el-table-column label width="25px">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.selected"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="红包名称"></el-table-column>
          <el-table-column prop="money" label="红包金额">
            <template slot-scope="scope">
              <span>￥{{scope.row.money}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="生效期限"></el-table-column>
          <el-table-column prop="targetPeople" label="目标用户"></el-table-column>
          <el-table-column label="领取/使用数量" width="width">
            <template slot-scope="scope">
              <span>{{scope.row.linhqu}}/{{scope.row.use}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="consumeNumber" label="消费金额">
            <template slot-scope="scope">
              <span>￥{{scope.row.consumeNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="discountNum" label="抵扣金额">
            <template slot-scope="scope">
              <span>￥{{scope.row.discountNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="receiceInReal" label="实收金额">
            <template slot-scope="scope">
              <span>￥{{scope.row.receiceInReal}}</span>
            </template>
          </el-table-column>
          <el-table-column label="启用" width="width">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.using" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <div class="buttons">
                <g-button
                  name="编辑"
                  type="detail"
                  icon="icon_operate_edit"
                  @click="handleButtonClick(scope.row.id)"
                ></g-button>
                <g-button
                  name="派发"
                  type="mgreen"
                  icon="icon_operate_recover"
                  @click="handleButtonClick(scope.row.id)"
                ></g-button>
                <g-button
                  type="grey"
                  icon="icon_operate_delete"
                  @click="handleButtonClick(scope.row.id)"
                ></g-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottom">
        <div>
          <el-checkbox v-model="allChecked">全选</el-checkbox>
          <g-button
            name="派发"
            type="mgreenFill"
            icon="icon_operate_disable"
            @click="handleButtonClick()"
          ></g-button>
          <g-button
            name="删除"
            type="grey"
            icon="icon_operate_recover"
            @click="handleButtonClick()"
          ></g-button>
        </div>
        <el-pagination
          class="pagination"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNum"
          :page-size="pageParams.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pageParams.totalCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import "@/assets/css/tab.scss";
export default {
  data() {
    return {
      redPackages: [
        {
          selected: false,
          name: "新仁里",
          money: 999,
          startTime: "自绑定起30天",
          targetPeople: "小程序新绑定用户",
          linhqu: 1000,
          use: 500,
          consumeNumber: 12000,
          discountNum: 1000,
          receiceInReal: 1300,
          using: true
        },
        {
          selected: false,
          name: "新仁里",
          money: 999,
          startTime: "自绑定起30天",
          targetPeople: "小程序新绑定用户",
          linhqu: 1000,
          use: 500,
          consumeNumber: 12000,
          discountNum: 1000,
          receiceInReal: 1300,
          using: true
        },
        {
          selected: false,
          name: "新仁里",
          money: 999,
          startTime: "自绑定起30天",
          targetPeople: "小程序新绑定用户",
          linhqu: 1000,
          use: 500,
          consumeNumber: 12000,
          discountNum: 1000,
          receiceInReal: 1300,
          using: true
        },
        {
          selected: false,
          name: "新仁里",
          money: 999,
          startTime: "自绑定起30天",
          targetPeople: "小程序新绑定用户",
          linhqu: 1000,
          use: 500,
          consumeNumber: 12000,
          discountNum: 1000,
          receiceInReal: 1300,
          using: true
        },
        {
          selected: false,
          name: "新仁里",
          money: 999,
          startTime: "自绑定起30天",
          targetPeople: "小程序新绑定用户",
          linhqu: 1000,
          use: 500,
          consumeNumber: 12000,
          discountNum: 1000,
          receiceInReal: 1300,
          using: true
        }
      ],
      redPacketStatus: [
        { status: "ALL", name: "全部" },
        { status: "WAITING_SEND", name: "待发送" },
        { status: "SENDED", name: "已发送" },
        { status: "CLOSED", name: "已结束" }
      ],
      activeName: "ALL",
      allChecked: false,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
        totalCount: 100
      }
    };
  },
  methods: {
    handleButtonClick() {},
    handleCurrentChange() {}
  }
};
</script>
<style lang="scss" scoped>
.table-main {
  .table {
    box-sizing: border-box;
    padding: 0 10px;
    background: #ffffff;
    /deep/ .el-table__row {
      td {
        padding: 16px 0;
      }
    }
  }
}
.bottom {
  box-sizing: border-box;
  padding: 20px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
