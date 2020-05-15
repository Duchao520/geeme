<template>
  <el-dialog
    title="修改卡项"
    :visible="dialogVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="1040px"
    :before-close="close"
    v-loading="loading"
  >
    <el-form
      ref="countCardForm"
      label-width="120px"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="卡项名称" style="margin: 0;">{{
        suberCardInfo.cardName
      }}</el-form-item>
      <el-form-item label="卡项类型" style="margin: 0;">次卡</el-form-item>
      <el-form-item label="售价" prop="chargeMoney" style="margin: 8px 0 18px 0;">
        <el-input
          v-model.number="form.chargeMoney"
          type="number"
          :step="0.01"
          maxlength="8"
          placeholder="请输入售价"
          style="width: 200px;"
        >
          <div slot="append">元</div>
        </el-input>
      </el-form-item>
      <el-form-item label="享受权益">
        <el-button
          plain
          class="plain_blue_btn"
          style="margin-top: 12px;"
          @click="showTimesCardService"
          >选择服务</el-button
        >

        <div
          class="service-choosed-box"
          v-if="form.listServiceCountInfo.length"
        >
          <el-table :data="form.listServiceCountInfo" stripe height="35vh">
            <el-table-column
              label="服务项目名称"
              show-overflow-tooltip
              prop="serviceName"
            ></el-table-column>
            <el-table-column
              label="规格"
              show-overflow-tooltip
              prop="serviceSpecificationName"
            ></el-table-column>
              <el-table-column label="门店价" show-overflow-tooltip prop="shopPrice">
                <template slot-scope="{ row }">
                  <p>{{ row.shopPrice ? `￥${row.shopPrice}` : '-'}}</p>
                </template>
              </el-table-column>
            <el-table-column label="次数" width="175">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'listServiceCountInfo.' + scope.$index + '.countLimit'"
                  :rules="{ validator: validateCountLimit, trigger: 'change' }"
                >
                  <el-input
                    :maxlength="4"
                    v-model.number="
                      form.listServiceCountInfo[scope.$index].countLimit
                    "
                    class="count-input"
                    size="small"
                    :disabled="form.countLimitStatus"
                  >
                    <template slot="append">次</template>
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="单次耗卡业绩"
              prop="servicePerformance"
              width="160"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="
                    'listServiceCountInfo.' +
                      scope.$index +
                      '.servicePerformance'
                  "
                  :rules="{
                    validator: validateServicePerformance,
                    trigger: 'change'
                  }"
                >
                  <el-input
                    :maxlength="4"
                    v-model.number="
                      form.listServiceCountInfo[scope.$index].servicePerformance
                    "
                    class="count-input"
                    size="small"
                  >
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="是否赠送">
              <template slot-scope="scope">
                <el-form-item>
                  <el-checkbox v-model="scope.row.isGift" @change="judgeGift">{{
                    scope.row.isGift ? "是" : "否"
                  }}</el-checkbox>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="48">
              <template slot-scope="scope">
                <i
                  class="icon iconfont icon-icon_operate_delete"
                  @click="delSelectedService(scope.$index)"
                ></i>
              </template>
            </el-table-column>
          </el-table>
          <div class="common-count">
            <div class="left-box-under-table">
              <div class="top-line">
                <el-checkbox
                  :disabled="hasGift"
                  v-model="form.countLimitStatus"
                  @change="handleTotalCountChanged"
                ></el-checkbox>
                共用次数:
              </div>
              <div class="bottom-line">
                勾选此项之后，以上项目将共用此次数，各项目单独设置的次数无效。
              </div>
            </div>
            <div class="right-box-under-table">
              <el-form-item
                prop="totalCountLimit"
                :rules="{
                  validator: validateTotalCountLimit,
                  trigger: 'change'
                }"
              >
                <el-input
                  v-model.number="form.totalCountLimit"
                  :maxlength="4"
                  size="small"
                  class="count-input"
                  :disabled="!form.countLimitStatus"
                >
                  <template slot="append">次</template>
                </el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <selectServiceForTimeCard
      :timesCardDialog="timesCardDialog"
      :superCheckedService="checkedServiceIds"
      :appendToBody="true"
      v-if="timesCardDialog"
      @close="timesCardDialog = false"
      @suberData="setServiceTable"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" class="plain_gray_btn">取 消</el-button>
      <el-button @click="handleConfirm" class="normal_blue_btn"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { reg } from "@/assets/js/RegExp";
