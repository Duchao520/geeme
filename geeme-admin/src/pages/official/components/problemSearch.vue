<template>
  <div>
    <div class="searchInput">
      <a-button 
        @click="addQuestion"
        style="background:#F52D56;
        border:none;
        color: #ffffff;
        margin: 0 15px 0 0;">
        新增问题
      </a-button>
      <a-input-search placeholder="请输入标题" style="width: 280px" v-model='form.searchKey' enterButton @search="search"/>
    </div>
    <div class="search-wrapper">
      <div class="line second">
        <div class="left">
          <a-row type='flex'>
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="状态" prop="status" label-width="40px">
                <el-select v-model="form.status" placeholder="请选择状态" clearable>
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发布时间" prop="publishTime">
                <el-date-picker
                  v-model="form.publishTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择发布时间"
                  align="right"
                >
                </el-date-picker>   
              </el-form-item>
              <el-form-item label="修改时间" prop="modifyTime">
                <el-date-picker
                  v-model="form.modifyTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择修改时间"
                  align="right"
                >
                </el-date-picker> 
              </el-form-item>
            </el-form>
          </a-row>
        </div>
        <div class="right">
          <a-button type="primary" @click="search">查询</a-button>
          <button class="clear" @click="reset">清空条件</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    templateList: Array,
  },
  data() {
    return {
      statusOptions: [
        {value: 1, label: '已发布'},
        {value: 2, label: '草稿箱'},
      ],
      form: {
        searchKey: null,
        publishTime: null,
        modifyTime: null,
        status: null,
      }
    }
  },
  mounted() {
  },
  methods: {
    reset() {
      this.form = {
        searchKey: null,
        auditTemplateId: null,
        curTemplateId: null,
        status: null,
      }
      this.$emit('search',this.form, true)
    },
    search(val) {
      this.$emit('search', this.form)
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    addQuestion() {
      this.$router.push('/app/official/problem/addProblem')
    }
  }
};
</script>

<style lang="less" scoped>
.searchInput{
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.search-wrapper:extend(.normal-content-one) {
  clear: both;
  padding: 5px 20px 10px 20px;
  .line {
    display: flex;
    justify-content: space-between;
    &.second {
      margin: 13px 0 0 0;
    }
    .left {
      .item {
        overflow: hidden;
        height: 36px;
        margin-right: 20px;
      }
    }
    .right {
      box-sizing: border-box;
      .clear {
        font-size:14px;
        color: #999999;
        margin: 0 0 17px 10px;
        cursor: pointer;
      }
    }
  }
}
.ant-row-flex {
  /deep/ .el-form {
    display: flex;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}
</style>