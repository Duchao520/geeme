<template>
  <el-dialog
    :visible="visible"
    title="发货"
    width="500px"
    custom-class="custom-class"
    @close="$emit('close')"
  >
    <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
      <el-form-item label="收货人" prop="consignee">
        <el-row>
          <el-col :span="12">
            <el-input v-model.trim="form.consignee" maxlength="32" placeholder="请输入收货人姓名"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="手机号" prop="consigneePhone">
        <el-row>
          <el-col :span="12">
            <el-input v-model.trim="form.consigneePhone" maxlength="11" placeholder="请输入手机号"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="收货地址" prop="consigneeAddress">
        <el-row>
          <el-col :span="18">
            <el-input v-model.trim="form.consigneeAddress" maxlength="128" placeholder="请输入收货地址"></el-input>
          </el-col>
        </el-row>
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
        <el-row>
          <el-col :span="12">
            <el-input v-model.trim="form.trackingNum" placeholder="请输入物流单号"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button plain class="plain_gray_btn" @click="$emit('close')">取 消</el-button>
      <el-button class="normal_blue_btn" @click="confirm">确定发货</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    id:Number
  },
  data() {
    let validatePhone = (rule, value, callback) => {
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
        callback(new Error('请输入密码'));
      } else {
        callback(new Error('请输入正确的手机号'))
      }
    }
    return {
      form: {
        consignee: '', // 人名
        consigneePhone: '', // 手机号
        consigneeAddress: '', // 地址
        logisticsCompany: '', // 快递公司
        trackingNum: '', // 快递单号
      },
      logisticsCompanyOptions: ["韵达快递", "申通快递", "圆通快递", "中通快递", "百世快递", "顺丰速运", "中国邮政", "EMS", "天天快递", "优速快递"],
      query: "",
      formRules: {
        consignee: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
        consigneePhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' },
        ],
        consigneeAddress: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
        logisticsCompany: [{ required: true, message: '请选择物流公司', trigger: 'blur' }],
        trackingNum: [{ required: true, message: '请输入物流单号', trigger: 'blur' }],
      },
    }
  },
  methods: {
    remoteMethod(query) {
      this.query = query;
    },
    confirm() {
      // 校验数据
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('sendGoods', {id: this.id, ...this.form})
        }
      })
    }
  },
  computed: {
    computedLogisticsCompanyOptions() {
      return this.logisticsCompanyOptions.filter(item => item.includes(this.query))
    }
  },
}
</script>
<style lang='scss' scoped>

</style>
