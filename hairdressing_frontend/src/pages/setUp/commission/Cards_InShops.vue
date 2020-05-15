<template>
  <div>
    <div class="dialog-body-filter-line">
      <div class="level-filter-box">
        <el-button 
          class="normal_blue_btn" 
          v-if="checkHasBtnPermission('/shop-inner/add-new-commission-plan-card', 'path')" 
          @click="toAddProductCommission"
        >新增提成方案</el-button>
        <i v-else></i>
      </div>
      <div class="search-box">
        <g-search :placeholder='"搜索适用职务"' v-on:search="handleSearch"></g-search>
      </div>
    </div>
    <div class="main-con">
      <el-table v-loading="loading" :data="tableData" border :span-method="arraySpanMethod" height="calc(100vh - 225px)">
        <el-table-column prop="positionName" label="适用员工职务" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="提成方案名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="computeType" label="计算方式" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.computeType|computeTypeFilter}}</template>
        </el-table-column>
        <el-table-column prop="auth" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="defaultScheme" label="设为默认" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-radio 
              v-model="scope.row.defaultScheme" 
              @change="setDefaultScheme(scope.row)" 
              :label="true"
              :disabled="!checkHasBtnPermission('/shop-inner/edit-commission-plan-card', 'path')"
            >设为默认</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip v-if="checkHasBtnPermission('/shop-inner/edit-commission-plan-card', 'path')" >
          <template slot-scope="scope">
           <g-button
              :name="'编辑'"
              :type="'detail'"
              :icon="'icon_operate_edit'"
              padding="0 8px"
              @click="editCommission(scope.row)"
            ></g-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <confirm-del :delDialogVisible="delDialogVisible" @close="delDialogVisible=false" @confirm="confirmDelPlan"></confirm-del> -->
  </div>
</template>
<script>
import * as axios from '@/util/axios'
import * as utils from '@/assets/js/utils'
import { mapActions, mapState } from "vuex"
import confirmDel from "@/components/setUp/ConfirmDel"
export default {
  components: { confirmDel },
  data() {
    return {   
      loading: false,
      tableData: [],
      keyword: "",
      firstColSpan: [], // 合并列
      // delDialogVisible: false,
    };
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions(["setCardScheme"]),
    init() {
      let params = {
        storeId: this.currentInfo.shopId,
        brandId: this.currentInfo.brandId,
        keyword: this.keyword,
        // storeId: this.currentInfo.shopId // 品牌总部的
      }
      this.loading = true
      this.firstColSpan = []
      axios.post('/getStoreCommissionCardList', params).then(res => {
        this.loading = false
        this.tableData = res.commissionCardListInfos
        this.setSpanData(this.tableData, this.firstColSpan, 'positionId')
      })
    },
    // 合并单元格
    arraySpanMethod({row, column, rowIndex, columnIndex}) {
      let _row = 1
      let _col = 1
      if (columnIndex === 0) {
        _row = this.firstColSpan[rowIndex]
      }
      _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    },
    // 设置默认方案
    setDefaultScheme(row) {
      this.loading = true
      let currentId = row.id // 当前的方案id
      let currentPositionId = row.positionId // 当前的职务id
      let params = {
        commissionCardId: row.id,
        positionId: row.positionId,
        brandId: this.currentInfo.brandId,
        storeId: this.currentInfo.shopId
      }
      axios.put('/setDefaultStoreCommissionCard', params).then(res => {
        // el-radio-group 单选互斥不适用于此处, 只能自己处理
        this.tableData.map(item => {
          if (item.positionId === currentPositionId && item.id !== currentId) {
            item.defaultScheme = false
          }
        })
        this.loading = false
        utils.showTip(this, {msg: '设置默认方案成功', type: 'success'})
      }).catch(err => {
        row.defaultScheme = false
        this.loading = false
      })
    },
    // 编辑方案
    editCommission(row) {
      this.setCardScheme({id: row.id, 'id_desc': 'id是编辑卡项提成方案的查询id-品牌端'})
      this.$router.push('/shop-inner/edit-commission-plan-card')
    },
    // 搜索
    handleSearch(keywords) {
      this.keyword = keywords
      this.init()
    },
    confirmDelPlan(){
      console.log("删除提成方案")
    },
    toAddProductCommission() {
      this.$router.push('/shop-inner/add-new-commission-plan-card')
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
  },
  filters: {
    computeTypeFilter(type) {
      let typeMap = {
        1: '固定式',
        2: '阶梯式',
        3: '阶段式',
      }
      return typeMap[type]
    }
  }
};
</script>
<style lang="scss" scoped>

.main-con {
  box-sizing: border-box;
  padding: 10px;
  height: calc(100vh - 207px);
  overflow: hidden;
}
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
</style>
