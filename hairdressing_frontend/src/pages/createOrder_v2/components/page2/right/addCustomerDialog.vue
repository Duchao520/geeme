<template>
  <el-dialog
    width="500px" 
    append-to-body
    :visible="visible"
    :before-close="close"
    title="新增客户"
  >
    <el-form :model="myForm" label-width="1.3rem" :rules="rules" ref="addCustomerForm">
      <el-form-item label="手机号" prop="mobile" :rules="{required:!!myForm.mobile,validator:mobileBlurValidator}">
        <el-input v-model="myForm.mobile" placeholder="手机号" :maxlength="11" :checkEmpty="false"/>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="myForm.name" placeholder="姓名" :maxlength="16"/>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="myForm.sex" placeholder="性别">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="select-identity-footer">
      <el-button class="normal_blue_btn" @click="confirm">保存</el-button>
      <el-button plain class="plain_gray_btn" @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import * as axios from "@/util/axios";
  import {mapActions} from "vuex";
  import Bus from "@/util/bus";

  export default {
    props: {
      visible: Boolean
    },
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
        // Bus.$emit("get-member-price");
      },
      stop() {
        //形成这垃圾代码的原因是：这个pug格式的代码写了@click.stop之后直接报错
      }
    },
  };
</script>
<style lang='scss' scoped>
/deep/ .el-input {
  width: 250px;
}
</style>
