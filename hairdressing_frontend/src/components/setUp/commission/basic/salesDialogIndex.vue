<template>
  <el-dialog custom-class='commission-sales-dialog' :visible="salesDialog" title="商品扣成本" :before-close="close" width="800px">
    <div class="sales-dialog-content">
      <div class="user-defined-tab">
        <el-tabs v-model="active" type="card">
          <el-tab-pane v-for="item in componentsOptions"
            :key="item.label"
            :label="item.label"
            :name="item.name">
          </el-tab-pane>
        </el-tabs>
      </div>
      <component 
        :is="active" 
        :ref="active" 
        :serviceOptions="serviceOptions"
        :productOptions="productOptions"
        :commissionBasicId="commissionBasicId"
      ></component>
    </div>  
    <span slot="footer" class="dialog-footer">
      <el-button plain class="plain_gray_btn" @click="close">关 闭</el-button>
      <el-button class="normal_blue_btn" @click="confirm">保存当前页</el-button>
    </span>
  </el-dialog>
</template>

<script>
import "@/assets/css/tab.scss"
import cService from './saleService'
import cProduct from './saleProduct'
import cCard from './saleCard'
import * as axios from '@/util/axios'
import { mapState } from "vuex"
export default {
  props: {
    salesDialog: {
      type: Boolean
    },
    commissionBasicId: {
      type: Number
    }
  },
  data() {
    return {
      active: '',
      componentsOptions: [
        // {label: '服务设置', name: 'c-service'}, // 动态配置当前上线的销售提成涉及类别 1/3
        {label: '产品设置', name: 'c-product'},
        {label: '卡项设置', name: 'c-card'},
      ],
      serviceOptions: [], // 服务的一二级分类选项数据
      productOptions: [], // 产品的一二级分类选项数据
    }
  },
  created() {
    this.active = this.componentsOptions[0].name // 动态配置当前上线的销售提成涉及类别 2/3
    let serviceData =  {goodsTypeScope: 'service', storeId: this.currentInfo.shopId}
    let productData =  {goodsTypeScope: 'production', storeId: this.currentInfo.shopId}
    axios.post('/getSortInfoFromStoreGoods', serviceData)
      .then(res=> {
        this.serviceOptions = res.storeSortInfoList
      })
    axios.post('/getSortInfoFromStoreGoods', productData)
      .then(res=> {
        this.productOptions = res.storeSortInfoList
      })
  },
  methods: {
    confirm() {
      this.$refs[this.active].saveData()
    },
    close() {
      this.active = this.componentsOptions[0].name  // 动态配置当前上线的销售提成涉及类别 3/3
      this.$emit('close')
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
  },
  components: { cService, cProduct, cCard }
}
</script>

<style lang="scss">
.commission-sales-dialog {
  .el-dialog__body {
    border-top: 1px solid #F0F1F4;
    padding: 18px 20px;
  }
}
</style>
<style lang="scss" scoped>
.sales-dialog-content {
  box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
  border-radius: 6px;
}
</style>
