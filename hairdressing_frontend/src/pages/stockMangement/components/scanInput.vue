<template>
  <div class="scan-input-area">
    <h3>条形码录入</h3>
    <div class="bar-code">
      <p>条形码编号</p>
      <el-input 
        style="width:220px;margin: 12px 0;"
        type="text"
        ref="codeInput"
        id="codeInput" 
        :maxlength="maxlength" 
        v-model.trim="code" 
        placeholder="请扫描或者输入条形码"
      />
      <el-button class="normal_blue_btn" @click="handleSaveCode(code)">确定录入</el-button>
      <div class="info">
        扫码自动录入, 手动输入请点击按钮或者按回车键完成录入。
        <br>
        (扫码时请确认上方输入框处于编辑状态)
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from '@/util/axios';
import {mapState, mapActions} from 'vuex';
export default {
  props: {
    detail: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      code: '',
      maxlength: 16
    }
  },
  mounted() {
    this.focusInput()
    this.initInput()
  },
  methods: {
    focusInput() {
      this.code = ''
      this.$refs.codeInput.focus()
    },
    initInput() {
      let _this = this;
      let code = "";
      let lastTime, nextTime;
      let lastCode, nextCode;
      let dom = document.getElementById('codeInput')
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
          remarks: '',
          barcode: this.code,
          cycleImages: this.detail.cycleImages,
          stockOrderId:  this.detail.stockOrderId,
          stockProductId: this.detail.stockProductId,
          stockSubOrderId: this.detail.stockSubOrderId,
          stockProductName: this.detail.stockProductName,
          specificationName: this.detail.specificationName,
          stockProductSpecificationId: this.detail.stockProductSpecificationId,
        }
      }
      axios.post('/createProductStockBarcode', params).then(res => {
        if (res.success) {
          this.$emit('init')
          // this.focusInput()
        }
      }).catch(err => {
        this.$message.error('条形码重复')
      })
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
}
</script>
<style lang='scss' scoped>
h3 {
  margin: 12px 0 20px 12px;
}
.bar-code {
  margin-left: 24px;
}
.normal_blue_btn  {
  margin-top: 24px;
}
.info {
  margin-right: 24px;
  text-align: justify;
  font-size: 10px;
  color: #999;
  margin-top: 12px;
}
</style>
