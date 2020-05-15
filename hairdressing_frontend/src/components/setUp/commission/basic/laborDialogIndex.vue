<template>
  <el-dialog custom-class='commission-labor-dialog' :visible="laborDialog" title="服务扣成本" :before-close="close" width="800px">
    <div class="labor-dialog-content">
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
          <g-search :placeholder='"搜索服务名称"' v-on:search="handleSearch"></g-search>
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
        <el-table-column label="服务项目名称" show-overflow-tooltip prop="serviceName"></el-table-column>
        <el-table-column label="规格" show-overflow-tooltip prop="specificationName"></el-table-column>
        <el-table-column label="门店价" show-overflow-tooltip prop="shopPrice" width="80px"></el-table-column>
        <!-- 使用假的字段cost -->
        <el-table-column label="服务者扣成本" prop="performanceServer" width="160px">
          <template slot-scope="scope">
            <div class="cost-input-box">
              <input class="cost-input-before" maxlength="12" v-model.number="scope.row.performanceServer"  @keyup="changeSingleRow_service(scope.row)">
              <span  class="cost-input-after">元</span>
            </div>
          </template>
        </el-table-column>
        <!-- 使用假的字段 shopPrice -->
        <el-table-column label="辅助工位扣成本" prop="performanceAssistant" width="160px">
          <template slot-scope="scope">
            <div class="cost-input-box">
              <input class="cost-input-before" maxlength="12" v-model.number="scope.row.performanceAssistant"  @keyup="changeSingleRow_aid(scope.row)">
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" plain class="plain_gray_btn">关 闭</el-button>
      <el-button class="normal_blue_btn" @click="saveData">保存当前页</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as axios from '@/util/axios'
import * as utils from '@/assets/js/utils'
import { mapState } from "vuex"
export default {
  props: {
    laborDialog: {
      type: Boolean
    },
    commissionBasicId: {
      type: Number
    }
  },
  data() {
    return {
      serviceOptions: [], // 服务的一二级分类选项数据
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
    let serviceData =  {goodsTypeScope: 'service', storeId: this.currentInfo.shopId}
    axios.post('/getSortInfoFromStoreGoods', serviceData).then(res=> {
      this.serviceOptions = res.storeSortInfoList
    })
    this.init()
  },
  methods: {
    init() {
      let data = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        sortOne: this.levelOne,
        sortTwo: this.levelTwo,
        keyword: this.title,
        storeId: this.currentInfo.shopId,
      }
      this.tableLoading = true
      axios.post('/getStoreServiceListForPerformance', data).then(res => {
        this.tableLoading = false
        this.totalCount = res.total
        this.tableData = res.serviceInfoList
      })
    },
    saveData() {
      let params = []
      this.tableData.map(item => {
        params.push({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          specificationId: item.specificationId,
          specificationName: item.specificationName,
          serviceCost: item.performanceServer, // 服务者扣额
          assistantCost: item.performanceAssistant, // 助理扣额
          servicePrice: item.shopPrice,
        })
      })
      this.tableLoading = true
      axios.post('/saveServiceCost', {commissionBasicId: this.commissionBasicId, laborServiceCost: params}).then(res => {
        this.tableLoading = false
        utils.showTip(this, {msg: '保存劳动扣成本配置成功', type: 'success'})
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
    // 输入框输入事件_服务者
    changeSingleRow_service(row) {
      if (/^[0-9]{1,12}(\.[0-9]{0,2})?$/.test(row.performanceServer + '')) {
        if (this.checkedIds.includes(row.specificationId)) {
          this.multipleSelection.map(i => {
            i.performanceServer = row.performanceServer
          })
        }
      } else {
        utils.showTip(this, {msg: '请输入1-12位的阿拉伯数字, 最多两位小数', type: 'error'})
      }
    },
    // 输入框输入事件_服务者
    changeSingleRow_aid(row) {
      if (/^[0-9]{1,12}(\.[0-9]{0,2})?$/.test(row.performanceAssistant + '')) {
        if (this.checkedIds.includes(row.specificationId)) {
          this.multipleSelection.map(i => {
            i.performanceAssistant = row.performanceAssistant
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
      let calssName = this.checkedIds.includes(row.row.specificationId) ? 'checked' : 'no-checked'
      return calssName
    },
    close() {
      this.$emit('close')
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    levelOneOptions() {
      let o = []
      this.serviceOptions.map(p => {
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
        this.checkedIds.push(i.specificationId)
      })
    }
  }
}
</script>

<style lang="scss">
.commission-labor-dialog {
  .el-dialog__body {
    border-top: 1px solid #F0F1F4;
    padding: 18px 20px;
  }
}
</style>
<style lang="scss" scoped>
  @import "./index.scss";
  .labor-dialog-content {
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    border-radius: 6px;
  }
</style>
