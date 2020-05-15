<template>
  <el-dialog
    :visible="showAfterSalesServiceModel"
    width="500px"
    custom-class="diag"
    @close="$emit('close')"
  >
    <h5 slot="title">售后处理</h5>
    <el-form label-width="110px" ref="form" :model="form" :rules="rules">
      <el-form-item label="售后类型">
        <span>{{afterSaleDetail.refundReason}}</span>
      </el-form-item>
      <el-form-item label="申请退款金额" v-if="afterSaleDetail.refundPrice">
        <span>{{afterSaleDetail.refundPrice}}</span>
      </el-form-item>
      <el-form-item label="同意退款金额" v-if="afterSaleDetail.refundPrice" prop="refundMoney">
        <el-input
          type="number"
          v-model.number="form.refundMoney"
          placeholder="请填写金额"
          style="width: 150px;"
        >
          <span slot="append">元</span>
        </el-input>
      </el-form-item>
      <el-form-item label="客户诉求">
        <span>{{afterSaleDetail.note}}</span>
      </el-form-item>
      <el-form-item label="证据照片" v-if="afterSaleDetail.images&&afterSaleDetail.images.length>0">
        <div class="img-box">
          <img
            class="img"
            v-for="(item,index) in (afterSaleDetail.images || [])"
            :src="utils.formatPicImg(item,'style',70)"
            :key="index"
          />
        </div>
      </el-form-item>
      <el-form-item label="处理方案" prop="note">
        <input-with-count
          v-model="form.note"
          placeholder="请输入处理方案"
          :autosize="{minRows:4,maxRows:100}"
        ></input-with-count>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button
        style="background:#58C9F3;border:none;"
        type="primary"
        @click="handleAfterSaleContent"
      >回复客户</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import * as utils from "@/assets/js/utils";
  import * as axios from "@/util/axios";

  export default {
    props: {
      showAfterSalesServiceModel: Boolean,
      afterSaleDetail: Object
    },
    data() {
      let moneyValidator = (rule, value, callback) => {
        let max = this.afterSaleDetail.refundPrice;
        if (value <= 0) {
          callback("请输入大于0的数字");
        } else if (value > max) {
          callback("输入的金额不可大于申请退款金额");
        } else {
          callback();
        }
      };
      return {
        utils: utils,
        form: {
          refundMoney: null,
          note: ""
        },
        rules: {
          refundMoney: {required: true, validator: moneyValidator},
          note:{required:false}
        }
      };
    },
    computed: {
      currentInfo() {
        return this.$store.state.manage.currentInfo;
      }
    },
    methods: {
      handleAfterSaleContent() {
        this.$refs.form.validate(valid => {
          if (valid) {
            axios
              .post("/handleAfterSaleContent", {
                note: this.form.note,
                refundMoney: this.form.refundMoney || 0,
                refundOrderId: this.afterSaleDetail.id,
                storeId: this.currentInfo.shopId
              })
              .then(res => {
                this.$emit("handleSalesService");
                this.$message({type: res.success?"success":"warning", message: res.message});
                this.$refs.form.resetFields()
              });
          }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .diag {
    h5 {
      font-size: 18px;
      margin-bottom: 10px;
    }

    .el-form {
      /deep/ .el-form-item__label {
        color: #666666;
      }

      .el-form-item {
        margin-bottom: 10px;

        /deep/ .el-form-item__content {
          padding-left: 10px;
          color: #333333;

          .img-box {
            display: flex;

            img {
              display: inline-block;
              width: 100px;
              height: 100px;
              margin: 0 15px 15px 0;
            }
          }

          .el-input {
            .el-input-group__append {
              padding: 0;
              width: 40px;
              text-align: center;
              background: #d5dadf;
              color: #fff;
            }
          }
        }
      }
    }
  }

  /deep/ .el-dialog__header {
    border-bottom: 1px solid #f0f1f4;
  }

  /deep/ .el-dialog__body {
    padding: 10px 20px 10px 0;
  }
</style>
