<template>
  <el-dialog
    width="450px"
    title="编辑条码"
    :visible="dialogVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form>
      <el-form-item label="原条码编号">
        <el-input v-model="detail.barcode" style="width:240px;" disabled></el-input>
      </el-form-item>
      <el-form-item label="新条码编号">
        <el-input 
          type="text"
          ref="editInput"
          id="editInput" 
          style="width:240px;"
          :maxlength="maxlength" 
          v-model.trim="code" 
          placeholder="请扫描或者输入条形码"
        />
        <div class="info">
          扫码自动录入, 手动输入请点击按钮或者按回车键完成录入。
          <br>
          (扫码时请确认上方输入框处于编辑状态)
        </div>
      </el-form-item>
      <el-form-item>
        <el-button class="normal_blue_btn" @click="handleSaveCode(code)">修 改</el-button>
        <el-button class="normal_gray_btn" @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
export default {
  props: {
    detail: {
      type: Object,
      required: true,
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      code: '', 
      maxlength: 16,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.editInput.focus()
      this.initInput()
    })
  },
  methods: {
    initInput() {
      let _this = this;
      let code = "";
      let lastTime, nextTime;
      let lastCode, nextCode;
      let dom = document.getElementById('editInput')
      dom.onkeypress = function (e) {
        nextCode = e.which;
        nextTime = new Date().getTime();
        if (lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
          code += String.fromCharCode(lastCode);
          _this.code = code;
        } else if (
          lastCode != null &&
          lastTime != null &&
          nextTime - lastTime > 100
        ) {
          code = "";
        }
        lastCode = nextCode;
        lastTime = nextTime;
        if (e.which === 13) { // 回车键, 扫码枪自带; 或者手动输入时按回车键
          _this.handleSaveCode(code + "" || _this.code);
          code = "";
        }
      };
    },
    handleSaveCode(code) {
      if (!code) { return }
      this.code = code.slice(0, this.maxlength)
      let params = {
        stockOrderDetail: {
          ...this.detail,
          barcode: this.code,
          remarks: '',
        }
      }
      axios.post('/modifyProductStockBarcode', params).then(res => {
        if (res.success) {
          this.$message.success('修改成功')
          this.$emit('init')
        }
      }).catch(err => {
        this.$message.error('条形码重复')
      })
    },
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>
<style lang='scss' scoped>
.info {
  margin-right: 24px;
  text-align: justify;
  font-size: 10px;
  color: #999;
  margin-top: 12px;
  line-height: 16px;
}
</style>
