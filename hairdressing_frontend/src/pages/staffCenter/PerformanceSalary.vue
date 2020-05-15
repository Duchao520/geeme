<template>
  <div class="wrap-con">
    <div class="top-line">
      <div>
        <el-radio-group class="btn-group" v-model="componentId">
          <el-radio-button
            v-for="(item,index) in staffTypes"
            :key="index"
            :label="item.type"
          >{{item.name}}
          </el-radio-button>
        </el-radio-group>
      </div>
      <input-search placeholder="请输入员工姓名/手机号/编号" style="width:275px" v-model='keyword' @search="search"></input-search>
    </div>
    <component :is="componentId" :ref='componentId' :keyword='keyword'></component>
  </div>
</template>
<script>
  import BrandStaffListBrand from '@/components/staff/brandStaff/BrandStaffListSaray'
  import BrandStaffListStore from '@/components/staff/brandStaff/BrandStaffListRankingList'

  export default {
    components: {
      BrandStaffListStore,
      BrandStaffListBrand
    },
    data () {
      let strValidator = [{trigger: 'change', message: ''}, {trigger: 'blur', message: ''}]
      let numValidator_ = (rule, value, callback) => {
        callback()
      }
      let numValidator = [{trigger: 'change', validator: numValidator_}, {trigger: 'blur', validator: numValidator_}]
      return {
        keyword: '',
        componentId: 'BrandStaffListBrand',
        staffTypes: [
          {name: '业绩薪酬', type: 'BrandStaffListBrand'},
          {name: '排行榜', type: 'BrandStaffListStore'}
        ],
      }
    },
    methods: {
      // search(val) {
      //   this.keyword = val;
      // },
      search (val) {
        if (val == this.keyword) {
          if (this.componentId == 'BrandStaffListBrand') {
            this.$refs.BrandStaffListBrand.getPerformanceSalary(1)
          } else {
            this.$refs.BrandStaffListStore.getSalaryRanking(1)
          }
        } else {
          this.keyword = val
        }
      },
    },
    watch: {
      componentId (val) {
        this.keyword = ''
      }
    }
  }
</script>
<style lang="scss" scoped>

  .wrap-con {
    box-sizing: border-box;
    padding: 0 20px;

    .top-line {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin: 20px 0;

      /deep/ .el-radio-button__inner {
        height: 35px;
        line-height: 35px;
        padding-top: 0;
        padding-bottom: 0;
        border: none;
      }

      /deep/ .el-radio-button.is-active {
        .el-radio-button__inner {
          background: #58C9F3;
        }
      }
    }
  }
</style>
<style>
  .btn-group {
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  }
</style>
