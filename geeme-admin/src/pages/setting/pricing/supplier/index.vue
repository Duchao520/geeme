<template>
  <div class="supplier-price-wrapper">
    <a-button-group>
      <a-button :type="type === 'new'? 'primary': ''" style="width: 98px;" @click="toggleType">新购</a-button>
      <a-button :type="type === 'renewal'? 'primary': ''" style="width: 98px;" @click="toggleType">续费</a-button>
    </a-button-group>
    <NewMerchant v-show="type === 'new'" />
    <RenewalMerchant v-show="type === 'renewal'" />
  </div>
</template>

<script>
import RenewalMerchant from './components/renewal'
import NewMerchant from './components/new'
export default {
  components: {
    NewMerchant,
    RenewalMerchant
  },
  data() {
    return {
      type: 'new' // new || renewal
    }
  },
   methods: {
    toggleType() {
      this.type = this.type === 'new'? 'renewal': 'new'
    }
  }
}
</script>

<style lang="less" scoped>
.supplier-price-wrapper {
  height: 100%;
  overflow-y: auto;
  .common-scrollbar();
  padding: 30px 20px 40px 20px;
}
</style>