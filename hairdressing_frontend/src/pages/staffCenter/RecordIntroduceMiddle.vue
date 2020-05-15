/** 
  品牌员工服务档案+品牌进入门店员工档案动态组件
*/
<template>
  <component :is="componentId"></component>
</template>
<script>
import brandIntroduce from './RecordIntroduce'
import shopIntroduce from './shopStaffAdd'
export default {
  data() {
    return {
      type: this.$route.params.jobType
    }
  },
  computed: {
    componentId() {
      let componentId = this.type =='-1' ? 'brandIntroduce' : 'shopIntroduce'
      return componentId
    }
  },
  components: {
    brandIntroduce,
    shopIntroduce
  }
}
</script>
