<template lang="pug">
transition(
  name="fade"
)
  section.order-detail(
    v-if="show"
  )
    .order-detail-container.choose-appo
      .order-detail-header
        .title 选择订单
        .close(
          @click="close"
        )
          i.icon.iconfont.icon-icon_close
      .order-choose-body
        .order-choose-tip 查选的该顾客在本店有{{ num }}笔尚未服务订单，是否选择：
        .order-choose-list
          choose-list
      .footer
        .btn-group
          .group-item
            g-btn(
              :name="'确定'",
              :size="'large'",
              :type="'blue1'",
              :mark="'/shop-inner/appo/appo-time'",
            )
          .group-item
            g-btn(
              :type="'black'",
              :size="'large'",
              :name="'取消'",
              :mark="'/shop-inner/appo/appo-time'",
              @click="close"
            )
</template>
<script>
import ChooseList from '@/components/appoModule/chooseList'
export default {
  props: {
    show: Boolean,
    list: Object
  },
  data() {
    return {
      num: 1, // 未服务的订单
    }
  },
  components: {
    'choose-list': ChooseList
  },
  methods: {
    close() {
      this.$emit('close', 'showChooseDialog')
    },
    toOpera() {
      // 修改预约
      this.$emit('modify', '')
    }
  },
}
</script>
