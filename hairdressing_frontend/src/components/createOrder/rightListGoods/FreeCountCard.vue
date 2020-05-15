<template>
  <el-dialog
    :visible="visible"
    width="800px"
    @close="$emit('close')"
    custom-class="custom-class"
    append-to-body
  >
    <h6 slot="title" class="title">修改卡项</h6>
    <el-form ref="form" :model="cardInfo" label-width="120px" :rules="formRules">
      <el-form-item label="卡项名称">{{cardInfo.cardName}}</el-form-item>
      <el-form-item label="卡项类型">次卡</el-form-item>
      <el-form-item label="售价" prop="chargeMoney">
        <el-input type="number" v-model="cardInfo.chargeMoney" placeholder="请输入售价" style="width: 200px;">
          <div slot="append">元</div>
        </el-input>
      </el-form-item>
      <el-form-item label="享受权益">
        <div class="table-wrap">
          <el-table
            :data="cardInfo.listServiceCountInfo || []"
            max-height="400px"
          >
            <el-table-column
              prop="serviceName"
              label="服务名称"
              width="220px"
            >
            </el-table-column>
            <el-table-column
              prop="serviceSpecificationName"
              label="规格"
              width="220px"
            >
            </el-table-column>
            <el-table-column
              prop="countLimit"
              label="次数"
              width="180px"
            >
              <template slot-scope="scope">
                <el-form :ref="'countLimit'+scope.$index" :model="scope.row" :rules="countLimitRules">
                  <el-form-item prop="countLimit">
                    <el-input type="number" size="small" v-model="scope.row.countLimit" placeholder="数字"
                              style="width: 100px;" :disabled="numberSharing">
                      <div slot="append">次</div>
                    </el-input>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </el-form-item>
      <el-form-item prop="countLimit">
        <div class="table-bottom" v-if="cardInfo.listServiceCountInfo&&showBottomTotal">
          <div class="checkbox">
            <el-checkbox v-model="numberSharing">共用次数：</el-checkbox>
            <p>勾选此项之后，以上项目将共用此次数，各项目单独设置的次数无效。</p>
          </div>
          <div class="input">
            <el-input size="small" type="number" v-model="cardInfo.countLimit" placeholder="数字"
                      :disabled="!numberSharing"
                      style="width: 100px;">
              <div slot="append">次</div>
            </el-input>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')" class="plain_gray_btn">取 消</el-button>
      <el-button @click="confirm_" class="normal_blue_btn">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  export default {
    props: {
      visible: Boolean,
    },
    data() {
      let cardPriceValidator = (rules, value, callback) => {
        if (value === 0) {
          callback()
        } else if (/[- | \.]/.test(value) || !value) {
          callback("请输入卡的售价")
        }
      };
      let countLimitValidator = (rules, value, callback) => {
        console.log({value});

        if (!this.numberSharing) {
          callback()
        } else if (/[- | \.]/.test(value) || !value) {
          callback("请输入正整数")
        }
      };
      let totalCountLimitValidator = (rules, value, callback) => {
        if (this.numberSharing && (/[- | \.]/.test(value) || !value)) {
          callback("请输入正整数")
        } else {
          callback()
        }
      };
      return {
        cardInfo: {},
        formRules: {
          chargeMoney: {
            required: true,
            validator: cardPriceValidator
          },
          countLimit: {
            required: true,
            validator: totalCountLimitValidator
          }
        },
        countLimitRules: {
          countLimit: {
            required: true,
            validator: countLimitValidator
          },
        },
        numberSharing: false
      }
    },
    computed: {
      showBottomTotal() {
        return this.cardInfo.listServiceCountInfo.length > 1 || this.cardInfo.countLimit > 0
      }
    },
    methods: {
      confirmValid() {
        let useTotal = this.numberSharing;
        let formValid = true;
        this.$refs.form.validate(res => {
          formValid = res
        });
        if (useTotal) {
          return formValid;
        } else {
          let valid = this.cardInfo.listServiceCountInfo.every(item => item.countLimit);
          if (!valid) {
            this.$message({type: "warning", message: "请将每一项服务的次数补充完整"});
            return
          }
          return formValid && valid;
        }
      },
      confirm_() {
        if (!this.confirmValid()) {
          return
        }
        let useTotal = this.numberSharing;
        this.$emit('modifyCountCard', {
          countLimit: useTotal ? Number(this.cardInfo.countLimit) : null,
          chargeMoney:Number(this.cardInfo.chargeMoney),
          listServiceCountInfo: this.cardInfo.listServiceCountInfo.map(item => {
            return {
              ...item,
              countLimit: useTotal ? null : (Number(item.countLimit) || null),
            }
          })
        })

      }
    }
  }
</script>
<style lang="scss" scoped>
  @mixin font-style($lh,$fs,$col) {
    line-height: $lh;
    font-size: $fs;
    color: $col;
  }

  /deep/ .el-dialog__header {
    padding: 4px 20px 0;
    border-bottom: 1px solid #F0F1F4;
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
      margin-bottom: 0;

      /deep/ .el-form-item__error {
        z-index: 2;
      }

      /deep/ .el-input-group__append {
        background: #D5DADF;
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

</style>
