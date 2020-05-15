<template>
  <div>
    <div class="step">
      <order-steps-item
        v-for="(step,index) in steps"
        :key="index"
        :itemInfo="step"
        :location="index===0?'zero':(index===steps.length-1?'last':'middle')"
        :titleColor="step.titleColor"
        :timeColor="step.timeColor"
        :successColor="step.successColor"
        :showIconDefault="step.showIconDefault"
        :icon="step.icon"
      ></order-steps-item>
    </div>
  </div>
</template>
<script>
import OrderStepsItem from "@/components/orderManagement/OrderStepsItem";
export default {
  components: {
    "order-steps-item": OrderStepsItem
  },
  props: {
    steps: Array,
  },
};
</script>
<style lang="scss" scoped>
.step {
  display: flex;
  flex: auto;
}
</style>