import { mapActions, mapState } from "vuex";
import selectServiceForTimeCard from "@/pages/goodsManagement/component/selectServiceForTimesCard";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    suberCardInfo: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    index: Number
  },
  data() {
    let cardPriceValidator = (rule, value, callback) => {
      if (/^([0-9]\d{0,8}|[0-9]\d{0,8}(\.\d{0,2}))$/.test(value)) {
        callback();
      } else {
        callback("售价最多8位整数、2位小数");
      }
    };
    return {
      hasGift: false,
      form: {
        chargeMoney: null,
        /* 指定服务消费权益-时间卡&次卡 */
        listServiceCountInfo: [],
        totalCountLimit: null, // 次卡共用次数
        countLimitStatus: false, // 是否启用次卡共用次数, 该字段后端没有提供！！！！
        operateType: 0,
      },
      // 次卡&时间卡 权益服务
      checkedServiceIds: new Set(), // ===> 选中的服务权益
      checkedServiceObj: {}, // 键值对化选中的服务权益
      // - 次卡时间卡选择服务对话框
      timesCardDialog: false,
      rules: {
        chargeMoney: [{ required: true, validator: cardPriceValidator }]
      }
    };
  },
  created() {},
  methods: {
    ...mapActions(["deleteSelectedCards", "setSelectedCardsValue"]),
    // 判断是否赠送
    judgeGift() {
      this.hasGift = this.form.listServiceCountInfo.some(i => i.isGift);
      this.form.countLimitStatus = false;
      this.handleTotalCountChanged(false);
    },
    handleConfirm() {
      // 表单校验具体没执行的原因需要再查 样式问题已解决
      this.$refs.countCardForm.validate(valid => {
        if (valid) {
          if (!this.form.countLimitStatus) {
            this.form.totalCountLimit = null;
          }
          this.$emit("suberTableData", this.form);
        } else {
          return;
        }
      });
    },
    close() {
      this.$emit("close");
    },
    // 次卡时间卡服务选择
    showTimesCardService() {
      this.timesCardDialog = true;
    },
    // 门店次卡的权益服务列表
    setServiceTable(obj) {
      // console.log(obj)
      obj.yes.map(i => {
        if (!this.checkedServiceIds.has(i.specificationId)) {
          this.checkedServiceIds.add(i.specificationId);
          this.checkedServiceObj[i.specificationId] = {
            serviceId: i.serviceId, // 服务id & 名称
            serviceName: i.serviceName,
            serviceSpecificationId: i.specificationId, // 规格id & 名称
            serviceSpecificationName: i.specificationName,
            typeOneId: i.sortLevelOne, // 一级分类 id & 名称
            typeOneName: "",
            typeTwoId: i.sortLevelTwo, // 二级分类 id & 名称
            typeTwoName: "",
            countLimit: null, // 限制使用次数
            shopPrice: i.shopPrice
          };
        }
      });
      obj.no.map(i => {
        if (this.checkedServiceIds.has(i.specificationId)) {
          this.checkedServiceIds.delete(i.specificationId);
          delete this.checkedServiceObj[i.specificationId];
        }
      });
      this.form.listServiceCountInfo = Object.values(this.checkedServiceObj);
    },
    // 删除已选权益服务
    delSelectedService(idx) {
      if (this.form.listServiceCountInfo.length == 1) return this.$message.error('至少需要保留一项服务！')
      let id = this.form.listServiceCountInfo[idx].serviceSpecificationId;
      this.checkedServiceIds.delete(id);
      delete this.checkedServiceObj[id];
      // 再执行删除表格
      this.form.listServiceCountInfo.splice(idx, 1);
    },
    // 次卡相关 start
    // - 校验表格下方公共次数
    validateTotalCountLimit(rule, value, callback) {
      // 仅次卡
      if (this.form.countLimitStatus) {
        if (reg.time.test(this.form.totalCountLimit)) {
          callback();
        } else {
          return callback(new Error("请输入1~9999的数字"));
        }
      } else {
        callback()
      }
    },
    handleTotalCountChanged(val) {
      // console.log('')
      // console.log('8888')
      if (!val) {
        this.$refs.countCardForm.validateField("totalCountLimit");
      } else {
        this.form.listServiceCountInfo.map((v, i) => {
          this.$refs.countCardForm.validateField(
            "listServiceCountInfo." + i + ".countLimit"
          );
        });
      }
    },
    // - 校验表格行内次数
    validateCountLimit(rule, value, callback) {
      if (!this.form.countLimitStatus) {
        if (reg.time.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入1~9999的数字"));
        }
      } else {
        callback()
      }
    },
    // - 校验表格单次耗卡业绩
    validateServicePerformance(rule, value, callback) {
      if (!(/^(\d{1,8}(\.\d{0,2})?)$/.test(value))) {
        return callback("不小于0，且不大于8位数字");
      } else {
        callback();
      }
    }
    // 次卡相关 end
  },
  watch: {
    suberCardInfo: {
      handler: function(v, o) {
        // console.log('进入监听')
        let data = JSON.parse(JSON.stringify(v)); // - 避免修改props
        this.form.chargeMoney = data.chargeMoney;
        this.form.listServiceCountInfo = data.listServiceCountInfo;
        this.form.totalCountLimit = data.totalCountLimit;
        this.form.countLimitStatus = data.countLimitStatus;
        this.form.operateType = data.operateType;
        data.listServiceCountInfo.map(i => {
          this.checkedServiceObj[i.serviceSpecificationId] = i;
          this.checkedServiceIds.add(i.serviceSpecificationId);
        });
      },
      deep: true,
      immediate: true
    },
    form: {
      handler(v, o) {
        // 如果进行了相应传操作，则使开卡变为开自由卡
        this.form.operateType = 2
        
      },
      deep: true
    }
  },
  components: { selectServiceForTimeCard }
};
</script>
<style lang="scss" scoped>
// 次卡&时间卡
.service-choosed-box {
  width: 800px;
}
.time-card-limit-line {
  display: flex;
  height: 60px;
}
.common-count {
  display: flex;
  .left-box-under-table {
    flex: 1;
    display: flex;
    height: 60px;
    flex-direction: column;
    .top-line {
      font-size: 14px;
      color: #333;
      height: 20px;
      line-height: 20px;
      margin-top: 10px;
    }
    .bottom-line {
      font-size: 12px;
      color: #999;
      height: 18px;
      line-height: 18px;
      margin-bottom: 10px;
      text-indent: 18px;
    }
  }
  .right-box-under-table {
    width: 214px;
  }
}
.count-input {
  width: 120px;
}
@mixin font-style($lh, $fs, $col) {
  line-height: $lh;
  font-size: $fs;
  color: $col;
}

.custom-class {
  .title {
    @include font-style(56px, 18px, #333333);
  }
}

/deep/ .el-dialog__body {
  padding-top: 15px;
  padding-bottom: 15px;

  /deep/ .el-form-item {
    // margin-bottom: 12px;
    margin: 18px 0;

    /deep/ .el-form-item__error {
      z-index: 2;
      top: 100%;
    }

    /deep/ .el-input-group__append {
      background: #d5dadf;
      text-align: center;
      padding-left: 0;
      padding-right: 0;
      width: 40px;
      color: #fff;
      text-align: center;
    }

    .table-bottom {
      display: flex;
      align-items: center;

      .checkbox {
        flex: 0 0 440px;

        p {
          @include font-style(12px, 12px, #999999);
          text-indent: 25px;
          margin-top: -5px;
        }
      }

      .input {
        padding-left: 10px;
      }
    }
  }
}

/deep/ .el-table td {
  // padding: 0;
  padding: 8px 0 8px 0;
  /deep/ .cell {
    vertical-align: middle;
  }
}
</style>
