<template>
  <div class="normal-input-wrapper">
    <input class="g-normal-input" :placeholder="placeholder" :value="value" :type="defaultType" @change="change" @input="onInput" :name="name"/>
    <i class="iconfont visiable" v-if="type === 'password'" @click="toggleVisiable">&#xe679;</i>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    placeholder: String,
    value: String,
    type: {
      type: String,
      default: 'text'
    },
  },
  data() {
    return {
      defaultType: this.type
    }
  },
  methods: {
    onInput() {
      this.value = event.target.value
    },
    change() {
      this.$emit('change', {
        name: this.name,
        value: event.target.value
      })
    },
    toggleVisiable() {
      this.defaultType = this.defaultType === 'password'? 'text': 'password'
    }
  }
}
</script>

<style lang="less" scoped>
.normal-input-wrapper {
  position: relative;
  .g-normal-input {
    width: 354px;
    height: 63px;
    padding: 9px 0 6px 5px;
    box-sizing: border-box;
    border-bottom: 1px solid #EBEBEB;
    font-size: 16px;
    &::-webkit-input-placeholder {
      color: #CCCCCC;
    }
  }
  .visiable {
    position: absolute;
    left: 338px;
    top: 50%;
    transform: translate(0, -50%);
    color: #CCCCCC;
    cursor: pointer;
  }
}
</style>