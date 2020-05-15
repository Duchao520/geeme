<template>
  <div class="select-item-sub">
    <label>
      <div class="porps-info" v-if="!hidden">{{spName}}</div>
      <el-select v-model="spId" placeholder="请选择" @change='handleOnChange'>
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </label>
  </div>
</template>
<script>
export default {
  // 此组件仅供编辑预约详情使用
  name: 'selectSpectification',
  data() {
    return {
      changed: this.hidden,
      spName: this.name,
      spId: this.id
    }
  },
  props: {
    // 规格名称
    name: {},
    // 规格id
    id: {},
    options: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    hidden(val) {
      this.changed = val
    },
    name(val) {
      this.spName = val
    },
    id(val) {
      this.spId = val
    },
  },
  methods: {
    handleOnChange(id) {
      this.$emit('changeSpId', {'specificationId': id, 'index': this.index})
    }
  }
}
</script>

<style scoped>
.select-item-sub {
  position: relative;
  display: inline-block;
  width: 220px;
  height: 40px;
}
.porps-info {
  position: absolute;
  width: 176px;
  height: 38px;
  top: 1px;
  left: 16px;
  background: #fff;
  line-height: 38px;
  text-align: left;
  z-index: 10;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.hidden {
  display: none;
}
</style>
 