<template>
  <el-dialog
    title="设置店长"
    :visible.sync="setStoreManageModelVisible"
    width="500px"
    :before-close="dialogBeforeClose"
  >
    <el-form :model="form" label-width="140px" ref="form" :rules="formRules">
      <el-form-item label="门店名称">
        <el-input disabled v-model="addStoreManageInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input maxlength="16" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input maxlength="11" v-model="form.mobile"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="closeDialog()">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as api from "@/assets/js/interface";
import * as axios from '@/util/axios';
export default {
  props: {
    setStoreManageModelVisible: Boolean,
    addStoreManageInfoProto: Object
  },
  data() {
    let mobileValidator = (rules, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号"));
      } else if (
        !/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
          value
        )
      ) {
        callback(new Error("请输入正确格式的手机号"));
      } else {
        callback();
      }
    }
    let nameValidator = (rules, value, callback) => {
      if (!value) {
        callback(new Error("请输入姓名"))
      } else if (!/^[\u4E00-\u9FA5|A-Za-z|0-9][\u4E00-\u9FA5|A-Za-z||0-9|\s]*$/.test(value)) {
        callback(new Error("请输入规范的姓名"))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: "",
        mobile: null
      },
      formRules: {
        name: [
          { trigger: "blur", required: true, validator: nameValidator },
          { trigger: "change", required: true, validator: nameValidator }
        ],
        mobile: [
          { trigger: "blur", required: true, validator: mobileValidator },
          { trigger: "change", required: true, validator: mobileValidator }
        ]
      },
      addStoreManageInfo: JSON.parse(JSON.stringify(this.addStoreManageInfoProto))
    };
  },
  watch: {
    addStoreManageInfoProto(val) {
      this.addStoreManageInfo = JSON.parse(JSON.stringify(val))
    },
  },
  methods: {
    dialogBeforeClose() {
      this.$refs.form.resetFields();
      this.$emit("close");
    },
    confirm() {
      console.log(this.addStoreManageInfo)
      this.$refs.form.validate(valid => {
        if (valid) {
          axios.post(api.createStoreManager.URL, {
            name: this.form.name,
            storeId: this.addStoreManageInfo.storeId,
            mobile: this.form.mobile
          }).then(res => {
            this.createStoreManagerRes(res)
          })
        }
      });
    },
    createStoreManagerRes(res){
        console.log(res)
        if(res.success){
            let arr = [];
            this.addStoreManageInfo.managerInfos.forEach(element=>{
                arr.push(element.id)
            })
            arr.push(res.id)
            axios.post(
              api.setStoreManager.URL,
              {managers:arr,storeId:this.addStoreManageInfo.storeId}
            ).then(res => {
                this.setStoreManagerRes(res);
            })
            this.$refs.form.validateField()
        }else{
            this.$message({
                type:"warning",
                message:res.message
            })
        }
    },
    setStoreManagerRes(res){
        if(res.success){
            this.$emit('refresh')
            this.form={},
            this.$emit('close');
            this.$message({
              type:"success",
              message:"设置店长成功"
            })
        }
    },
    closeDialog(){
      this.$refs.form.resetFields();
      // this.$refs.form.validateField()
      this.$emit('close')
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form-item {
  /deep/ .el-input__inner {
    width: 200px;
  }
}
</style>
