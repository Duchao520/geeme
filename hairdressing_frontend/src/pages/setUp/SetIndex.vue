<template>
    <div id="gm_set_index">
        <!--
          <div class="appo_submenu">
            <div class="tabs">
              <router-link tag="span" to='/shop-inner/setting/appoint-set'>预约设置</router-link>
              <router-link tag="span" to='#1'>交易设置</router-link>
              <router-link tag="span" to='#2'>会员设置</router-link>
              <router-link tag="span" to='#3'>提成设置</router-link>
              <router-link tag="span" to='#4'>角色设置</router-link>
              <router-link tag="span" to='#5'>通用设置</router-link>
            </div>
          </div>
        -->
        <div class="container_empty">
          <router-view></router-view>
        </div>
        
    </div>
</template>

<script>
export default {
  name:'GmSetIndex',
  data() {
    return {
    }
  },
  mounted(){

  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.gm_set_index {
  position: relative;
}
</style>


