<template>
  <el-dialog 
    title="选择身份卡" 
    :visible="visible"
    append-to-body
    :close-on-click-modal="false"
    :before-close="close"
    width="800px"
  >
    <div class="card-list scrollbar">
      <singleOwnedIdentityCard
        v-for="card in list"
        :key="`${card.customerCardId}-${+(new Date())}`"
        :card="card"
        :cardType="0"
        v-model="currentCard"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleChanedCard">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapActions, mapState } from "vuex";
import singleOwnedIdentityCard from './singleOwnedIdentityCard.vue';
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    list: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      currentCard: {}, // 选择
    }
  },
  created() { 
    this.currentCard = JSON.parse(JSON.stringify(this.billInfo.selectedIdentityCardForPay))
  },
  methods: {
    ...mapActions([
      'setSelectedPrepaidCardForPay',
      'setSelectedIdentityCardForPay',
    ]),
    handleChanedCard() {
      this.setSelectedIdentityCardForPay(this.currentCard) // 修改身份卡状态
      if (this.currentCard.customerCardId) {
        this.setSelectedPrepaidCardForPay({customerCardId: null}) // 如果身份卡选择了， 清空选择的储值卡
      }
    },
    close() {
      this.$emit('close')
    },
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo
    }),
  },
  watch: {
    'billInfo.selectedIdentityCardForPay': {
      handler: function(v, o) {
        console.log('')
        console.log('in selectedIdentityCardForPay watcher...')
        this.currentCard = JSON.parse(JSON.stringify(v))
      },
      deep: true,
      immediate: true,
    }
  },
  components: { singleOwnedIdentityCard }
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
