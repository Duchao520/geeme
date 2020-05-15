<template>
  <div>
    <div class="searchInput">
      <a-input-search placeholder="搜索品牌名称" style="width: 280px" v-model='searchData.keyWord' enterButton
                      @search="search"/>
    </div>
    <div class="search-wrapper">
      <div class="line second">
        <div class="left">
          <a-row type='flex'>
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
            <div class='item'>
              <span>申请时间：</span>
              <a-date-picker v-model='submitTime' format='YYYY-MM-DD hh:mm:ss' @change='panelChange'/>
            </div>
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
        statusList: [{name: "审核中", id: '2'}, {name: "已通过", id: '1'}, {name: "已驳回", id: '0'}],
        searchData: {
          keyWord: '',
          submitTime: null,
          status: null,
        },
        submitTime: null
      }
    },
    mounted() {
    },
    methods: {
      reset() {
        this.searchData = {
          keyWord: '',
          status: null,
          submitTime: null,
        }
        this.$emit('search', this.searchData)
      },
      search() {
        this.$emit('search', this.searchData)
      },
      panelChange(date, dateString) {
        console.log({date, dateString});
        this.searchData.submitTime = dateString
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  };
</script>

<style lang="less" scoped>
  .searchInput {
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
          font-size: 14px;
          color: #999999;
          margin: 0 0 17px 10px;
          cursor: pointer;
        }
      }
    }
  }
</style>
