<template>
  <div class="member-grow">
    <el-table
      :data="formFields"
      border
      stripe
      :span-method="objectSpanMethod"
    >
      <el-table-column
        prop="behavior"
        label="成长行为"
        width="120px"
      >
      </el-table-column>
      <el-table-column
        prop="additionalConditions"
        label="附件条件"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="获得成长值"
      >
        <template slot-scope="scope">
          <el-form :ref="scope.row.growValueKey" :model="scope.row">
            <el-form-item prop="growValue" :rules="{validator:numberValidator}">
              <el-input type="number" v-model.number="scope.row.growValue" placeholder="限填数字"></el-input>
              <span>成长值/{{scope.row.quantifier==="yuan"?"元":(scope.row.quantifier==="times"?"次":"")}}</span>
              <span v-if="scope.row.quantifier==='times/store'">店/次</span>
            </el-form-item>
          </el-form>
        </template>

      </el-table-column>
      <el-table-column
        prop="address"
        label="每日上限"
      >
        <template slot-scope="scope">
          <el-form :ref="scope.row.limitTopValueKey" :model="scope.row" class="limit-val">
            <el-radio-group v-model="scope.row.limitType">
              <el-radio label="UN_LIMIT">
                无上限
              </el-radio>
              <el-radio label="LIMIT">
                <el-form-item prop="limitTopValue" :rules="{validator:numberValidator,growValue:scope.row.growValue,required:scope.row.limitType==='LIMIT'}">
                  <el-input type="number" :disabled="scope.row.limitType==='UN_LIMIT'"
                            v-model.number="scope.row.limitTopValue" placeholder="限填数字"></el-input>
                  <span>成长值/天</span>
                </el-form-item>
              </el-radio>
            </el-radio-group>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <div class="buttons">
      <el-button class="normal_blue_btn" @click="submit">保存修改</el-button>
      <el-button class="normal_gray_btn">恢复为默认值</el-button>
    </div>
  </div>
