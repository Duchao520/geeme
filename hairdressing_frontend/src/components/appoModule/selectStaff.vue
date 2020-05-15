<template lang="pug">
.g-selectpop(
  :style="{width: width}"
  class="root"
)
  el-input(
    v-show="disabled",
    v-model="value",
    readOnly,
    disabled,
    :placeholder="placeholder",
  )
  el-popover.popover(
    style="{padding: 0!important}",
    placement="bottom-start"
    trigger="click"
    v-model="visible"
  )
    .customer_popover(
      v-show="!list.length"
    )
      .pop-tip 无数据
    .customer_popover.menu-list(
      v-show="list.length"
    )
      el-menu
        el-submenu(
          v-for="(series,index) in list",
          :key="index",
          :index="series.name"
        ) 
          template(
            slot="title"
          ) 
            span {{ series.name }}
          el-menu-item(
            v-for="(item,index) in series.staffList",
            :key="index",
            :index="item.name",
            @click="choose(item)"
          ) {{ item.name }}
    el-input(
      v-show="!disabled"
      v-model="value",
      readOnly,
      :placeholder="placeholder",
      slot="reference"
    )

</template>
<script>
export default {
  props: {
    placeholder: String,
    width: String,
    val: String,
    list: Array,
  },
  data() {
    return {
      value: this.val,
      visible: false, // 是否显示
    }
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo
    },
    clickEnter(){
      return this.$store.state.manage.operate.clickEnter
    },
    disabled() {
      return this.clickEnter === 'edit'
    }
  },
  watch: {
    val(val) {
      console.log('监听到数据变化')
      this.value = val
    }
  },
  created() {
    if (this.clickEnter === 'edit' || this.clickEnter === 'modify') {
      this.value = this.val || this.currentInfo.staffName
    }
  },
  methods: {
    choose(data) {
      this.visible = false
      this.value = data.name
      this.$emit('change', data);
      this.$emit('input', data.id);
    }
  },
}
</script>
<style lang="scss" scoped>
  .el-popover.el-popper {
    .customer_popover {
      width: 220px;
      cursor: pointer;
    }
  }
  .root{
    cursor: pointer
  }
</style>