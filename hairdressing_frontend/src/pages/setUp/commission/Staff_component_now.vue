<template>
  <el-table :data="tableData" stripe height="calc(100vh - 294px)" v-loading="loading">
    <i @click.stop="handleClose" ref="colse" id='hideDom'></i>
    <el-table-column label="员工姓名" prop="staffName" show-overflow-tooltip></el-table-column>
    <el-table-column label="职务" prop="levelName" show-overflow-tooltip></el-table-column>
    <el-table-column label="服务劳动提成">
      <template slot-scope="scope">
          <div class="table-column-flex-box">
          <div class="up-line">
            <el-select v-model="scope.row.laborCommId" :ref="`scrollSelect0${scope.$index}`" placeholder="请选择劳动提成方案">
              <el-option v-for="item in scope.row.serviceLaborComm" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="bottom-line">
            <el-date-picker
              :ref="`scrollSelect1${scope.$index}`"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              v-model="scope.row.laborValidDate"
              placeholder="选择生效日期"
            ></el-date-picker>
            <span class="text-btn" @click="handleClickToSave(scope.row, 'labor_service')">生效</span>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="产品提成">
      <template slot-scope="scope">
        <div class="table-column-flex-box">
          <div class="up-line">
            <el-select v-model="scope.row.productCommId" :ref="`scrollSelect2${scope.$index}`" placeholder="请选择产品提成方案">
              <el-option v-for="item in scope.row.productComm" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="bottom-line">
            <el-date-picker :ref="`scrollSelect3${scope.$index}`" :picker-options="pickerOptions" value-format="yyyy-MM-dd" v-model="scope.row.productValidDate" placeholder="选择生效日期"></el-date-picker>
            <span class="text-btn" @click="handleClickToSave(scope.row, 'product')">生效</span>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="卡项提成">
      <template slot-scope="scope">
        <div class="table-column-flex-box">
          <div class="up-line">
            <el-select v-model="scope.row.cardCommId" :ref="`scrollSelect4${scope.$index}`" placeholder="请选择卡项提成方案">
              <el-option v-for="item in scope.row.cardComm" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="bottom-line">
            <el-date-picker :ref="`scrollSelect5${scope.$index}`" :picker-options="pickerOptions" value-format="yyyy-MM-dd" v-model="scope.row.cardValidDate" placeholder="选择生效日期"></el-date-picker>
            <span class="text-btn" @click="handleClickToSave(scope.row, 'card')">生效</span>
          </div>
        </div>
      </template>
    </el-table-column>
    <!-- 门店提成需求有变 -->
    <!-- <el-table-column label="门店总提成">
      <template slot-scope="scope">
        <div class="table-column-flex-box">
          <div class="up-line">
            <el-select v-model="scope.row.storeCommId" :ref="`scrollSelect6${scope.$index}`" placeholder="请选择门店提成方案">
              <el-option v-for="item in scope.row.storeComm" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="bottom-line">
            <el-date-picker :ref="`scrollSelect7${scope.$index}`" :picker-options="pickerOptions" value-format="yyyy-MM-dd" v-model="scope.row.storeValidDate" placeholder="选择生效日期"></el-date-picker>
            <span class="text-btn" @click="handleClickToSave(scope.row, 'shop')">生效</span>
          </div>
        </div>
      </template>
    </el-table-column> -->
  </el-table>
</template>
<script>
import * as axios from '@/util/axios'
import * as utils from '@/assets/js/utils'
import { mapState } from "vuex"
export default {
  props: {
    tableData: {
      type: Array
    }
  },
  data() {
    return {
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
    }
  },
  methods: {
    handleClickToSave(row, type) {
      // 按需保存
      let params = {
        brandId: this.currentInfo.brandId,
        storeId: this.currentInfo.shopId,
        positionId: row.positionId,
        staffId: row.staffId,
      }
      switch (type) {
        case 'labor_service':
          Object.assign(params, {laborCommId: row.laborCommId, laborValidDate: row.laborValidDate})
          if (!row.laborCommId) return this.$message({type: 'error', message: '请选择方案'})
          if (!row.laborValidDate) return this.$message({type: 'error', message: '请填写生效时间'})
          break
        case 'product':
          Object.assign(params, {productCommId: row.productCommId, productValidDate: row.productValidDate})
          if (!row.productCommId) return this.$message({type: 'error', message: '请选择方案'})
          if (!row.productValidDate) return this.$message({type: 'error', message: '请填写生效时间'})
          break
        case 'shop':
          Object.assign(params, {storeCommId: row.storeCommId, storeValidDate: row.storeValidDate})
          if (!row.storeCommId) return this.$message({type: 'error', message: '请选择方案'})
          if (!row.storeValidDate) return this.$message({type: 'error', message: '请填写生效时间'})
          break
        case 'card':
          Object.assign(params, {cardCommId: row.cardCommId, cardValidDate: row.cardValidDate})
          if (!row.cardCommId) return this.$message({type: 'error', message: '请选择方案'})
          if (!row.cardValidDate) return this.$message({type: 'error', message: '请填写生效时间'})
          break
      }
      this.loading = true
      axios.post('/validCommission', params).then(res => {
        this.loading = false
        utils.showTip(this, {msg: '保存成功!', type: 'success'})
      }).catch(err => {
        // this.loading = false
      })
    },
    closeDropdown() {
      // ['服务劳动'、'产品'、'卡项'、'门店'的提成方案&生效日期] 0-7
      [...Array(8).keys()].map(project => {
        // 员工个数
        [...Array(this.tableData.length).keys()].map(person => {
          this.$refs[`scrollSelect${project}${person}`] && this.$refs[`scrollSelect${project}${person}`].handleClose()
        });
      })
    }
  },
  computed: {
     ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
  },
  mounted() {
    let dom = document.getElementsByClassName('el-table__body-wrapper')[0]
    dom.addEventListener('scroll', this.closeDropdown, false)
  }
}
</script>

<style scoped lang="scss">
$blue: #58c9f3;
.table-column-flex-box {
  display: flex;
  flex-flow: column nowrap;
  .up-line {
    margin-bottom: 8px;
  }
}
.text-btn {
  color: $blue;
  &:hover { cursor: pointer; }
}
</style>
