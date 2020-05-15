<template>
  <el-dialog :visible="visible" width="500px" @close="() => { resetForm(); $emit('close')}">
    <h5 slot="title">退款处理</h5>
    <el-form :model="formInline" class="demo-form-inline" ref="form" :rules="rules" label-width="110px" @submit.native.prevent>
      <el-form-item label="申请退款金额">
        <span>{{applyRefundMoney}}元</span>
      </el-form-item>
      <el-form-item label="同意退款金额" prop="money">
        <el-input type="number" v-model="formInline.money" placeholder="请填写金额" style="width: 150px;">
          <span slot="append">元</span>
        </el-input>
      </el-form-item>
      <div class="leave-message">
        <p>给客户留言</p>
        <input-with-count
          v-model="formInline.note"
          :autosize="{minRows:4,maxRows:100}"
          placeholder="请输入给客户的留言"
        ></input-with-count>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="() => {resetForm(); $emit('close')}">取 消</el-button>
        <el-button type="primary" @click="confirmRefund" :loading="loading">确 定</el-button>
      </span>
  </el-dialog>
</template>
<script>

  export default {
    name: "Refund",
    props: {
      visible: Boolean,
      id: [Number, String],
      applyRefundMoney: Number
    },
    data() {
      let moneyValidator = (rule, value, callback) => {
        if (value <= 0) {
          callback("请输入大于0的数字");
        } else if (value > this.applyRefundMoney) {
          callback("输入金额不可大于申请退款金额");
        } else if (!/^[\d]*((\.[\d]{0,2}))?$/.test(value)) {
          callback("最多输入两位小数")
        } else {
          callback()
        }
      }
      return {
        formInline: {
          money: 0,
          note: ""
        },
        rules: {
          money: {required: true, validator: moneyValidator}
        },
        number: 0,
        loading: false
      };
    },
    computed: {
      currentInfo() {
        return this.$store.state.manage.currentInfo;
      }
    },
    methods: {
      confirmRefund() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true
            this.$emit('confirmRefund', {
              note: this.formInline.note,
              refundMoney: Number(this.formInline.money),
              refundOrderId: this.id,
              storeId: this.currentInfo.shopId
            });
          }
        })
      },
      // 重置formInline,由父组件调用
      resetForm() {
        this.$refs.form.resetFields()
        this.loading = false
      }
    }
  };
</script>
<style lang="scss" scoped>
  .el-dialog {
    background: blue;

    h5 {
      font-size: 18px;
      color: #333333;
      width: 100px;
      margin-bottom: 10px;
    }

    .el-form-item {
      /deep/ .el-form-item__label {
        color: #666666;
      }

      /deep/ .el-form-item__content {
        padding-left: 10px;
        color: #333333;

        .el-input {
          .el-input-group__append {
            padding: 0;
            width: 40px;
            text-align: center;
            background: #D5DADF;
            color: #fff;
          }
        }
      }
    }

    .leave-message {
      padding-left: 15px;

      p {
        margin-bottom: 10px;
      }
    }
  }

  /deep/ .el-dialog__header {
    border-bottom: 1px solid #F0F1F4;
  }

  /deep/ .el-dialog__body {
    padding: 10px 20px;
  }
</style>
