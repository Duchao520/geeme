<template>
  <div id="customer-table">
    <el-table class="table-wrap" :data="tableData" stripe>
      <el-table-column
        :width="tableType == 4 ? '' : '140'"
        :label="cardNameByComputed"
        class-name="first-col"
      >
        <template slot-scope="scope">
          <span>{{scope.row.cardName}}</span>
          <!-- <span class="tags">{{scope.row.cardType|cardTypeFilter}}</span> -->
        </template>
      </el-table-column>
      <!-- 卡号 -->
      <el-table-column
        :width="tableType == 4 ? '' : '160'"
        :label="cardNameByComputed"
        show-overflow-tooltip
        class="card-no"
      >
        <template slot-scope="scope">
          <p>
            <span>{{scope.row.cardNo}}</span>
          </p>
          <p>
            <span class="gray-font">备注卡号:</span>
            <span v-if="scope.row.storeRemarkCardNo">{{scope.row.storeRemarkCardNo}}</span>
            <i class="icon iconfont icon-icon_operate_edit" @click="handleEditCardNo(scope.row)"></i>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="办卡时间" :width="tableType == 4 ? '' : '100'">
        <template
          slot-scope="scope"
        >{{new Date(+(new Date(scope.row.createTime))).format('yyyy-MM-dd hh:mm:ss')}}</template>
      </el-table-column>

      <!-- 身份卡、次卡、时间卡 售卡金额 -- 订单取的 -->
      <el-table-column label="售卡单价" v-if="tableType !== 1 && tableType !== 4">
        <template slot-scope="scope">{{scope.row.cardPrice|moneyFilter}}</template>
      </el-table-column>
      <el-table-column label="礼品卡卡单价" v-if="tableType == 4">
        <template slot-scope="scope">{{(scope.row.cardPrice > 0 ? scope.row.cardPrice : scope.row.cardFirstRechargeNum) || '-'}}元</template>
      </el-table-column>
      <el-table-column label="售卡总金额" v-if="tableType !== 1 && tableType !== 4">
        <template slot-scope="scope">{{scope.row.cardPriceSum|moneyFilter}}</template>
      </el-table-column>
      <!-- 储值卡充金额 -->
      <el-table-column label="累计充值卡金" v-if="tableType === 1">
        <template slot-scope="scope">{{scope.row.totalRechargeMoney|moneyFilter}}</template>
      </el-table-column>
      <el-table-column label="累计赠送卡金" v-if="tableType === 1">
        <template slot-scope="scope">{{scope.row.totalGiftMoney|moneyFilter}}</template>
      </el-table-column>
      <el-table-column label="剩余充值卡金" v-if="tableType === 1">
        <template slot-scope="scope">
          <span :class="{red: !scope.row.rechargeMoney}">{{scope.row.rechargeMoney|moneyFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余赠送卡金" v-if="tableType === 1">
        <template slot-scope="scope">
          <span :class="{red: !scope.row.giftMoney}">{{scope.row.giftMoney|moneyFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余次数" v-if="tableType === 2">
        <template slot-scope="scope">
          <span
            v-if="scope.row.totalCountLimit === -1"
          >{{scope.row.listServiceCountInfo|timesCardCountFilter}}次</span>
          <span v-else>{{scope.row.totalCountLimit}}次</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余次数" v-if="tableType === 3">
        <template>
          <span>点击详情查看</span>
        </template>
      </el-table-column>
      <el-table-column prop="finishTime" :label="tableType === 1 ? '有效期' : '到期时间'" :width="tableType == 4 ? '' : '120'">
        <template slot-scope="scope">
          <span v-if="scope.row.finishTime||scope.row.validPermanent">
            {{scope.row.finishTime|finishTimeFilter}}
            <i
              v-if="!scope.row.validPermanent && scope.row.status === 0"
              class="icon iconfont icon-icon_operate_edit"
              @click="handleEditFinishTime(scope.row)"
            ></i>
          </span>
          <span v-else>
            {{'使用后'+scope.row.validUsedNum + datetrans(scope.row.validUnit)}}
            <i
              v-if="scope.row.status === 0"
              class="icon iconfont icon-icon_operate_edit"
              @click="handleEditFinishTime(scope.row)"
            ></i>
          </span>
        </template>
        <!-- <p v-else>该卡使用后开始计算时间</p> -->
      </el-table-column>
      <el-table-column label="状态" :width="tableType == 4 ? '' : '120'">
        <template slot-scope="scope">
          <span
            v-if="scope.row.status === 0 || scope.row.status === 3"
            class="state-tags"
            :class="statusComputed(scope.row.validPermanent, scope.row.finishTime,scope.row.status) === '有效' ? 'use-tags' : 'overdue-tags'"
          >{{statusComputed(scope.row.validPermanent, scope.row.finishTime,scope.row.status)}}</span>
          <span class="state-tags offline" v-if="scope.row.status === 1">已禁用</span>
          <span class="state-tags offline" v-if="scope.row.status === 2">已删除</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="tableType == 4 ? '' : '200'">
        <template slot-scope="scope">
          <g-button
            @click="goDetail(scope.row)"
            :name="'详情'"
            :type="'green'"
            :icon="'icon_operate_eyes'"
          ></g-button>
          <g-button
            v-if="statusComputed(scope.row.validPermanent, scope.row.finishTime,scope.row.status) === '有效' || statusComputed(scope.row.validPermanent, scope.row.finishTime,scope.row.status) === '未使用' "
            @click="toggleStatus(scope.row)"
            :name="scope.row.status===1 ||scope.row.status===2  ? '解禁' : '禁用'"
            :type="scope.row.status===1 ||scope.row.status===2  ? 'detail' : 'red'"
            :icon="scope.row.status===1 ||scope.row.status===2  ? 'icon_ope_unlock' : 'icon_operate_disable'"
          ></g-button>
          <!-- 为使用后开始计时的卡单独放置一种btn显示状态 -->
          <g-button
            v-if="scope.row.status === 1 && !scope.row.validPermanent && !scope.row.finishTime"
            @click="toggleStatus(scope.row)"
            :name="scope.row.status===1 ||scope.row.status===2  ? '解禁' : '禁用'"
            :type="scope.row.status===1 ||scope.row.status===2  ? 'detail' : 'red'"
            :icon="scope.row.status===1 ||scope.row.status===2  ? 'icon_ope_unlock' : 'icon_operate_disable'"
          ></g-button>
        </template>
      </el-table-column>
    </el-table>
    <cardDeatil
      :visible="visible"
      :info="currentCardInfo"
      @closeDialog="visible = false"
      v-if="visible"
    />

    <!-- 编辑备注卡号 -->
    <el-dialog title="修改备注卡号" :visible="dialogVisible" width="30%" :before-close="handleClose">
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="4">备注卡号:</el-col>
        <el-col :span="12">
          <el-input v-model.trim="storeRemarkCardNo" placeholder="备注卡号" :maxlength="24"></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button plain class="plain_gray_btn" @click="handleClose">取 消</el-button>
        <el-button class="normal_blue_btn" @click="handleEditCardNoSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑卡项到期时间 -->
    <el-dialog
      title="修改有效期"
      :visible="dialogFinishTimeVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="4">到期时间:</el-col>
        <el-col :span="12">
          <el-date-picker
            v-model="finishTime"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
          ></el-date-picker>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button plain class="plain_gray_btn" @click="handleClose">取 消</el-button>
        <el-button class="normal_blue_btn" @click="handleEditFinishTimeSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cardDeatil from "./cardsDetails";
import * as axios from "@/util/axios";
export default {
  props: {
    tableData: Array,
    tableType: Number,
    hasCards: Boolean
  },
  data() {
    return {
      currentCardInfo: null,
      visible: false,
      dialogVisible: false, //  备注卡号
      dialogFinishTimeVisible: false, //  卡项有效期
      storeRemarkCardNo: "", // 输入的备注卡号
      finishTime: "", // 选择的有效期时间  yyyy-MM-dd HH:mm:ss , 前提是非永久有效，非禁用卡才能编辑
      id: "" // 编辑对话框用
    };
  },
  computed: {
    cardNameByComputed() {
      if (this.tableType === 0) {
        return "身份卡";
      } else if (this.tableType === 1) {
        return "储值卡";
      } else if (this.tableType === 2) {
        return "次卡";
      } else if (this.tableType === 3) {
        return "时间卡";
      } else {
        return "礼品卡";
      }
    }
  },
  methods: {
    // 英文年月日转为中文
    datetrans(date) {
      switch (date) {
        case "year":
          return "年";
        case "month":
          return "月";
        default:
          return "日";
      }
    },
    // 状态
    statusComputed(valid, finish, status) {
      if (status === 3) {
        return "未使用";
      }
      // 为解禁后的还未开始使用的首次使用计时卡单独设置一种判断  返回还未使用
      if (status === 0 && !valid && !finish) {
        return "未使用";
      }
      if (valid) {
        return "有效";
      } else {
        let now = +new Date();
        let r = now >= finish ? "过期" : "有效";
        return r;
      }
    },
    goDetail(cardInfo) {
      this.currentCardInfo = cardInfo;
      this.visible = true;
    },
    toggleStatus(row) {
      this.$emit("changeStatus", row);
    },
    // 编辑对话框的关闭 - 通用 （卡号、有效期）
    handleClose() {
      this.dialogVisible = false; // 备注卡号的
      this.dialogFinishTimeVisible = false; // 卡项有效期的, 偷懒一起用这个函数
      this.storeRemarkCardNo = "";
      this.id = "";
    },
    handleEditCardNo(row) {
      this.dialogVisible = true;
      this.storeRemarkCardNo = row.storeRemarkCardNo;
      this.id = row.id;
    },
    async handleEditCardNoSubmit() {
      let res = await axios.post("/modifyStoreRemarkCardNo", {
        id: this.id,
        storeRemarkCardNo: this.storeRemarkCardNo
      });
      if (res.success) {
        this.$emit("init");
        this.handleClose();
      }
      this.$message({
        type: res.success ? "success" : "error",
        message: res.success ? "编辑成功" : "编辑失败"
      });
    },
    handleEditFinishTime(row) {
      this.dialogFinishTimeVisible = true;
      this.id = row.id;
    },
    async handleEditFinishTimeSubmit() {
      let res = await axios.post("/modifyCardFinishTime", {
        cardId: this.id,
        finishTime: this.finishTime
      });
      if (res.success) {
        this.$emit("init");
        this.handleClose();
      }
      this.$message({
        type: res.success ? "success" : "error",
        message: res.success ? "编辑成功" : "编辑失败"
      });
    }
  },
  filters: {
    cardTypeFilter(type) {
      const typeMap = {
        0: "身份卡",
        1: "储值卡",
        2: "次卡",
        3: "时间卡"
      };
      return typeMap[type];
    },
    statusTypeFilter(type) {
      const typeMap = {
        0: "正常",
        1: "禁用",
        2: "删除"
      };
      return typeMap[type];
    },
    finishTimeFilter(time) {
      let r = time ? new Date(time).format("yyyy-MM-dd") : "永久有效";
      return r;
    },
    moneyFilter(money) {
      let r = money && money >= 0 ? money + "  元" : "-";
      return r;
    },
    timesCardCountFilter(list) {
      let v = 0;
      list && list.map(i => (v += i.countLimit));
      return v;
    }
  },
  components: { cardDeatil }
};
</script>

<style lang="scss" scoped>
#customer-table {
  font-family: "PingFangSC-Regular";
  width: 100%;
  padding-bottom: 10px;
  .tags {
    display: inline-block;
    width: 50px;
    height: 20px;
    border: 1px solid rgba(255, 109, 97, 1);
    color: rgb(255, 109, 97);
    text-align: center;
    border-radius: 12px;
    line-height: 20px;
    font-size: 12px;
    margin-left: 8px;
  }
  .state-tags {
    display: inline-block;
    width: 50px;
    height: 17px;
    line-height: 17px;
    border-radius: 12px;
    color: #fff;
    text-align: center;
    font-size: 12px;
  }
  .diable-tags {
    background-color: rgba(255, 109, 97, 1);
  }
  .use-tags {
    background-color: rgba(169, 216, 110, 1);
  }
  .offline {
    background-color: rgba(226, 44, 55, 1);
  }
  .overdue-tags {
    background-color: #707171;
  }
  .red {
    color: #ff6d61;
  }
  /deep/ thead.has-gutter {
    color: #333;
    th {
      font-weight: normal;
    }
  }
  /deep/ .first-col {
    color: #333;
  }
  .card-no {
    font-size: 12px;
  }
  .icon-icon_operate_edit {
    color: #58c9f3;
    cursor: pointer;
  }
  .gray-font {
    color: #999;
  }
}
</style>
