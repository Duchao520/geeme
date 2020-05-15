<template>
  <div>
    <el-dialog
      :closeOnClickModal="false"
      title="修改价格"
      :visible="visible"
      width="500px"
      @close="close"
    >
      <div class="main">
        <div class="main-row">
          <span class="main-title">应收金额</span>
          <span>{{oldPrice}}元</span>
        </div>
        <div class="main-row">
          <span class="main-title">修改为</span>
          <span class="main-input-box">
            <span class="main-input-span">元</span>
            <input type="text" placeholder="请输入修改后的应收金额" v-model.number="newPrice">
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">关 闭</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { reg } from '@/assets/js/RegExp'
  export default {
    data () {
      return {
        newPrice: '',
      }
    },
    props: {
      visible: Boolean,
      oldPrice:Number,
    },
    methods: {
      close() {
        this.$emit('close')
        this.newPrice = ''
      },
      submit() {
        if (reg.price.test(this.newPrice)) {
          this.$emit('confirm', this.newPrice)
          this.newPrice = ''
        } else {
          this.$message.error('请输入一个大于零的数字, 最多2位小数')
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .main {
    color:#666;
    font-size:14px;
    span{
      display: inline-block;
    }
  }

  .main-row{
    margin-top:20px;
    :first-child{
      margin-top:0;
    }
  }

  .main-title{
    margin-right:20px;
    width:90px;
    text-align: right;
  }

  .main-input-box {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    input {
      display: block;
      width:180px;
      height: 40px;
      line-height: 40px;
      outline: none;
      border: none;
      text-indent: 14px;
      color: #606266;
      font-size: inherit;
      &::placeholder{
        color: #bbb;
      }
    }
  }
  .main-input-span{
    float:right;
    width:40px;
    height:40px;
    line-height:40px;
    text-align: center;
    background:#d5dadf;
    border-left: 1px solid #DCDFE6;
    color:#fff;
  }
</style>

