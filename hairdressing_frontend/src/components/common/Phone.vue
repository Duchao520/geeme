<template>
  <el-form ref="form" :model="form" label-width="0" :rules="formRule">
    <el-form-item prop="mobile">
      <el-input :disabled="disabled" v-model.trim="form.mobile" type="number" @input="inputMobile" :placeholder="placeholder"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    value: String,
    placeholder: String,
    disabled:Boolean,
    checkEmpty:{
      type:Boolean,
      default:true
    }
  },
  data() {
    let mobileValidator = (rule, value_, callback) => {
        let value = this.value
      if (value.length > 0 && value.length < 11) {
        callback();
      } else if (value.length === 11) {
        if (
          /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
            value
          )
        ) {
          callback();
        } else {
          callback("请输入正确格式的手机号码");
        }
      }
    };
    let mobileBlurValidator = (rule, value_, callback) => {
        let value = this.value
      if (
        /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
          value
        )
      ) {
        callback();
      } else {
        if (!value) {
          if(this.checkEmpty){
            callback("请输入手机号");
          }else{
            callback()
          }
        } else {
          callback("手机号格式不正确");
        }
      }
    };
    return {
      form: {
        mobile: null
      },
      formRule: {
        mobile: [
          { required: true, trigger: "blur", validator: mobileBlurValidator },
          { required: true, trigger: "change", validator: mobileValidator }
        ]
      }
    };
  },
  methods: {
    inputMobile(num) {
      this.form.mobile = num?num.slice(0, 11):'';
      this.$emit("input", this.form.mobile);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