</template>
<script>
  import * as axios from "@/util/axios";
  import {mapState} from "vuex";

  export default {
    data() {
      let numberValidator = (rule, value, callback) => {
        if(!rule.required){
          callback();
        }else if (value >= 0 && (Math.floor(value) === value) ) {
          if(value === null){
            callback();
          }else if(value<rule.growValue){
            callback("每日上限不可小于每次获得的成长值");
          }
        } else {
          callback("请输入正整数");
        }
      };
      return {
        formFields: [
          {
            quantifier: "times/store",
            behavior: "访问门店",
            additionalConditions: "无",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "accessStoreExp",
            limitTypeKey: "asExpLimitType",
            limitTopValueKey: "asExpLimitVal"
          },
          {
            quantifier: "yuan",
            behavior: "购买服务",
            additionalConditions: "储值卡支付",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "servicePayCardExp",
            limitTypeKey: "spdExpLimitType",
            limitTopValueKey: "spdExpLimitVal"
          },
          {
            quantifier: "yuan",
            behavior: "购买服务",
            additionalConditions: "现金类支付",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "servicePayCashExp",
            limitTypeKey: "sphExpLimitType",
            limitTopValueKey: "sphExpLimitVal"
          },
          {
            quantifier: "yuan",
            behavior: "购买产品",
            additionalConditions: "储值卡支付",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "productPayCardExp",
            limitTypeKey: "pcdExpLimitType",
            limitTopValueKey: "pcdExpLimitVal"
          },
          {
            quantifier: "yuan",
            behavior: "购买产品",
            additionalConditions: "现金类支付",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "productPayCashExp",
            limitTypeKey: "pchExpLimitType",
            limitTopValueKey: "pchExpLimitVal"
          },
          /*{
                    "behavior": "购买卡项",
                    "additionalConditions": "储值卡支付",
                    "growValue": null,
                    "limitType": "UN_LIMIT",
                    "limitTopValue": null,
                    "growValueKey": "cardPayCardExp",
                    "limitTypeKey": "cpdExpLimitType",
                    "limitTopValueKey": "cpdExpLimitVal"
                  },*/
          {
            quantifier: "yuan",
            behavior: "购买卡项",
            additionalConditions: "现金类支付",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "cardPayCashExp",
            limitTypeKey: "cphExpLimitType",
            limitTopValueKey: "cphExpLimitVal"
          },
          {
            quantifier: "yuan",
            behavior: "续卡充值",
            additionalConditions: "无",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "cardRenewalCashExp",
            limitTypeKey: "crcExpLimitType",
            limitTopValueKey: "crcExpLimitVal"
          },
          {
            quantifier: "yuan",
            behavior: "充值钱包",
            additionalConditions: "无",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "rechargeEWalletCashExp",
            limitTypeKey: "rewExpLimitType",
            limitTopValueKey: "rewExpLimitVal"
          },
          {
            quantifier: "times",
            behavior: "主动收货",
            additionalConditions: "无",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "confirmReceiptExp",
            limitTypeKey: "crExpLimitType",
            limitTopValueKey: "crExpLimitVal"
          },
          {
            quantifier: "times",
            behavior: "预约且开单",
            additionalConditions: "无",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "appointmentBillExp",
            limitTypeKey: "abExpLimitType",
            limitTopValueKey: "abExpLimitVal"
          },
          {
            quantifier: "times",
            behavior: "同意公开档案",
            additionalConditions: "无",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "archivePublicExp",
            limitTypeKey: "apExpLimitType",
            limitTopValueKey: "apExpLimitVal"
          },
          {
            quantifier: "times",
            behavior: "完善个人资料",
            additionalConditions: "无",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "perfectDataExp",
            limitTypeKey: "pdExpLimitType",
            limitTopValueKey: "pdExpLimitVal"
          },
          {
            quantifier: "times",
            behavior: "完成订单评价",
            additionalConditions: "评价超过20个字符",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "assessmentOverExp",
            limitTypeKey: "aoExpLimitType",
            limitTopValueKey: "aoExpLimitVal"
          },
          {
            quantifier: "times",
            behavior: "完成订单评价",
            additionalConditions: "评价不超过20个字符",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "assessmentUnderExp",
            limitTypeKey: "auExpLimitType",
            limitTopValueKey: "auExpLimitVal"
          },
          /*{
                    "behavior": "微信分享产品",
                    "additionalConditions": "无",
                    "growValue": null,
                    "limitType": "UN_LIMIT",
                    "limitTopValue": null,
                    "growValueKey": "weChatShareProductExp",
                    "limitTypeKey": "wspExpLimitType",
                    "limitTopValueKey": "wspExpLimitVal"
                  },
                  {
                    "behavior": "微信分享服务",
                    "additionalConditions": "无",
                    "growValue": null,
                    "limitType": "UN_LIMIT",
                    "limitTopValue": null,
                    "growValueKey": "weChatShareServiceExp",
                    "limitTypeKey": "wssExpLimitType",
                    "limitTopValueKey": "wssExpLimitVal"
                  },
                  {
                    "behavior": "微信分享动态",
                    "additionalConditions": "无",
                    "growValue": null,
                    "limitType": "UN_LIMIT",
                    "limitTopValue": null,
                    "growValueKey": "weChatShareDynamicExp",
                    "limitTypeKey": "wsdExpLimitType",
                    "limitTopValueKey": "wsdExpLimitVal"
                  },*/
          {
            quantifier: "times",
            behavior: "收藏动态",
            additionalConditions: "无",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "collectDynamicExp",
            limitTypeKey: "cdExpLimitType",
            limitTopValueKey: "cdExpLimitVal"
          },
          {
            quantifier: "times",
            behavior: "评论动态",
            additionalConditions: "无",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "assessmentDynamicExp",
            limitTypeKey: "adExpLimitType",
            limitTopValueKey: "adExpLimitVal"
          },
          {
            quantifier: "times",
            behavior: "点赞动态",
            additionalConditions: "无",
            growValue: null,
            limitType: "UN_LIMIT",
            limitTopValue: null,
            growValueKey: "thumbsUpDynamicExp",
            limitTypeKey: "tudExpLimitType",
            limitTopValueKey: "tudExpLimitVal"
          }
        ],
        numberValidator,
        id: null
      }
    },
    computed: {
      ...mapState({
        currentInfo: state => state.manage.currentInfo,
      }),
    },
    mounted() {
      this.getBrandMemberExperienceRule()
    },
    methods: {
      getBrandMemberExperienceRule() {
        axios.post("/getBrandMemberExperienceRule", {brandId: this.currentInfo.brandId}).then(res => {
          let brandMemberExperienceRuleInfo = res.brandMemberExperienceRuleInfo;
          this.formFields = this.formFields.map(item => {
            item.growValue = brandMemberExperienceRuleInfo[item.growValueKey];
            item.limitType = brandMemberExperienceRuleInfo[item.limitTypeKey];
            item.limitTopValue = brandMemberExperienceRuleInfo[item.limitTopValueKey];
            return item
          });
          this.id = brandMemberExperienceRuleInfo.id;
        })
      },
      validate() {
        let validAll = true;
        this.formFields.forEach(item => {
          this.$refs[item.limitTopValueKey].validate(valid => {
            if (!valid) {
              validAll = false;
            }
          });
          this.$refs[item.growValueKey].validate(valid => {
            if (!valid) {
              validAll = false;
            }
          })
        });
        return validAll;
      },
      submit() {
        if (this.validate()) {
          let param = {};
          this.formFields.forEach(item => {
            param[item.growValueKey] = item.growValue;
            param[item.limitTypeKey] = item.limitType;
            param[item.limitTopValueKey] = item.limitTopValue;
          });
          param = {
            ...param,
            brandId: this.currentInfo.brandId,
            id: this.id
          };
          axios.post("/createOrUpdateBrandMemberExperienceRule", {
            brandMemberExperienceRuleInfo: param
          }).then(res => {
            this.$message({
              type: res.success ? "success" : "warning",
              message: res.message
            })
          })
        }
      },
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          if (rowIndex < this.formFields.length - 2 && this.formFields[rowIndex].behavior === this.formFields[rowIndex + 1].behavior) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else if (rowIndex >= 1 && rowIndex < this.formFields.length - 2 && this.formFields[rowIndex].behavior === this.formFields[rowIndex - 1].behavior) {
            return {
              rowspan: 0,
              colspan: 0
            };
          } else {
            return {
              rowspan: 1,
              colspan: 1
            };
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .member-grow {
    box-sizing: border-box;
    padding: 0 20px;
    margin-bottom: 20px;

    /deep/ .el-table .cell {
      height: 38px;
      line-height: 38px;
      overflow: visible;
    }

    .el-form {
      /deep/ .el-input {
        width: 100px;
        border-radius: 3px;
        margin-right: 10px;

        .el-input__inner {
          height: 32px;
        }
      }
      /deep/ .el-form-item {
        .el-form-item__error{
          z-index: 2;
        }
      }
    }

    .el-form.limit-val {
      .el-radio-group {
        display: flex;
        align-items: center;

        .el-radio {
          display: flex;
          align-items: center;

          /deep/ .el-form-item {
            margin-bottom: -1px;
          }
        }
      }
    }

    .buttons {
      padding: 20px 0;
    }
  }
</style>
