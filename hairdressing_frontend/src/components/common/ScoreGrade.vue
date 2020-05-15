<template>
  <div>
    <span class="scores">
      <span
        class="scoresKey"
        v-for="(item) in number(score).arr_ok"
        :key="item+Math.random()"
      >
        <i class="icon iconfont icon-icon_order_smile"></i>
      </span>
      <span
        class="scoresValue"
        v-for="(item) in number(score).arr_no"
        :key="item+Math.random()"
      >
        <i class="icon iconfont icon-icon_order_cry"></i>
      </span>
    </span>
  </div>
</template>
<script>
export default {
  props: {
      score:Number
  },
  methods: {
    number(num) {
      var num = Math.round(num)
      var arr_ok = [],
        arr_no = [];
      for (let i = 0; i < num; i++) {
        arr_ok.push(i);
      }
      for (let i = 0; i < 5 - num; i++) {
        arr_no.push(i);
      }
      return { arr_ok, arr_no };
    }
  }
};
</script>
<style lang="scss" scoped>
.scores {
  margin-right: 23px;
  .scoresKey {
    color: #f52d56;
    margin-right: 5px;
  }
  .scoresValue {
    color: #c8c7cc;
    margin-right: 5px;
  }
}
</style>
