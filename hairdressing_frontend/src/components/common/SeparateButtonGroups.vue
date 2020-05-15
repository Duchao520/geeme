<template>
  <div class="box-wrap" v-if="computedList&&computedList.length">
    <div
      class="button"
      :class="{'active':item.value===value}"
      v-for="(item,index) in computedList"
      :key="index"
      @click="clickItem(item,index)"
      :title="item.name"
    >
      <span v-if="noNum">{{item.name}}</span>
      <span v-else>{{item.name}}（{{item.count}}）</span>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      value: [String, Number],
      list: Array,
      name: String,
      count: String,
      label: String,
      noNum: Boolean
    },
    computed: {
      computedList() {
        let arr = [];
        let list = this.list
        if (list.length === 0) {
          return []
        }
        list.forEach(element => {
          arr.push({
            name: element[this.name ? this.name : 'name'],
            count: element[this.count ? this.count : 'count'],
            value: element[this.label ? this.label : 'value']
          })
        });
        return arr
      }
    },
    methods: {
      clickItem(item, index) {
        this.$emit('input', item.value);
        this.$emit('change', item.value);
      }
    }
  };
</script>
<style lang="scss" scoped>
  @mixin button($color,$bg,$border) {
    border: 1px solid $border;
    color: $color;
    background: $bg;
    font-size: 12px;
    box-sizing: border-box;
    padding: 0 15px;
    border-radius: 14px;
    line-height: 26px;
    margin-right: 15px;
    cursor: pointer;
    height: 28px;
  }

  .box-wrap {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    box-sizing: border-box;

    .button {
      @include button(#666666, #fff, #ebebeb);
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 10px;
      transition: all 0.6s;
      &:hover{
        color: #409eff;
      }
    }

    .active {
      @include button(#FF6D61, #fff, #FF6D61)
    }
  }
</style>

