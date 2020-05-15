<template>
  <ul class="renewal-card-list">
    <renewalCardSingle 
      v-for="renewalCard in list" 
      :key="renewalCard.customerCardId" 
      :cardInfo="renewalCard"
      @chooseCard="chooseCard"
      :type="type"
      :useful="useful"
    />
  </ul>
</template>
<script>
import renewalCardSingle from './renewalCardSingle.vue';
export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    type: String,
    useful: {
      type: Boolean,
      default: true
    }
  },
  components: { renewalCardSingle },
  methods: {
    chooseCard(item, event, bool) {
        this.$emit("chooseCard", item, event, bool);
      },
  },
}
</script>
<style lang='scss' scoped>
.renewal-card-list {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-y: auto;
  padding: 10px 0;
  box-sizing: border-box;
}
</style>
