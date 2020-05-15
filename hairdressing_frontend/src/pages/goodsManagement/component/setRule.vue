<template>
  <!-- 有问题 visible.sync 会导致 prop值 setRuleModelVisible被改变-->
  <el-dialog
    :title="showTitle"
    :visible="setRuleModelVisible"
    @close="hideThisDialog"
    @open="prepareData"
    width="800px"
  >
    <div class="rule-content">
      <el-form>
        <el-form-item label="续卡充值">
          <el-radio-group v-model="form.supportRenewal" class="rule-judage">
            <el-radio :label=false>
              <span>不支持</span>
            </el-radio>
            <el-radio :label=true>
              <span>支持</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <!-- 身份卡规则 -->
      <div v-if="currentCardInfo.cardType == 0">
        <el-form
          class="rule-line"
          :model="cardRuleItem"
          v-for="(cardRuleItem, index) in form.listCardRenewalRule"
          :key="cardRuleItem.ruleKey"
          :rules="idCardRule"
          ref="idCardForm"
        >
          <!-- 续卡时长 -->
          <el-form-item label="续卡时长" prop="validNum">
            <div class="rule-time-line">
              <el-input placeholder="数字" v-model.number="cardRuleItem.validNum" class="rule-item-input" maxlength="12"></el-input>
              <el-dropdown trigger="click" @command="handleTimeUnitSelect">
                <el-button class="right-drowndown-btn">
                  {{formatValidNum(cardRuleItem.validUnit)}}
                  <i
                    class="icon iconfont icon-icon_back arrow-down"
                  ></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="(cardRuleItem.ruleKey + '&year')">年</el-dropdown-item>
                  <el-dropdown-item :command="(cardRuleItem.ruleKey + '&month')">月</el-dropdown-item>
                  <el-dropdown-item :command="(cardRuleItem.ruleKey + '&day')">日</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-form-item>
          <!-- 续卡费用 -->
          <el-form-item label="费用" prop="cardPrice">
            <el-input placeholder="金额" v-model.number="cardRuleItem.cardPrice" class="rule-item-input" maxlength="12">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <!-- 删除该规则 -->
          <i
            v-if="index"
            class="icon iconfont icon-icon_operate_delete"
            @click="deleteRule(cardRuleItem.ruleKey)"
          ></i>
        </el-form>
      </div>

      <!-- 储值卡规则 -->
      <div v-if="currentCardInfo.cardType == 1">
        <el-form
          class="rule-line"
          :model="cardRuleItem"
          v-for="(cardRuleItem, index) in form.listCardRenewalRule"
          :key="cardRuleItem.ruleKey"
          :rules="valueCardRule"
          ref="valueCardForm"
        >
          <!-- 充值金额 -->
          <el-form-item label="充值" prop="cardRechargeNum">
            <el-input
              placeholder="金额"
              v-model.number="cardRuleItem.cardRechargeNum"
              class="rule-item-input"
              maxlength="12"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <!-- 赠送金额 -->
          <el-form-item label="赠送" prop="cardGiftNum">
            <el-input placeholder="金额" v-model.number="cardRuleItem.cardGiftNum" class="rule-item-input" maxlength="12">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <!-- 期限延长 -->
          <el-form-item label="期限延长" prop="validNum">
            <div class="rule-time-line">
              <el-input placeholder="数字" v-model.number="cardRuleItem.validNum" class="rule-item-input" maxlength="12"></el-input>
              <el-dropdown trigger="click" @command="handleTimeUnitSelect">
                <el-button class="right-drowndown-btn">
                  {{formatValidNum(cardRuleItem.validUnit)}}
                  <i
                    class="icon iconfont icon-icon_back arrow-down"
                  ></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="(cardRuleItem.ruleKey + '&year')">年</el-dropdown-item>
                  <el-dropdown-item :command="(cardRuleItem.ruleKey + '&month')">月</el-dropdown-item>
                  <el-dropdown-item :command="(cardRuleItem.ruleKey + '&day')">日</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-form-item>
          <!-- 删除该规则 -->
          <i
            v-if="index"
            class="icon iconfont icon-icon_operate_delete"
            @click="deleteRule(cardRuleItem.ruleKey)"
          ></i>
        </el-form>
      </div>

      <!-- 添加规则 -->
      <div class="add-btn" @click="addRule">
        <i class="icon iconfont icon-icon_ope_append"></i>
        新增
      </div>
    </div>
    <div slot="footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as rgxp from "@/util/regExp";
