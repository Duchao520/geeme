<template>
  <div>
    <el-table
      stripe
      :data="tableData"
      v-loading.fullscreen.lock="pageLoading"
      height="calc(100vh - 368px)"
    >
      <el-table-column class-name="custom_cell border_left" class="c6" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column  prop="name" label="支出项目名称"></el-table-column>
      <el-table-column label="支出金额(￥)" prop="money"></el-table-column>
      <el-table-column prop="deptName" label="支出部门"></el-table-column>
      <el-table-column label="项目类型" prop="projectType"></el-table-column>
      <el-table-column label="支出类型" prop="expendType"></el-table-column>
      <el-table-column label="支出方式" prop="moneyType"></el-table-column>
      <el-table-column label="凭证">
        <template slot-scope="{row}">
          <img 
            v-if="row.photo" 
            :src="utils.formatPicImg(row.photo)" 
            style="width:40px;height:40px;"
            :preview="row.photo" 
            :preview-text="''" 
          >
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
    </el-table>
    <div class="page-line">
      <el-pagination
        style="margin: 5px 20px 5px 0;"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :pager-count="5"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import * as axios from '@/util/axios'
import {mapState} from 'vuex'
import * as utils from "@/assets/js/utils"
export default {
  props: {
    filterData: {
      type: Object
    }
  },
  data() {
    return {
      utils,
      pageLoading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
    }
  },
  created(){},
  methods: {
    init() {
      if (this.filterData.consumerType === undefined) { return } // 第一次初始化的时候,可能没有
      // 加区分品牌和门店端
      let shopId = this.currentEntry === 'brand' ? this.filterData.shopIdInBrand : this.currentInfo.shopId
      if (!shopId) { return }
      let data = {
        beginTime: this.filterData.beginDay,
        endTime: this.filterData.endDay,
        expendTypeEnum: this.filterData.consumerType,
        moneyTypeEnum: this.filterData.payType,
        timeEnum: this.filterData.currentDate,
        projectClassification: this.filterData.projectType,
        storeId: shopId, 
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      }
      this.pageLoading = true
      axios.post('/storeExpendRecordList', data).then(res => {
        this.pageLoading = false
        if (res.success) {
          this.tableData = res.recordResponseList
          this.$previewRefresh() // 避免图片预览不执行
          this.total = res.total
        } else {
          this.total = 0
          this.tableData = []
          this.$message({ type: 'error', message: res.message })
        }
      }).catch(err => {
        this.total = 0
        this.tableData = []
        this.pageLoading = false
      })
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.init()
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
  watch: {
    filterData: {
      handler: function(v, o) {
        if (v) {
          this.currentPage = 1
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang='scss' scoped>
  .page-line {
    height: 65px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .table-customer_name {
    background: no-repeat right center;
    background-size: 15px 15px;
    padding-right: 20px;

    &.male {
      background-image: url('../../../../../assets/img/male_tip.png');
    }

    &.female {
      background-image: url('../../../../../assets/img/female_tip.png');
    }
  }

  .table-customer_level {
    padding: 2px 5px;
    border-radius: 10px;
    background-color: #9da8cc;
    color: #fff;
    font-size: 10px;
  }
</style>
