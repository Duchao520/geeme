<template lang="pug">
  transition(
  name="fade"
  )
    section.choose-add-customer(
    @click="$emit('close')"
    )
      .choose-add-customer-container(
      @click.stop="stop"
      )
        .choose-header
          .header-title 新增客户
          i.close.icon.iconfont.icon-icon_close(
          @click="$emit('close')"
          )
        .body
          el-form(
          :model="myForm",
          label-width="1.3rem",
          :rules="rules",
          ref="addCustomerForm"
          )
            el-form-item(
            label="手机号"
            prop="mobile"
            :rules="{required:!!myForm.mobile,validator:mobileBlurValidator}"
            )
              el-input(
              v-model="myForm.mobile",
              placeholder="手机号",
              :maxlength="11",
              :checkEmpty="false"
              )
            el-form-item(
            label="姓名"
            )
              el-input(
              v-model="myForm.name",
              placeholder="姓名",
              :maxlength="16"
              )
            el-form-item(
            label="性别",
            prop="sex"
            )
              .select-item
                el-select(
                v-model="myForm.sex",
                autocomplete="off",
                placeholder="性别",
                )
                  el-option(
                  label="男",
                  value="男"
                  )
                  el-option(
                  label="女",
                  value="女"
                  )

        .footer
          .btn-group
            .btn-item
              el-button(
              class="normal_blue_btn",
              @click="confirm"
              ) 保存
            .btn-item
              el-button(
              class="plain_gray_btn",
              @click="close"
              ) 取消
</template>
<script>
  import * as axios from "@/util/axios";
  import {mapActions} from "vuex";
  import Bus from "@/util/bus";

  export default {
    data() {
      let mobileBlurValidator = (rule, value, callback) => {
        console.log(value)
        if (
          /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
            value
          ) || !value
        ) {
          callback();
        } else {
          callback("手机号格式不正确");
        }
      };
      return {
        mobileBlurValidator,
        myForm: {
          name: null,
          sex: null,
          mobile: null
        },
        rules: {
          sex: {required: true, message: "请选择性别", trigger: "change"},
        }
      };
    },
    computed: {
      currentInfo() {
        return this.$store.state.manage.currentInfo;
      }
    },
    methods: {
      ...mapActions(["saveCustomerInfo"]),
      confirm() {
        this.$refs.addCustomerForm.validate(valid => {
          if (valid) {
            let params = {
              name: this.myForm.name,
              storeId: this.currentInfo.shopId,
              mobile: this.myForm.mobile,
              sex: this.myForm.sex
            };
            axios.post("/addCustomerForAppointment", params).then(res => {
              this.$message({
                type: res.success ? "success" : "warning",
                message: res.message
              });
              this.afterSelectedCustomer(res.customer);
            });
          }
        });
      },
      close() {
        this.$emit("close");
        this.myForm = {
          name: null,
          sex: null,
          mobile: null
        };
      },
      afterSelectedCustomer(data) {
        this.close();
        this.saveCustomerInfo({
          headPortrait: data.headPortrait,
          name: data.name,
          sex: data.sex,
          mobile: data.mobile,
          memberLevel: data.memberLevel,
          id: data.id
        });
        Bus.$emit("get-member-price");
      },
      stop() {
        //形成这垃圾代码的原因是：这个pug格式的代码写了@click.stop之后直接报错
      }
    },
  };
</script>
<style lang="scss" scoped>
  .choose-add-customer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);

    &-container {
      width: 500px;
      position: absolute;
      top: 50%;
      left: 50%;
      background: #fff;
      border-radius: 4px;
      box-sizing: border-box;
      transform: translate(-50%, -50%);
      font-size: 18px;
      color: #333333;
      overflow: hidden;

      .choose-header {
        padding: 15px 15px 15px 30px;
        border-bottom: 1px solid #f0f1f4;

        .header-title {
          display: inline-block;
        }

        .close {
          float: right;
          font-size: 26px;
        }
      }

      .body {
        padding: 20px 20px 0 20px;
        padding-right: 150px;

        .el-form-item {
          /deep/ .el-input__inner {
            width: 200px;
          }
        }
      }

      .footer {
        position: relative;
        height: 60px;

        .btn-group {
          position: absolute;
          right: 4%;

          .btn-item {
            display: inline-block;

            &:first-child {
              margin-right: 20px;
            }
          }
        }
      }
    }
  }
</style>