import * as axios from "@/util/axios";
import * as api from "@/assets/js/interface";
export default {
  props: {
    setRuleModelVisible: Boolean,
    currentRuleList: Array,
    currentCardInfo: Object
  },
  data() {
    return {
      /* 多了一个ruleKey作为标识 */
      form: {
        brandId: null,
        cardKindId: null,
        cardType: null,
        supportRenewal: true,
        listCardRenewalRule: []
      },
      idCardRule: {
        validNum: [{ validator: this.validateNum, trigger: "submit" }],
        cardPrice: [{ validator: this.validatePrice, trigger: "submit" }]
      },
      valueCardRule: {
        cardRechargeNum: [{ validator: this.validatePrice, trigger: "submit" }], 
        cardGiftNum: [{ validator: this.validateNaturalPrice, trigger: "submit" }],
        validNum: [{ validator: this.validateNum, trigger: "submit" }],  
      }
    };
  },
  computed: {
    showTitle() {
      return `续卡规则-${this.currentCardInfo.cardTypeName}`;
    }
  },
  methods: {
    validateNum(rule, value, callback) {
      if (value.length === 0) {
        return callback(new Error("请输入时长"));
      } else if (!rgxp.positiveInt.test(value)) {
        return callback(new Error("请输入正整数"));
      } else {
        callback();
      }
    },
    validatePrice(rule, value, callback) {
      if (value.length === 0) {
        return callback(new Error("金额不能为空"));
      } else if (!rgxp.positiveInt.test(value)) {
        return callback(new Error("请输入正整数"));
      } else {
        callback();
      }
    },
    validateNaturalPrice(rule, value, callback) {
      if (value.length === 0) {
        return callback(new Error("金额不能为空"));
      } else if (!rgxp.naturalNumber.test(value)) {
        return callback(new Error("请输入自然数"));
      } else {
        callback();
      }
    },
    prepareData() {
      let {
        brandId,
        cardKindId,
        cardType,
        supportRenewal
      } = this.currentCardInfo;
      let protoRuleList =
        JSON.parse(JSON.stringify(this.currentRuleList)) || [];
      protoRuleList.map(i => (i.ruleKey = Math.random().toString()));
      this.form = {
        brandId: brandId,
        cardKindId: cardKindId,
        cardType: cardType,
        supportRenewal: supportRenewal,
        listCardRenewalRule: protoRuleList
      };
    },
    /* format 有效期限 */
    formatValidNum(unit) {
      switch (unit) {
        case "year":
          return `年`;
        case "month":
          return `月`;
        case "day":
          return `日`;
      }
    },
    handleTimeUnitSelect(data) {
      let key = data.split("&")[0];
      let unit = data.split("&")[1];
      this.form.listCardRenewalRule.forEach(i => {
        if (i.ruleKey == key) {
          i.validUnit = unit;
          return;
        }
      });
    },
    addRule() {
      let rule = {
        id: "",
        validNum: "",
        validUnit: "year",
        cardPrice: "",
        cardGiftNum: "",
        cardRechargeNum: "",
        ruleKey: Math.random().toString()
      };
      this.form.listCardRenewalRule.push(rule);
    },
    deleteRule(key) {
      this.form.listCardRenewalRule = this.form.listCardRenewalRule.filter(
        i => i.ruleKey != key
      );
    },
    confirm() {
      let formType;
      switch(this.currentCardInfo.cardType) {
        case 0: 
          formType = 'idCardForm'
          break
        case 1:
          formType = 'valueCardForm'
          break
      }
      let params = {}
      if (this.form.supportRenewal) {
        let success = true
        for (let i of this.$refs[formType]) {
          i.validate(valid => {
            if (!valid) {
              success = false
            }
          });
        }
        if (!success) { return }
        params = this.form
      } else {
        params = {
          brandId: this.form.brandId,
          cardKindId: this.form.cardKindId,
          cardType: this.form.cardType,
          supportRenewal: this.form.supportRenewal,
          // listCardRenewalRule: [], // 如果是不支持续卡，写了多少条数据都白搭， 后端都没接收
        }
      }
      axios.post(api.setCardRenewalRules.URL, params).then(res => {
        if (res.success) {
          this.$message({type:'success', message: res.message})
          this.$emit('done')
        }
      })
    },
    hideThisDialog() {
      this.$emit("close");
    }
  },
  watch: {
    'form.supportRenewal'(v, o) {
      if (v && this.form.listCardRenewalRule.length === 0) {
        this.addRule()
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.rule-content {
  padding: 0 0 0 36px;
  .rule-judage {
    display: flex;
    flex-direction: column;
    label {
      margin: 0 0 30px 0;
      padding: 13px 0 0 12px;
    }
  }
  .rule-line {
    display: flex;
    align-items: center;
    margin: -23px 0 50px 90px;
    i {
      cursor: pointer;
      color: #bec3c6;
    }
    .el-form-item {
      display: flex;
      margin: 0 30px 0 0;
      .rule-item-input {
        /deep/ .el-input__inner {
          width: 70px;
          height: 40px;
          border-radius: 4px 0 0 4px;
        }
        /deep/ .el-input-group__append {
          width: 40px;
          padding: 0;
          text-align: center;
          color: white;
          background: #d5dadf;
        }
        /* /deep/ .el-form-item__content {
          white-space: nowrap;
          display: flex;
          align-items: center;
        } */
      }
    }
    .rule-time-line {
      display: flex;
      align-items: center;
      .right-drowndown-btn {
        padding-right: 9px;
        padding-left: 9px;
        height: 40px;
        margin: 0;
        z-index: 90;
        background: #d5dadf;
        color: #ffffff;
        border-radius: 0 4px 4px 0;
        i.arrow-down {
          display: inline-block;
          transform: rotate(270deg);
          font-size: 13px;
          color: #ffffff;
        }
      }
    }
  }
  .add-btn {
    color: #58c9f3;
    font-size: 14px;
    cursor: pointer;
    margin: 0 0 0 90px;
    width: 60px;
  }
}
</style>