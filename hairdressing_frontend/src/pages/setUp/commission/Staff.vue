<template>
  <div v-loading="loading">
    <div class="dialog-body-filter-line">
      <!-- 历史纪录需要重新计算表格高度 -->
      <h1 v-if="active !== 'staff-now'">历史纪录</h1>

      <div class="level-filter-box">
        <el-select v-model="formData.staffLevelId" placeholder="请选择员工职务" clearable @change="handleSelectChanged">
          <el-option v-for="lev in staffList" :key="lev.id" :label="lev.name" :value="lev.id"></el-option>
        </el-select>
      </div>
      <div class="search-box">
        <g-search :placeholder='"搜索员工姓名"' v-on:search="handleSearch"></g-search>
      </div>
    </div>
    <div class="main-con">
      <component :is="active" :tableData="tableData"></component>
      <div class="bottom-line">
        <el-pagination
          style="margin: 5px 20px 5px 0;"
          @current-change="handleCurrentChange"
          :current-page="formData.pageNum"
          :page-size="formData.pageSize"
          :pager-count="5"
          layout="total, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import * as axios from '@/util/axios'
import * as utils from '@/assets/js/utils'
import { mapState } from "vuex"
import staffNow from './Staff_component_now'
export default {
  data() {
    return {
      formData: {
        pageNum: 1,
        pageSize: 10,
        staffLevelId: null,
        staffName: '', // 搜索
      },
      staffList: [],
      tableData: [],
      total: 0,
      active: 'staff-now',
      loading: false,
    }
  },
  created() {
    this.init()
    this.getAllSaftt()
  },
  methods: {
    getAllSaftt() {
      axios.get(`/getAllSimpleStoreStaffLevelList/${this.currentInfo.brandId}`).then(res => {
        this.staffList = res.levelList
      })
    },
    init() {
      // active == 'staff-now'
      let params = {
        ...this.formData,
        storeId: this.currentInfo.shopId
      }
      this.loading = true
      axios.post('/getStaffCommission', params).then(res => {
        this.loading = false
        this.tableData = res.staffListInfos
        this.total = res.total
      })
    },
    // 搜索
    handleSearch(keywords) {
      this.formData.staffName = keywords
      this.handleSelectChanged()
    },
    handleSelectChanged() {
      this.formData.pageNum = 1
      this.init()
    },
    handleCurrentChange(page) {
      this.formData.pageNum = page
      this.init()
    }
  },
  computed: {
     ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
  components: { staffNow }
}
</script>

<style lang="scss" scoped>
.search-box {
  // overflow: hidden;
}
.dialog-body-filter-line {
  padding: 22px 20px 15px 10px;
  display: flex;
  justify-content: space-between;
  .search-box {
    width: 220px;
  }
}
.main-con {
  box-sizing: border-box;
  padding: 10px;
  height: calc(100vh - 205px);
  overflow: hidden;
}
.bottom-line {
  height: 75px;
  .el-pagination {
    margin-top: 20px !important;
    padding-right: 0 !important;
  }
}
</style>
