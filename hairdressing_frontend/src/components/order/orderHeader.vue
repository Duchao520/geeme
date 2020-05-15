<template>
  <div class="root-root">
    <div class="con">
      <div class="first">
        <div class="first-inner">
          <el-radio-group v-model="time" @change="limitTime">
            <el-radio-button
              v-for="(item,index) in timeDays"
              :key="index"
              :label="item.value"
            >{{item.name}}</el-radio-button>
          </el-radio-group>
          <el-date-picker
            class="date-picker"
            v-model="date_"
            type="datetimerange"
            align="left"
            :clearable='false'
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="limitTime"
          ></el-date-picker>
          &nbsp;
          &nbsp;
          <switch-menu style="margin-right:20px;" v-model="showType"></switch-menu>
        </div>
      </div>
      <div class="second">
        <div class="left-part-box">
          <separate-button-groups
            class="buttons"
            v-if="showType==='card'"
            :list="tags"
            v-model="billType"
            v-loading.orderHeader="headLoad"
          ></separate-button-groups>
          <!-- <span v-if="showType==='list'" style="color:#999999;font-size:12px;">
            仅显示
            <span style="font-weight:600;color:#333333">{{' 已结算 '}}</span>服务单
          </span> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
export default {
  props: {
    currentStatus: String,
    billNumberInfo: Object,
    headLoad: Boolean
  },
  data() {
    return {
      utils: utils,
      timeLimit: 0,
      billType: "All",
      tag: null,
      date_: [],
      time: 0,
      timeDays: [
        {
          name: "今天",
          value: 0
        },
        {
          name: "昨天",
          value: -1
        },
        {
          name: "近7天",
          value: -7
        }
      ],
      showType: "card"
    };
  },
  computed: {
    params() {
      let begin, end;
      if (Array.isArray(this.timeLimit)) {
        begin = this.timeLimit[0];
        end = this.timeLimit[1];
      } else if (this.timeLimit === -1) {
        begin = utils.getZeroTime(-1);
        end = utils.getZeroTime(0);
      } else if (this.timeLimit === null) {
        begin = utils.getZeroTime(0);
        end = utils.getZeroTime(1);
        this.time = 0
      }else {
        begin = utils.getZeroTime(this.timeLimit);
        end = utils.getZeroTime(1);
      }
      return {
        begin,
        end,
        scope: this.billType,
        timeDay:this.time
      };
    },
    tags() {
      return [
        {
          name: "全部",
          value: "All",
          count: this.billNumberInfo.allCount
        },
        {
          name: "待结算",
          value: "UnBilling",
          count: this.billNumberInfo.unBillingCount
        },
        {
          name: "待支付",
          value: "UnPaid",
          count: this.billNumberInfo.unPaidCount
        },
        {
          name: "已完成",
          value: "Paid",
          count: this.billNumberInfo.paidCount
        },
        {
          name: "已删除",
          value: "delete",
          count: this.billNumberInfo.deletedCount // 只能通过多个接口请求获取全部的数量数据
        },
        {
          name: "已撤销",
          value: "repeal",
          count: this.billNumberInfo.repealCount
        },
      ];
    }
  },
  watch: {
    billType(value) {
      this.$emit("change", this.params);
    },
    showType(showType) {
      // this.billType = showType==="list"?"PAID":"ALL";
      this.billType = showType === "list" ? "Paid" : "All";
      this.$emit("changeShowType", showType);
    }
  },
  methods: {
    limitTime(time) {
      this.timeLimit = time;
      if (Array.isArray(time)) {
        this.time = null;
      } else {
        this.date_ = [];
      }
      this.$emit("change", this.params);
    },
    clearAndrefresh() {
      // this.timeLimit = 0;
      // this.time = 0;
      this.$emit("change", this.params);
    },
  }
};
</script>

<style lang="scss" scoped>
@mixin button($color, $border, $bg) {
  background: $bg;
  color: $color;
  border: 1px solid $border;
  line-height: 26px;
  font-size: 12px;
  box-sizing: border-box;
  padding: 0 9px;
  border-radius: 3px;
  margin-right: 4px;
}
.root-root {
  .con {
    box-sizing: border-box;
    padding: 15px;
    background: #fff;
    border-radius: 4px;
    .first {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .first-inner {
        display: flex;
        align-items: center;
        /deep/ .el-input__icon,
        /deep/ .el-input__inner {
          height: 36px;
          line-height: 36px;
          .el-range-separator {
            line-height: 28px;
          }
        }
      }
      .button-back {
        @include button(#7f7f7f, #bec3c6, #ffffff);
        height: 28px;
      }
      /deep/ .el-radio-button__inner {
        display: block;
        padding: 0 20px;
        line-height: 35px;
        font-size: 14px;
      }
      .date-picker {
        margin-left: 10px;
      }
      /deep/ .el-range-editor.el-input__inner {
        height: 36px;
      }
    }
    .second {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .box-wrap.buttons{
        /deep/ .button{
          margin-bottom: 0;
        }
      }
      .left-part-box {
        display: flex;
      }
    }
  }
}
</style>
