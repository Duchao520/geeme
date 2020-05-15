<template>
  <div class="scan-input-area">
    <h3>付款码</h3>
    <div class="bar-code">
      <el-input 
        style="width:220px;margin: 12px 0;"
        type="text"
        ref="codeInput"
        id="codeInput"
        v-model.trim="code" 
        placeholder="请扫码或者输入付款码"
        :suffix-icon="isAdvances ? 'el-icon-camera' : ''"
      />
      <el-button class="normal_blue_btn" @click="handleSaveCode(code)">确定交易</el-button>
      <div class="info" v-if="!isAdvances">
        扫码自动交易, 手动输入请点击按钮或者按回车键完成交易。
        <br>
        (扫码时请确认上方输入框处于选中状态)
      </div>
      <div class="info" v-else>
        扫码后自动交易；
        <br>
        手动输入请点击按钮或按回车键交易。
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
      required: false
    },
    useRecharge: {
      type: Boolean,
      default: false
    },
    isAdvances: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      code: '',
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
      if (!code) { return this.$message.error('请输入付款码') }
      console.log(code)
      this.$emit('getCode',code)
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
