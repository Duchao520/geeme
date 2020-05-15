<template>
  <div class="card-table">
    <div class="dialog-body-filter-line">
      <div class="level-filter-box"></div>
      <div class="search-box">
        <g-search :placeholder='"搜索产品名称"' v-on:search="handleSearch"></g-search>
      </div>
    </div>
    <el-table 
      stripe 
      height="420" 
      v-loading="tableLoading"
      :data="tableData" 
      :row-class-name="setRowClassName"
      :header-cell-style="headerRowStyle" 
      @selection-change="handleSelectionChange" 
    >
      <el-table-column type="selection" width="42px"></el-table-column>
      <el-table-column label="卡项名称" show-overflow-tooltip prop="productName"></el-table-column>
      <el-table-column label="售价" show-overflow-tooltip prop="price" width="80px"></el-table-column>
      <el-table-column label="扣成本" prop="cost" width="160px">
        <template slot-scope="scope">
          <!-- <el-input max='999999' v-model.number="scope.row.cost" @change="changeSingleRow(scope.row)" size="medium">
            <template slot="append">元</template>
          </el-input> -->
          <div class="cost-input-box">
            <input class="cost-input-before" maxlength="12" v-model.number="scope.row.cost"  @keyup="changeSingleRow(scope.row)">
            <span  class="cost-input-after">元</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom-line">
      <el-pagination
        style="margin: 5px 20px 5px 0;"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :pager-count="5"
        layout="total, prev, pager, next"
        :total="totalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import * as axios from '@/util/axios'
import * as utils from '@/assets/js/utils'
import { mapState } from "vuex";
export default {
  name: 'c-card',
  data() {
    return {
      currentPage: 1, // es搜索说是下标从0开始...
      pageSize: 10,
      title: '', // 搜索的关键词
      totalCount: 0,
      // 
      tableData: [], //
      multipleSelection: [], // 组件自带的勾选数组对象
      checkedIds: [], // 选中的id们, 用于匹配输入框直接输入的文本是不是打勾了
      headerRowStyle: { background: '#f4f5f7' }, // 表头样式
      tableLoading: false, 
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let data = {
        pageNum: this.currentPage - 1, // es查询的页码...
        pageSize: this.pageSize,
        brandId: this.currentInfo.brandId,
        cardName: this.title,
        commissionBasicId: this.$attrs.commissionBasicId
      }
      this.tableLoading = true
      axios.post('/pagedQueryCardCostInfo', data).then(res => {
        this.tableLoading = false
        this.totalCount = res.total
        this.tableData = res.listCardCostModel
      })
    },
    saveData() {
      let params = []
      this.tableData.map(item => {
        params.push({
          productCostId: item.productCostId,
          commissionBasicId: this.$attrs.commissionBasicId,
          productCostType: 'CARD', // SERVICE, PRODUCT, CARD
          productId: item.productId,
          cost: item.cost,
          specificationId: item.specificationId,
        })
      })
      this.tableLoading = true
      axios.post('/saveGoodsCostInfo', {goodsInfoList: params}).then(res => {
        this.tableLoading = false
        utils.showTip(this, {msg: res.message, type: 'success'})
      }).catch(err=> {
        this.tableLoading = false
      })
    },
    // 第一列勾选的变化
    handleSelectionChange(checkedRows) {
      this.multipleSelection = checkedRows
    },
    // 输入框输入事件
    changeSingleRow(row) {
      if (/^[0-9]{1,12}(\.[0-9]{0,2})?$/.test(row.cost + '')) {
        if (this.checkedIds.includes(row.productId)) {
          this.multipleSelection.map(i => {
            i.cost = row.cost
          })
        }
      } else {
        utils.showTip(this, {msg: '请输入1-12位的阿拉伯数字, 最多两位小数', type: 'error'})
      }
    },
    // 搜索
    handleSearch(keywords) {
      this.title = keywords
      this.init()
    },
    // 页码切换
    handleCurrentChange(page) {
      this.currentPage = page;
      if (page > this.totalCount || page <= 0) return
      this.init()
    },
    // 设置勾选的行的输入框样式
    setRowClassName(row, index) {
      let calssName = this.checkedIds.includes(row.row.productId) ? 'checked' : 'no-checked'
      return calssName
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
  },
  watch: {
    'multipleSelection'(rows, old) {
      this.checkedIds = []
      rows.map(i => {
        this.checkedIds.push(i.productId)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "./index.scss";
</style>
 