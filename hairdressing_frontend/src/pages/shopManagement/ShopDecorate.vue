<template>
   <div id='gm_shop_decorate' class="margin_main">
      <div class="el-tabs el-tabs--card el-tabs--top">
        <!-- <router-link tag="div" class="el-tabs__item is-top" to="/shop-inner/store/info/basic-info">基本资料</router-link> -->
        <!-- <div class="el-tabs__header is-top">
          <div class="el-tabs__nav-wrap is-top">
            <div class="el-tabs__nav-scroll">
              <div role="tablist" class="el-tabs__nav is-top" style="transform: translateX(0px);">
                <router-link tag="div" class="el-tabs__item is-top" to='/shop-inner/store/info/voerall-style'>总体风格</router-link>
                <router-link tag="div" class="el-tabs__item is-top" to='/shop-inner/store/info/navigator-set'>导航设置</router-link>
                <router-link tag="div" class="el-tabs__item is-top" to='/shop-inner/store/info/senior-customization'>高级定制</router-link>
                <router-link tag="div" class="el-tabs__item is-top" to='/shop-inner/store/info/share-link'>分享链接</router-link>
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <div class="container">
        <router-view></router-view>
      </div>
   </div>
</template>

<script>
export default {
  name:'GmShopDecorate',
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
  #gm_shop_decorate{
    background-color:#fff;
  }
</style>

