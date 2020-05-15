<template>
  <div class="wrapper">
    <a-tree
    checkable
    defaultExpandAll
    :treeData="treeData"
    @check="onCheck"
    :checkStrictly = true
    :checkedKeys = checkedKeys
  >
    <template slot="custom" slot-scope="{entry, title}">
      <div><span style="margin-right: 36px;">{{title}}</span>
         <a-checkbox 
          v-for="item in entry" 
          :key="item.name" 
          :name="item.name" 
          @click="onChange"
          :checked="item.permission"
         >{{item.title}}</a-checkbox>
      </div>
    </template>
  </a-tree>
  </div>
</template>

<script>
// import mockRole from "@/temp";
const authTree = require('@/temp/authTree.json')
export default {
  data () {
    return {
      treeData: authTree.children,
      /* defaultCheckedKeys: [], */
      checkedKeys: {
        checked: [],
        halfChecked: [],
      },
    }
  },
  created() {
   this.searchTree(this.treeData) 
  },
  methods: {
    searchTree(tree, parentName = null) {
      for (let i of tree) {
        i.key = i.name
        i.scopedSlots = {title: 'custom'}
        if (i.permission) { this.checkedKeys.checked.push(i.name) }
        if (i.children.length !== 0) {
          this.searchTree(i.children, i.name)
        }
      }
    },
    setEntryData(tree, name) {
      for (let i of tree) {
        i.entry.forEach((j) => {
          if (j.name === name) {
            j.permission = !j.permission
          }
        })
        if (i.children.length !== 0) {
          this.setEntryData(i.children, name)
        }
      }
    },
    setPageData(tree, list) {
      for (let i of tree) {
        if (list.indexOf(i.name) > -1) {
          i.permission = true
        } else {
          i.permission = false
        }
        if (i.children.length !== 0) {
          this.setPageData(i.children, list)
        }
      }
    },
    onChange(e) {
      let name = e.target.name
      this.setEntryData(this.treeData, name)
    },
    onCheck(checkedKeys, info) {
      console.log(info)
      console.log(checkedKeys)
      // this.defaultCheckedKeys = checkedKeys
      //this.setPageData(this.treeData, this.checkedKeys)
    },
  },
}

</script>

<style lang="less" scoped>
</style>