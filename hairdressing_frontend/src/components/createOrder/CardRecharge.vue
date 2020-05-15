<template>
  <el-dialog
    title
    :visible="cardRechargeVisible"
    width="880px"
    @close="$emit('close')"
    :append-to-body="true"
  >
    <p class="title" slot="title">续卡升级</p>
    <div class="recharge-content">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="卡项名称">
          <span class="text">{{cardToSelecteInfo.cardName}}</span>
        </el-form-item>
        <el-form-item label="卡项类型">
          <span class="text">{{cardType(cardToSelecteInfo.cardType)}}</span>
        </el-form-item>
        <el-form-item label="当前余额" v-if="cardToSelecteInfo.cardType===1">
          <span class="text">
            ￥{{cardToSelecteInfo.remainingSum}}
            <span
              style="color:#999999"
            >（含赠送金￥{{cardToSelecteInfo.giftMoney}}）</span>
          </span>
        </el-form-item>
        <el-form-item label="当前有效期" v-if="cardToSelecteInfo.cardType===0">
          <span class="text">{{formatDate(cardToSelecteInfo )}}</span>
        </el-form-item>
        <el-form-item
          :label="cardToSelecteInfo.cardType===0?'续卡时长':'充值金额'"
          style="margin-bottom:20px;"
          prop="renewalType"
          :rules="{required: true, validator: validateRenewalType, trigger: 'blur'}"
        >
          <!-- v1 -->
          <!-- <el-select
            v-model="selectValue"
            placeholder
            @change="selectRule"
            v-if="listCardRenewalRules"
          >
            <el-option
              v-for="(item,index) in listCardRenewalRules"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span v-else>未设置</span>-->

          <!-- v2 -->
          <!-- 储值卡 -->
          <el-radio-group
            v-model="form.renewalType"
            class="renewal-type-radio-group"
            v-if="cardToSelecteInfo.cardType===1"
          >
            <!-- 定额充值 -->
            <el-row class="renewal-type-radio">
              <el-col :span="3">
                <el-radio :label="0">定额充值</el-radio>
              </el-col>
              <el-col :span="4" style="margin-left: 2px;">
                <el-select v-model="selectValue" placeholder="选择档次" @change="selectRule">
                  <el-option
                    v-for="(item,index) in listCardRenewalRules"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>

              <el-col :span="5" style="margin-left:16px;">
                <el-input v-model="selectedRule.labelAbout" disabled>
                  <span slot="prepend">赠送</span>
                  <template slot="append">元</template>
                </el-input>
              </el-col>

              <el-col :span="7" style="margin-left:16px;" class="valid-num-col">
                <div v-if="cardToSelecteInfo.validPermanent" style="font-size:12px;">永久有效</div>
                <div v-else>
                  <el-input v-model="selectedRule.validNum" disabled>
                    <span slot="prepend">延长期限</span>
                    <span slot="append">{{selectedRule.validUnit|validUnitFilter}}</span>
                  </el-input>
                </div>
              </el-col>
            </el-row>
            <!-- 自由充值 -->
            <el-row class="renewal-type-radio">
              <el-col :span="3">
                <el-radio :label="1">自由充值</el-radio>
              </el-col>
              <el-col :span="4" style="margin-left: 2px;">
                <el-input v-model.number="form.freeRechargeValue" :maxlength="8">
                  <template slot="append">元</template>
                </el-input>
              </el-col>

              <el-col :span="5" style="margin-left:16px;">
                <el-input v-model.number="form.freeGiftValue" :maxlength="8">
                  <span slot="prepend">赠送</span>
                  <template slot="append">元</template>
                </el-input>
              </el-col>

              <el-col :span="7" style="margin-left:16px;" class="valid-num-col">
                <div v-if="cardToSelecteInfo.validPermanent" style="font-size:12px;">永久有效</div>
                <div v-else>
                  <el-input v-model.number="form.validNum" :maxlength="4">
                    <span slot="prepend">延长期限</span>
                  </el-input>
                  <el-dropdown trigger="click" @command="handleTimeUnitSelect">
                    <el-button class="right-drowndown-btn">
                      {{form.validUnit|validUnitFilter}}
                      <i
                        class="icon iconfont icon-icon_back arrow-down"
                      ></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="year">年</el-dropdown-item>
                      <el-dropdown-item command="month">月</el-dropdown-item>
                      <el-dropdown-item command="day">日</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </el-col>
            </el-row>
          </el-radio-group>

          <!-- 身份卡 -->
          <el-radio-group
            v-model="form.renewalType"
            class="renewal-type-radio-group"
            v-if="cardToSelecteInfo.cardType===0"
          >
            <!-- 固定续期 -->
            <el-row class="renewal-type-radio">
              <el-col :span="3">
                <el-radio :label="0">固定续期</el-radio>
              </el-col>
              <el-col :span="4" style="margin-left: 2px;">
                <el-select v-model="selectValue" placeholder="选择档次" @change="selectRule">
                  <el-option
                    v-for="(item,index) in listCardRenewalRules"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>

              <el-col :span="5" style="margin-left:16px;">
                <el-input v-model="selectedRule.labelAbout" disabled>
                  <span slot="prepend">费用</span>
                  <template slot="append">元</template>
                </el-input>
              </el-col>
            </el-row>
            <!-- 自由续期 -->
            <el-row class="renewal-type-radio">
              <el-col :span="3">
                <el-radio :label="1">自由续期</el-radio>
              </el-col>

              <el-col :span="4" class="valid-num-col">
                <div>
                  <el-input v-model.number="form.validNum" :maxlength="4"></el-input>
                  <el-dropdown trigger="click" @command="handleTimeUnitSelect">
                    <el-button class="right-drowndown-btn">
                      {{form.validUnit|validUnitFilter}}
                      <i
                        class="icon iconfont icon-icon_back arrow-down"
                      ></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="year">年</el-dropdown-item>
                      <el-dropdown-item command="month">月</el-dropdown-item>
                      <el-dropdown-item command="day">日</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </el-col>

              <el-col :span="5" style="margin-left:16px;">
                <el-input v-model.number="form.freeIdentityCardCost" :maxlength="8">
                  <span slot="prepend">费用</span>
                  <template slot="append">元</template>
                </el-input>
              </el-col>
            </el-row>
          </el-radio-group>

          <!-- 通用 -->
          <el-row class="renewal-checkbox">
            <el-col :span="4">
              <el-checkbox v-model="form.isUpgrade">升级为会员卡:</el-checkbox>
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="form.upgradeCardKindId"
                placeholder="升级目标"
                @change="handleUpgradeCardKindChanged"
              >
                <el-option
                  v-for="item in CardRenewalRuleInfo.listUpgradeCardInfo"
                  :key="item.upgradeCardKindId"
                  :label="item.upgradeCardKindName"
                  :value="item.upgradeCardKindId"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
          <!-- 通用 -->
          <el-row>
            <span class="gray-text" v-if="cardToSelecteInfo.cardType===1">升级后，原卡的储值金及赠送金将转移至新的卡中。</span>
            <span class="gray-text" v-else>升级后，原卡将自动失效。</span>
          </el-row>
        </el-form-item>
      </el-form>
      <!-- <transition name="el-zoom-in-top">
        <div
          class="send-info"
          v-if="selectedRule.labelAbout&&this.cardToSelecteInfo.cardType === 1"
        >
          <p>赠送金：￥{{selectedRule.labelAbout}}</p>
          <p v-if="!cardToSelecteInfo.validPermanent">充值后有效期：{{timeAfterFormatDate()}}</p>
          <p v-if="cardToSelecteInfo.validPermanent">永久有效</p>
        </div>
        <div
          class="send-info"
          v-if="selectedRule.labelAbout&&this.cardToSelecteInfo.cardType === 0"
        >
          <p>费用：￥{{selectedRule.labelAbout}}</p>
          <p v-if="!cardToSelecteInfo.validPermanent">续卡后有效期：{{timeAfterFormatDate()}}</p>
          <p v-if="cardToSelecteInfo.validPermanent">永久有效</p>
        </div>
      </transition>-->
    </div>
    <div slot="footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" style="background:#58C9F3;borderColor:#58C9F3" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
