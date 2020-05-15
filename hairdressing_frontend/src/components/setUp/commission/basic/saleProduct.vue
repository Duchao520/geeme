<template>
  <div class="product-table">
    <div class="dialog-body-filter-line">
      <div class="level-filter-box">
        <!-- 下拉组件 -->
        <el-select v-model="levelOne" placeholder="选择一级分类" clearable @change="levelOneChanged">
          <el-option
            v-for="item in levelOneOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="levelTwo" placeholder="选择二级分类" clearable @change="levelTwoChanged">
          <el-option
            v-for="item in levelTwoOptions"
            :key="item.jimeiClassId"
            :label="item.sortName"
            :value="item.jimeiClassId">
          </el-option>
        </el-select>
      </div>
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
      <el-table-column label="产品名称" show-overflow-tooltip prop="simpleTitle"></el-table-column>
      <el-table-column label="规格" show-overflow-tooltip prop="specificationName"></el-table-column>
      <el-table-column label="专柜价" show-overflow-tooltip prop="shopPrice" width="80px"></el-table-column>
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
import { mapState } from "vuex"
export default {
  name: 'c-product',
  props: {
    productOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentPage: 1, // es搜索说是下标从0开始...
      pageSize: 10,
      levelOne: null,
      levelTwo: null,
      title: '', // 搜索的关键词
      totalCount: 0,
      // 
      tableData: [], //
      multipleSelection: [], // 组件自带的勾选数组对象
      checkedIds: [], // 选中的id们, 用于匹配输入框直接输入的文本是不是打勾了
      headerRowStyle: { background: '#f4f5f7' }, // 表头样式
      tableLoading: false, 
      levelTwoOBJ: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let data = {
        "currentPage": this.currentPage - 1, // es查询的页码...
        "pageSize": this.pageSize,
        "productLevelOneId": this.levelOne,
        "productLevelTwoId": this.levelTwo,
        "storeId": this.currentInfo.shopId,
        "title": this.title
      }
      this.tableLoading = true
      axios.post('/esProductSpecificationByCondition', data).then(res => {
        this.tableLoading = false
        this.totalCount = res.totals
        this.tableData = res.productSpecificationsList
      })
    },
    saveData() {
      let params = []
      this.tableData.map(item => {
        params.push({
          productCostId: item.productCostId,
          commissionBasicId: this.$attrs.commissionBasicId,
          productCostType: 'PRODUCT', // SERVICE, PRODUCT, CARD
          productId: item.productId,
          cost: item.cost,
          specificationId: item.id,
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
    levelOneChanged() {
      this.currentPage = 1
      this.levelTwo = null
      this.init()
    },
    levelTwoChanged() {
      this.currentPage = 1
      this.init()
    },
    // 第一列勾选的变化
    handleSelectionChange(checkedRows) {
      this.multipleSelection = checkedRows
    },
    // 输入框输入事件
    changeSingleRow(row) {
      if (/^[0-9]{1,12}(\.[0-9]{0,2})?$/.test(row.cost + '')) {
        if (this.checkedIds.includes(row.id)) {
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
      this.currentPage = 1
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
      let calssName = this.checkedIds.includes(row.row.id) ? 'checked' : 'no-checked'
      return calssName
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    levelOneOptions() {
      let o = []
      this.productOptions.map(p => {
        o.push({id: p.jimeiClassId, name: p.sortName})
        this.levelTwoOBJ[p.jimeiClassId] = p.sortTwoList
      })
      return o
    },
    levelTwoOptions() {
      return this.levelTwoOBJ[this.levelOne]
    }
  },
  watch: {
    'multipleSelection'(rows, old) {
      this.checkedIds = []
      rows.map(i => {
        this.checkedIds.push(i.id)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "./index.scss";
</style>