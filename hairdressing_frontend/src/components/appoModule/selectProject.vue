<template lang="pug">
.g-selectpop(
  :style="{width: width}"
)
  el-popover.popover(
    style="{padding: 0!important}",
    placement="bottom-start"
    trigger="click"
    v-model="visible"
  )
    .customer_popover.no-list(
      v-show="!list.length"
    )
      .pop-tip 无数据
    .customer_popover.list-container(
      v-show="list.length"
    )
      .left
        ul.sort-list
          li.sort-item(
            v-for="(item, index) in list",
            :key="index",
            :class="[oneIndex === index ? 'active' : '']",
            @click="changeSort(item, index)"
          ) {{ item.levelOneName }}
      .right
        ul.pro-list
          li.pro-item(
            v-for="(item, index) in serviceList",
            :key="index",
            @click="changePro(item)"
          ) {{ item.name }}
      
    el-input(
      v-model="val",
      readOnly,
      :placeholder="placeholder",
      slot="reference"
    )

</template>
<script>
import * as api from '@/assets/js/interface'
export default {
  props: {
    placeholder: String,
    width: String,
    list: Array,
    levelId: Number,
    name1: String, // 一级分类名称
    name2: String, // 二级分类名称
    serviceIndex:Number
  },
  data() {
    return {
      val: null,
      visible: false, // 是否显示
      serviceList: [], // 服务列表
      oneIndex: null, // 所选择的一级分类下标
      oneName: null // 一级分类名称
    }
  },
  watch: {
    list(val) {
      // 一旦列表变了就默认选择第一个
      if (!!val.length) {
        this.changeSort(this.list[0], 0)
      }
    },
  },
  created() {
    this.val = this.name1
    if (this.name2) {
      for (let i = 0, len = this.list.length; i < len; i++) {
        if (this.name1 === this.list[i].levelOneName) {
          this.changeSort(this.list[i], i)
          for (let j = 0, len1 = this.list[i].serviceForAppointments.length; j < len1; j++) {
            this.changePro(this.list[i].serviceForAppointments[j])
          }
        }
      }
    }
  },
  methods: {
    choose(data) {
      this.visible = false
      this.val = data.name
    },
    // 改变分类
    changeSort(data, index) {
      this.oneIndex = index
      this.serviceList = data.serviceForAppointments
      this.oneName = data.levelOneName
    },
    // 改变服务项目
    changePro(data) {
      this.val = this.oneName + '/' + data.name
      // this.$emit('change', data.specification, this.serviceIndex, data.id)
      this.$emit('change', {'index': this.serviceIndex, ...data})
      this.$emit('input', data.name)
      this.visible = false
    }
  },
}
</script>
<style lang="scss" scoped>
  .el-popover.el-popper {
    .no-list {
      width: 220px;
    }
    .list-container {
      padding: 10px 0;
      width: 300px;
      height: 250px;
      display: flex;
      display: -webkit-flex;
      display: -moz-flex;
      display: -ms-flex;
      display: -o-flex;
      -webkit-flex-direction: row;
      -moz-flex-direction: row;
      -o-flex-direction: row;
      -ms-flex-direction: row;
      flex-direction: row;
      .left {
        width: 100px;
        .sort-list {
          .sort-item {
            box-sizing: border-box;
            padding: 10px 20px;
            width: 100%;
            position: relative;
            cursor: pointer;
            &:hover {
              background-color: #ecf5ff;
            }
            &.active {
              &:after {
                content: '';
                width: 10px;
                height: 10px;
                position: absolute;
                right: 0px;
                top: 49%;
                bottom: 0;
                -webkit-transform: rotate(135deg) translate(0, 50%);
                transform: rotate(135deg) translate(0, 50%);
                border-left: 2px solid #959595;
                border-top: 2px solid #959595;
                border-bottom-left-radius: 2px;
                border-bottom-right-radius: 2px;
              }
            }
          }
        }
      }
      .right {
        padding: 0px 0 10px 20px;
        flex: 1;
        -webkit-flex: 1;
        -moz-flex: 1;
        -ms-flex: 1;
        -o-flex: 1;
        box-sizing: border-box;
        overflow-y: auto;
        &::-webkit-scrollbar {/*滚动条整体样式*/
          width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
          height: 4px;
        }
        &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.2);
        }
        &::-webkit-scrollbar-track {/*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            border-radius: 0;
            background: rgba(0,0,0,0.1);
        }
        .pro-list {
          .pro-item {
            cursor: pointer;
            display: inline-block;
            padding: 10px 10px 5px 10px;
          }
        }
      }
    }
  }
</style>