//  cardType: 0身份卡 1储值卡 2次卡 3时间卡
export default {
  props: {
    cardRechargeVisible: Boolean,
    cardToSelecteInfo: Object,
    CardRenewalRuleInfo: Object
  },
  data() {
    return {
      form: {
        //  - 此处记录的数据主要是自由续费的数据， 原先的定额数据在计算属性 selectedRule 中
        renewalType: 0, // 续卡方式: 0-固定, 1-自由 (通用)
        freeRechargeValue: null, // - 自由充值（储值卡） 充值金金额
        freeGiftValue: null, // - 自由充值（储值卡） 赠送金金额
        validNum: null, // - 自由充值（通用） 延长期限(非永久有效时)
        validUnit: "year", // - 自由充值（通用） 延长期限单位(非永久有效时)
        freeIdentityCardCost: null, // 自由充值（身份卡） 续卡费用
        isUpgrade: false, // - 是否升级会员卡 (通用)
        upgradeCardKindId: null, // - 升级的目标会员卡 id(通用)
        upgradeCardKindName: null // - 升级的目标会员卡 name(通用)
      },
      selectValue: null, // - 定额续费的选择值 - 用于计算响应的续期时间、赠送金等
      giftMoney: null
    };
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo
    }),
    listCardRenewalRules() {
      let list = this.CardRenewalRuleInfo.listCardRenewalRule;
      if (!list) {
        return false;
      }
      if (this.cardToSelecteInfo.cardType === 0) {
        return list.map(item => {
          return {
            value: item.cardPrice,
            labelAbout: item.cardPrice,
            label: item.validNum + this.timeTransform(item.validUnit),
            extendTime: item.validNum + this.timeTransform(item.validUnit),
            ...item
          };
        });
      } else if (this.cardToSelecteInfo.cardType === 1) {
        return list.map(item => {
          return {
            value: item.cardRechargeNum,
            label: item.cardRechargeNum,
            labelAbout: item.cardGiftNum,
            extendTime: item.validNum + this.timeTransform(item.validUnit),
            ...item
          };
        });
      }
    },
    selectedRule() {
      let list = this.listCardRenewalRules;
      if (!list) {
        return {};
      }
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (this.selectValue === item.value) {
          return item;
        }
      }
      return {};
    },
  },
  methods: {
    selectRule(data) {
      // console.log(data);
    },
    /* 选择有效期限单位 */
    handleTimeUnitSelect(command) {
      this.form.validUnit = command;
    },
    timeTransform(name) {
      switch (name) {
        case "year":
          return "年";
        case "month":
          return "个月";
        case "day":
          return "天";
      }
    },
    confirm() {
      let cardToSelecteInfo = JSON.parse(
        JSON.stringify(this.cardToSelecteInfo)
      );
      // console.log(this.cardToSelecteInfo)
      // return
      /**
       * 储值卡有：充值金(chargeMoney)/赠送金(giftMoney)/期限延长(extendTime)
       * 身份卡有：续卡时长(extendTime)/续卡费用(chargeMoney)
       *  */
      if (this.cardToSelecteInfo.cardType === 1) {
        cardToSelecteInfo.giftMoneyByChargeMoney = this.selectedRule.labelAbout;
      }
      cardToSelecteInfo.chargeMoney = this.selectedRule.value;
      cardToSelecteInfo = { ...cardToSelecteInfo, ...this.selectedRule };
      var cardInfo = this.cardInfoConvert(cardToSelecteInfo);

      // - v2 固定续期及自由续期  start -
      cardInfo.renewalType = this.form.renewalType; // - 续卡类型
      cardInfo.isUpgrade = this.form.isUpgrade; // - 是否升级
      cardInfo.upgradeCardKindId = this.form.upgradeCardKindId; // - 升级目标卡
      cardInfo.upgradeCardKindName = this.form.upgradeCardKindName; // - 升级目标卡
      // - 重写自由续期的部分值: 充值金、赠送金、延期时长 （储值卡、身份卡）
      if (this.form.renewalType === 1) {
        cardInfo.validNum = this.form.validNum || 0;
        cardInfo.validUnit = this.form.validUnit;
        cardInfo.giftMoney = this.form.freeGiftValue || 0;
        cardInfo.chargeMoney =
          this.cardToSelecteInfo.cardType === 1
            ? this.form.freeRechargeValue || 0
            : this.form.freeIdentityCardCost || 0;
        cardInfo.extendTime =
          cardInfo.validNum + this.timeTransform(cardInfo.validUnit);
      }
      // = v2 固定续期及自由续期  end =
      // console.log(cardInfo);
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit("select-card-renewal-rule", cardInfo);
          // this.selectValue = null;
        }
      });
    },
    cardInfoConvert(data) {
      return {
        cardKindId: data.cardKindId,
        paymentStatus: false,
        cardKindSnapshotId: data.cardKindSnapshotId,
        cardSellerList: [],
        chargeMoney: data.value,
        giftMoney: data.cardGiftNum,
        operateType: 1,
        remarks: null,
        validNum: data.validPermanent ? -1 : data.validNum,
        validUnit: data.validUnit,
        cardType: data.cardType,
        cardName: data.cardName,
        cardCover: data.cardCover,
        deleted: false,
        validPermanent: data.validPermanent,
        extendTime: data.extendTime,
        customerCardId: data.customerCardId,
        storeRemarkCardNo: data.storeRemarkCardNo || "",
        // 门店优惠
        storePreference: 0,
        storeId: this.currentInfo.shopId,
          tempFinalPrice: data.chargeMoney, // 临时最终价
        customerId: this.billInfo.customerInfo.id
      };
    },
    cardType(cardType) {
      switch (cardType) {
        case 0:
          return "身份卡";
          break;
        case 1:
          return "储值卡";
          break;
        case 2:
          return "次卡";
          break;
        case 3:
          return "时间卡";
          break;
      }
    },
    formatDate(cardToSelecteInfo) {
      return this.tranxferTime(cardToSelecteInfo.finishTime);
    },
    tranxferTime(date) {
      var date = date;
      if (typeof date === "number") {
        date = new Date(date);
      }
      var time = utils.formatDate(date);
      time = time.replace(/(\d{4})-(\d{2})-(\d{2})/g, "$1年$2月$3日");
      return time;
    },
    timeAfterFormatDate() {
      var cardInfo = this.cardToSelecteInfo;
      var time = new Date(cardInfo.finishTime);
      switch (this.selectedRule.validUnit) {
        case "year":
          time.setFullYear(time.getFullYear() + this.selectedRule.validNum);
          break;
        case "month":
          time.setMonth(time.getMonth() + this.selectedRule.validNum);
          break;
        case "day":
          time.setDate(time.getDate() + this.selectedRule.validNum);
          break;
      }
      return this.tranxferTime(time);
    },

    // - 校验续卡类型、自由续卡储值、赠送金 -
    validateRenewalType(rule, value, callback) {
      // callback()
      if (value === 0) {
        // - 定额续卡 -
        if (!this.selectValue) {
          callback("请选择一个固定续费档次");
        } // 定额充值
      } else {
        // - 自由续卡 -
        if (this.cardToSelecteInfo.cardType) {
          // 1: 储值卡
          if (this.form.isUpgrade) {
            // - 可能是仅升级卡： 充值金可以为0
            if (this.form.freeRechargeValue < 0) {
              callback("充值金必须大于0");
            }
          } else {
            // - 不升级卡一定是续卡： 充值金不可以为0
            if (this.form.freeRechargeValue <= 0) {
              callback("充值金不能小于0");
            }
          }
          if (this.form.freeGiftValue < 0) {
            callback("赠送金不能小于0");
          }
          if (this.form.validNum < 0) {
            callback("延长期限不能小于0");
          }
        } else {
          // 0: 身份卡
          if (this.form.isUpgrade) {
            // - 可能是仅升级卡： 续卡时长可以为0
            if (this.form.validNum < 0) {
              callback("续期时间必须大于0");
            }
          } else {
            // - 不升级卡一定是续卡： 续卡时长不可以为0
            if (this.form.validNum <= 0) {
              callback("续期时间不能小于0");
            }
          }
          if (this.form.freeIdentityCardCost < 0) {
            callback("续卡费用不能小于0");
          }
        }
      }
      // - 升级会员卡
      if (this.form.isUpgrade) {
        if (this.form.upgradeCardKindId) {
          callback();
        } else {
          callback("请选择要升级的卡");
        }
      } else {
        callback();
      }
    },
    // = 校验续卡类型、自由续卡储值、赠送金 =

    // - 处理升级卡的卡名
    handleUpgradeCardKindChanged(id) {
      (this.CardRenewalRuleInfo.listUpgradeCardInfo || []).map(i => {
        if (id === i.upgradeCardKindId) {
          this.form.upgradeCardKindName = i.upgradeCardKindName;
        }
      });
    }
  },
  filters: {
    validUnitFilter(unit) {
      let map = {
        year: "年",
        month: "月",
        day: "日"
      };
      return map[unit] || "年";
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog {
  color: #333333;
  .el-dialog__header {
    padding: 0;
    .title {
      line-height: 60px;
      font-size: 18px;
      text-indent: 28px;
      font-weight: 600;
    }
  }

  .el-dialog__body {
    padding: 0;
    .recharge-content {
      border-top: 1px solid #f0f1f4;
      .el-form-item {
        margin: 0;
        /deep/ .el-form-item__label {
          color: #999999;
        }
        .text {
          color: #333333;
        }
      }
      .send-info {
        border-top: 1px dashed #efeff4;
        margin-left: 60px;
        width: 310px;
        font-size: 12px;
        color: #999999;
        padding-top: 5px;
        line-height: 23px;
      }
    }
  }
}
.renewal-type-radio-group {
  width: 98%;
}
.renewal-type-radio,
.renewal-checkbox {
  height: 40px;
  display: flex;
  margin-bottom: 12px;
  justify-content: flex-start;
  align-items: center;
  /deep/ .el-input-group__prepend {
    padding: 0 6px;
  }
  /deep/ .el-input-group__append {
    padding: 0 6px;
  }
}
.renewal-checkbox {
  margin-bottom: 4px;
}
.valid-num-col > div {
  display: flex;
  flex-wrap: nowrap;
}
/* 后期新增 届时再改 */
i.arrow-down {
  display: inline-block;
  transform: rotate(270deg);
  font-size: 13px;
}

.right-drowndown-btn {
  padding-right: 9px;
  padding-left: 9px;
  margin: 0 0 0 -4px;
  background: #d5dadf;
  color: #ffffff;
  border-radius: 0 4px 4px 0;
}
.gray-text {
  font-size: 12px;
  color: #999;
}
</style>
