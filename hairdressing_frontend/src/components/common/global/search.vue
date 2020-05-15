<template lang="pug">
  .g-search
    el-input.search-input(
      :placeholder="placeholder",
      v-model="keyword",
      :clearable='clearable'
      class="input-with-select"
      @keyup.enter.native="search"
    )
      el-button.search-btn(
        slot="append",
        @click="search"
      )
        i.icon.iconfont.icon-icon_search
</template>
<script>
export default {
  name: 'g-search',
  props: {
    placeholder: String,
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      keyword: ''
    }
  },
  watch: {
    keyword: {
      handler: function (val, old) {
        if( val == ''){
          this.$emit('search', this.keyword)
        }
      }
    }
  },
  methods: {
    search() {
      this.$emit('search', this.keyword)
    },
    resetKeyWord() {
      this.keyword = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.g-search {
  .search-btn {
    background: #58C9F3;
    border-color: #58C9F3;
    .icon {
      color: #fff;
    }
  }
}
</style>
