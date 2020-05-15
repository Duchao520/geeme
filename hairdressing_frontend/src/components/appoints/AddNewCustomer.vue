<template>
  <el-form ref="formAddNew" :model="formAddNew" :rules="formAddNewRules">
    <div style="display:flex">
      <el-form-item prop="name" style="width:220px;margin-right:10px">
        <el-input v-model="formAddNew.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item prop="sex" style="width:220px;">
        <el-select v-model="formAddNew.sex" placeholder="性别">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
    </div>
    <el-form-item prop="mobilePhone" style="width:450px;">
      <el-input v-model.number="formAddNew.mobilePhone"></el-input>
    </el-form-item>
    <div style="margin-bottom:20px;">
      <el-button type="primary" @click="confirmCustomer">确定</el-button>
      <el-button type="primary" @click="showAddCustomer = false">取消</el-button>
    </div>
  </el-form>
</template>
<script>
import * as api from "@/assets/js/interface";
import * as axios from '@/util/axios';
export default {
  props: {
      
  },
  data() {
    return {
      formAddNew: {
        name: null,
        sex: null,
        mobilePhone: null
      },
      formAddNewRules: {
        name: [{ required: true, trigger: "blur", message: "请填写姓名" }],
        sex: [{ required: true, trigger: "blur", message: "请填写性别" }],
        mobilePhone: [
          { required: true, trigger: "blur", validator: validatePhone }
        ]
      }
    };
  },
  methods: {
    confirmCustomer() {
      this.$refs.formAddNew.validate(valid => {
        if (valid) {
          let params = {
            name: this.formAddNew.name,
            mobile: this.formAddNew.mobilePhone,
            sex: this.formAddNew.sex,
            storeId: this.currentInfo.shopId
          };
          axios.post(
            api.addCustomerForAppointment.URL,
            params
          ).then(res => {
            this.addCustomerRes(res);
          })
        }
      });
    },
    addCustomerRes(res) {
      if (res.success) {
        this.form.customerId = res.id;
        this.form.mobile = this.formAddNew.mobilePhone;
        utils.showTip(this, { msg: res.message, type: "success" });
        this.showAddCustomer = false;
        this.formAddNew = { name: null, sex: null, mobilePhone: null };
      } else {
        utils.showTip(this, { msg: res.message, type: "error" });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
