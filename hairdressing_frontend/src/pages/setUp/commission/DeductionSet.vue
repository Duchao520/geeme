<template>
   <div id='ge_deduction_set' class="margin_main">
      <div class="el-tabs el-tabs--card el-tabs--top">
        <div class="el-tabs__header is-top">
          <div class="el-tabs__nav-wrap is-top">
            <div class="el-tabs__nav-scroll">
              <div role="tablist" class="el-tabs__nav is-top" style="transform: translateX(0px);">
                <router-link tag="div" class="el-tabs__item is-top" to="/shop-inner/setting/deduction-set/basic">基础设置</router-link>
                <router-link tag="div" class="el-tabs__item is-top" to='/shop-inner/setting/deduction-set/service'>服务提成</router-link>
                <router-link tag="div" class="el-tabs__item is-top" to='/shop-inner/setting/deduction-set/product'>产品提成</router-link>
                <router-link tag="div" class="el-tabs__item is-top" to='/shop-inner/setting/deduction-set/cards'>卡项提成</router-link>
                <router-link tag="div" class="el-tabs__item is-top" to='/shop-inner/setting/deduction-set/shops'>门店总提成</router-link>
                <router-link tag="div" class="el-tabs__item is-top" to='/shop-inner/setting/deduction-set/staff'>员工提成配置</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <router-view></router-view>
      </div>
   </div>
</template>

<script>
export default {
  name:'GmDeductionSet',
  data(){
    return{
    }
  },
  mounted(){

  },
  methods:{

  }
}
</script>
<style lang="scss" scoped>
  #ge_deduction_set{
    background-color:#fff;
  }
</style>