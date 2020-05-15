<template>
  <div>
    <div class="searchInput">
      <a-input-search placeholder="搜索品牌名称/小程序名称" style="width: 280px" v-model='searchData.keyWord' enterButton @search="search"/>
    </div>
    <div class="search-wrapper">
      <div class="line second">
        <div class="left">
          <a-row type='flex'>
            <div class='item'>
              <span>当前模板号：</span>
              <a-select
                placeholder='筛选模板号'
                showSearch
                optionFilterProp="children"
                :filterOption="filterOption"
                v-model="searchData.curTemplateId" 
                style='width: 150px;'
              >
                <a-select-option 
                v-for="item in templateList"
                :key="item.template_id"
                :value="item.template_id"
                >
                {{item.template_id}}
                </a-select-option>
              </a-select>
            </div>
            <div class="item">
              <span>审核模板号：</span>
              <a-select
                showSearch
                optionFilterProp="children"
                :filterOption="filterOption"
                v-model="searchData.auditTemplateId" 
                placeholder="筛选模板号"
                style='width: 150px;'
              >
                <a-select-option 
                v-for="item in templateList"
                :key="item.template_id"
                :value="item.template_id"
                >
                {{item.template_id}}
                </a-select-option>
              </a-select>
            </div>
            <div class="item">
              <span>状态：</span>
              <a-select
                v-model="searchData.status" 
                placeholder="全部"
                style='width: 150px;'
              >
                <a-select-option 
                v-for="item in statusList"
                :key="item.id"
                :value="item.id"
                >
                {{item.name}}
                </a-select-option>
              </a-select>
            </div>
            <!-- <G-Form-Item class="item" v-bind="form.curTemplateId" @s-change="onChange"/>
            <G-Form-Item class="item" v-bind="form.auditTemplateId" @s-change="onChange"/>
            <G-Form-Item class="item" v-bind="form.status" @s-change="onChange"/> -->
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
      statusList: [{ name: "未发布", id: 'unPublish' },{ name: "已发布", id: 'published' },{ name: "提交中", id: 'committing' },{ name: "审核中", id: 'auditting' },{ name: "审核成功", id: 'success' },{ name: "审核失败", id: 'failed' }],
      searchData: {
        keyWord: null,
        auditTemplateId: undefined,
        curTemplateId: undefined,
        status: undefined,
      }
    }
  },
  mounted() {
  },
  methods: {
    reset() {
      this.searchData = {
        keyWord: '',
        auditTemplateId: undefined,
        curTemplateId: undefined,
        status: undefined,
      }
      this.$emit('search',this.searchData)
    },
    search(val) {
      this.$emit('search', this.searchData)
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
};
</script>

<style lang="less" scoped>
.searchInput{
  float: right;
  margin-bottom: 20px;
}
.search-wrapper:extend(.normal-content-one) {
  clear: both;
  padding: 5px 20px 10px 20px;
  .line {
    display: flex;
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
</style>