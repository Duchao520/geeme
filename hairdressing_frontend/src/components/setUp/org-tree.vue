<template>
  <el-tree
    @node-click="handleNodeClick"
    :class="className"
    :data="treeData"
    :props="label"
    :accordion="accordion"
    :highlight-current="highlight"
    :default-expand-all="expand"
    :check-on-click-node="checkOn"
    :show-checkbox="checkbox"
  >
  </el-tree>
</template>

<script>
export default {
  name: this.className,
  props: {
    className: {
      type: String,
      default: 'gm-tree'
    },
    // 是否只能展开一个节点
    accordion: {
      type: Boolean,
      default: false
    },
    // 默认是否展开所有节点
    expand: {
      type: Boolean,
      default: false
    },
    // 默认是否展开所有节点
    highlight: {
      type: Boolean,
      default: false
    },
    // 是否显示复选框
    checkbox: {
      type: Boolean,
      default: false
    },
    // 是否可选中(依赖复选框)
    checkOn: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      required: true
    },
    label: {
      type: Object,
      default: () => {
        return {
          children: 'list',
          label: 'name'
        }
      }
    },
  },
  data () {
    return {}
  },
  methods: {
    handleNodeClick(data) {
      this.$emit(this.className, {
        nodeId: data.id,
        nodeName: data.tagName,
        nodeTag: data.desc === 'office' ? 'HeadQ' : (data.desc === 'shop' ? 'Shop' : 'Area'),
        nodeDesc: data.desc
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
 