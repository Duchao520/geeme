<template>
  <div class="class-item">
    <div class="info">
      <G-NumInput :value="data.sortNo" :id="data.id" @blur="onBlur"/>
      <img :src="utils.imgFormatter(data.icon)">
      <p>{{data.name}}</p>
    </div>
    <div class="profession" v-if="level === 1">
      {{formatProfession(data.professionList)}}
    </div>
    <div class="operation">
      <i class="iconfont" @click="edit">&#xe677;</i>
      <i class="iconfont" @click="del">&#xe676;</i>
    </div>
  </div>
</template>

<script>
import utils from '@/utils'
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    level: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      utils,
    };
  },
  methods: {
    formatProfession(list) {
      let str = ''
      if (list == null) { return str }
      for (let i of list) {
        str += `${i.name} `
      }
      return str
    },
    edit() {
      this.$emit('edit', {
        id: this.data.id,
        level: this.data.parentId === 0? 'one': 'two'
      })
    },
    del() {
      if (this.data.subClass instanceof Array && this.data.subClass.length > 0) {
        this.$warning({
          title: '暂时不能删除',
          content: '须先删除该分类下方的二级分类',
          okText: '确定',
          centered: true,
        })
        return false
      }
      this.$confirm({
        title: '确定要删除吗？',
        content: '删除后，该分类不可恢复！',
        okText: '确认',
        cancelText: '取消',
        centered: true,
        onOk: this.emitDelete
      })
    },
    emitDelete() {
      this.$emit('delete', this.data.id)
    },
    onBlur(data) {
      data.sortNo = data.value
      this.$emit('blur', data)
    }
  }
};
</script>

<style lang="less" scoped>
.class-item {
  display: flex;
  align-items: center;
  min-height: 60px;
  div {
    flex: 1;
  }
  .info {
    display: flex;
    align-items: center;
    padding: 0 0 0 10px;
    img {
      margin: 0 10px;
      width: 40px;
      height: 40px;
    }
    p {
      width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .profession {
    word-break: keep-all;
  }
  .operation {
    text-align: right;
    padding: 0 22px 0 0;
    i {
      cursor: pointer;
      &:first-child {
        color: #58c9f3;
        margin: 0 15px 0 0;
      }
      &:last-child {
        color: #bec3c6;
      }
    }
  }
}
</style>