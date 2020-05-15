<template>
  <el-dialog
    :visible="visible"
    width="500px"
    custom-class="custom-class"
    @close="$emit('close')"
  >
    <h5 slot="title">发货</h5>
    <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
      <el-form-item label="收货信息">
        <div class="deliver-goods">
          <div>
            <h6>{{consignee}}</h6><span>{{consigneePhone}}</span>
          </div>
          <p>{{consigneeAddress}}</p>
        </div>
      </el-form-item>
      <el-form-item label="物流公司" prop="logisticsCompany"
      >
        <el-select
          v-model="form.logisticsCompany"
          filterable
          remote
          reserve-keyword
          placeholder="请选择物流公司"
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="item in computedLogisticsCompanyOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物流单号" prop="trackingNum"
      >
        <el-input v-model.trim="form.trackingNum" placeholder="请输入物流单号"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button plain class="plain_gray_btn" @click="close">取 消</el-button>
      <el-button class="normal_blue_btn" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import * as axios from "@/util/axios";

  export default {
    props: {
      visible: Boolean,
      consignee: String,
      consigneePhone: String,
      consigneeAddress:String,
      id:Number
    },
    data() {
      return {
        form: {
          trackingNum: null,
          logisticsCompany: null
        },
        formRules: {
          logisticsCompany: {
            required: true, message: '请选择物流公司'
          },
          trackingNum: {
            required: true, message: '请输入物流单号'
          }
        },
        logisticsCompanyOptions: ["韵达快递", "申通快递", "圆通快递", "中通快递", "百世快递", "顺丰速运", "中国邮政", "EMS", "天天快递", "优速快递"],
        query: ""
      }
    },
    computed: {
      computedLogisticsCompanyOptions() {
        return this.logisticsCompanyOptions.filter(item => item.includes(this.query))
      }
    },
    methods: {
      confirm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            axios.post("/productOrderStartDeliver", {
              id: this.id,
              ...this.form
            }).then(res => {
              this.$message({
                type:res.success?"success":"warning",
                message:res.message
              });
              this.$emit("afterDeliverGoods");
              this.$refs.form.resetFields()
            })
          } else {
            console.warn("ERROR SUBMIT!")
          }
        })
      },
      remoteMethod(query) {
        this.query = query;
      },
      close(){
        this.$emit("close");
        this.$refs.form.resetFields()
      }
    }

  }
</script>
<style lang="scss">
  .custom-class {
    .el-dialog__header {
      border-bottom: 1px solid #F0F1F4;
      padding: 20px;

      h5 {
        line-height: 20px;
        font-size: 18px;
      }
    }

    .el-dialog__body {
      padding: 10px 20px;

      .el-form-item {
        .el-form-item__content {
          line-height: 17px;

          .deliver-goods {
            border: 1px solid #F0F1F4;
            border-radius: 2px;
            width: 260px;
            height: 80px;
            box-sizing: border-box;
            padding: 12px;
            @mixin font-style($lh,$fs,$col) {
              line-height: $lh;
              font-size: $fs;
              color: $col;
            }

            div {
              margin-bottom: 4px;

              h6 {
                @include font-style(20px, 14px, #666666);
                display: inline-block;
              }

              span {
                @include font-style(17px, 12px, #666666);
                margin-left: 4px;
              }

              h6, span {
                vertical-align: text-bottom;
              }
            }

            p {
              line-height: 17px;
              color: rgba(153, 153, 153, 1);
              font-size: 12px;
            }
          }

          .el-input {
            width: 260px;
          }
        }

      }
    }
  }
</style>
