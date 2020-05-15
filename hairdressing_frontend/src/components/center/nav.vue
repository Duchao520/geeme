<template lang="pug">
  .center-nav__wrap(
    v-show="!!list"
  )
    ul.nav-list
      li.nav-item(
        v-for="item in list",
        :key="item.id",
        :class="current === item.id&&list.length>1 ? ['active','active-b'] :(current === item.id&&list.length===1)?['active']:'' ",
        @click="changeNav(item)"
      ) {{ strSlice(item.name) }}
</template>
<script>
export default {
  props: {
    current: [Number, String],
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    changeNav(item) {
      this.$emit('click', item)
    },
    strSlice(str){
      return str.length>10?str.slice(0,10)+'...':str
    }
  },
}
</script>