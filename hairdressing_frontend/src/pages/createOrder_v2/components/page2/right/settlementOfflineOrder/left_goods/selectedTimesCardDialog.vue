<template>
  <el-dialog 
    title="选择次卡/时间卡" 
    :visible="visible"
    append-to-body
    :close-on-click-modal="false"
    :before-close="close"
    width="800px"
  >
    <div class="card-list scrollbar">
      <!-- 次卡时间卡采用同一个组件， 不要用储值卡、身份卡组件 -->
      <singleOwnedTimeCard  
        v-bind="$attrs"
        v-for="(card, index) in list"
        :key="`${card.id}-${index}`"
        :card="card"
        :index="index"
        :detail="$attrs.detail"
        :goodsIndex="$attrs.index"
        v-model="currentCard"
        :isTimeOrCountCard="true"
      >
      </singleOwnedTimeCard>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleChanedCard">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import singleOwnedTimeCard from './singleOwnedTimeCard.vue';
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    checkedCard: {
      type: Object,
    },
    listInfo: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      list: [],
      currentCard: {}, // 选择
    }
  },
  created() { 
    this.currentCard = this.checkedCard
    this.list = (this.listInfo.listCustomerTimeCardDetail || []).concat(this.listInfo.listCustomerCountCardDetail || [])
  },
  methods: {
    handleChanedCard() {
      this.$emit('timeCardChanged', this.currentCard)
    },
    close() {
      this.$emit('close')
    },
  },
  components: { singleOwnedTimeCard }
}
</script>
<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";
.card-list {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  height: 60vh;
  overflow-y: auto;
}
</style>
