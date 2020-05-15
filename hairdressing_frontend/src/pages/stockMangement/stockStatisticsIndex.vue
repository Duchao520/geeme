<template>
  <div class="stock-statistics-index">
    <div class="page-type-box">
      <el-radio-group class="btn-group" v-model="active">
        <el-radio-button
          v-for="item in tags"
          :key="item.name"
          :label="item.comp"
        >{{item.name}}</el-radio-button>
      </el-radio-group>
    </div>
    <component :is="active" :ref='active'></component>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import stockIO from './components/statistics/pages/stockIO'
import productRS from './components/statistics/pages/productRS'
import requireOrder from './components/statistics/pages/requireOrder'
import goodsSell from './components/statistics/pages/goodsSell'
import storeRequireOrder from './components/statistics/pages/storeRequireOrder'
import orderGoods from './components/statistics/pages/orderGoods'
export default {
  data() {
    return {
      active: '', // 激活的页面组件
    }
  },
  methods: {
    compName(comp) {
      let name = ''
      switch(comp) {
        case 'stockIO':
          name = '出入库明细'
          break
        case 'productRS':
          name = '产品收发汇总'
          break
        case 'requireOrder':
          name = '订单统计报表'
          break
        case 'goodsSell':
          name = '商品销售报表'
          break
        case 'storeRequireOrder':
          name = '门店订货报表'
          break
        case 'orderGoods':
          name = '订单商品统计'
          break
        default:
          name = '出入库明细'
      }
      return name
    },
  },
  mounted() {
    this.active = this.tags[0].comp
  },
  watch: {
    // tags: {
    //   handler: function(v, o) {
    //     this.active = v[0].comp
    //   }
    // }
  },
  computed: {
    ...mapState({
      btnAuths: state => state.authRouter.btnAuths,
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry,
    }),
    tags() {
      // 改成按钮权限
      if (this.currentEntry === 'brand') {
        let roleAuths = []
        let allAuths = ['stockIO', 'productRS', 'requireOrder', 'goodsSell', 'storeRequireOrder', 'orderGoods']
        allAuths.map(i => {
          if (this.btnAuths.includes(`brand_stock_statistics_${i}`)) {
            let name = this.compName(i)
            roleAuths.push({
              name: name,
              comp: i,
            })
          }
        }) 
        return roleAuths
      } else {
        return [
          {name:'出入库明细', comp:'stockIO'}, // 门店仅此2个页面， 其他为品牌独有
          {name:'产品收发汇总', comp:'productRS'}, // 门店仅此2个页面， 其他为品牌独有
          {name:'订单商品统计', comp:'orderGoods'}, // 订单商品， 总部、门店共有
        ]
      }
    },
  },
  components: { stockIO, productRS, requireOrder, goodsSell, storeRequireOrder, orderGoods },
}
</script>

<style lang='scss' scoped>
.stock-statistics-index {
  .page-type-box {
    margin: 15px 20px;
    height: 35px;
  }

  /deep/ .el-radio-button__inner {
    // width: 98px;
    height: 35px;
    line-height: 35px;
    padding: 0 12px;
  }

  /deep/ .el-radio-button.is-active {
    .el-radio-button__inner {
      background: #58C9F3;
      border: none;
    }
  }
}
</style>