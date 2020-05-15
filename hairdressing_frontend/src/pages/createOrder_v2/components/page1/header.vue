<template>
  <div class="choose-person-header">
    <div class="left">
      <div class="title">{{title}}</div>
      <div class="back" @click="() => { $router.go(-1); }">关闭</div>
    </div>
    <div class="middle">
      <div class="level-box">
        <div 
          class="single-level" 
          v-for="level in list" 
          :key="Number(level.id)"
          :class="{active: Number(level.id) === superLevel }"
          @click="changLevelId(level.id)"
        >
          <span>{{level.name}}</span>
          <div class="active-line"></div>
        </div>
      </div>
    </div>
    <div class="right">
      <el-checkbox v-model="check" @change="checkBoxChanged">只显示30分钟内有空</el-checkbox>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    title: {
      type: String,
      default: '选择开单人',
    },
    superChecked: { // 30分钟
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      required: true
    },
    superLevel: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      check: false, // 30min
    }
  },
  created() {
    this.check = this.superChecked
  },
  methods: {
    checkBoxChanged() {
      this.$emit('limit30min', this.check)
    },
    changLevelId(id) {
      this.$emit('onChangeLevelId', id)
    }
  }
}
</script>
<style lang='scss' scoped>
.choose-person-header {
  height: 65px;
  width: 100%;
  min-width: 800px;
  background: #fff;
  position: fixed;
  top: 0;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}

.left {
  margin: 0 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .title {
    font-size: 18px;
    color: #333333;
    font-weight: 600;
    text-align: left;
  }
  .back {
    position: relative;
    font-size: 14px;
    color: #959595;
    cursor: pointer;
    text-indent: 12px;
    &:before {
      content: '';
      width: 7px;
      height: 7px;
      position: absolute;
      left: 3px;
      top: 6px;
      bottom: 0;
      transform: rotate(-45deg);
      border-left: 2px solid #959595;
      border-top: 2px solid #959595;
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
    }
  }
}
.middle {
  flex: 1;
  position: relative;
  height: 65px;
  .level-box {
    height: 65px;
    overflow: hidden;
    position: absolute;
    background: #fff;
    // border-bottom: 1px solid #333;
    top: 0;
    z-index: 1;
    &:hover {
      height: auto;
      overflow: auto;
    }
  }
  .single-level {
    display: inline-block;
    height: 65px;
    color: #999;
    line-height: 65px;
    position: relative;
    margin: 0 6px;
    cursor: pointer;
    .active-line {
      position: absolute;
      width: 100%;
      bottom: 0;
      height: 2px;
      background: #fff;
    }
  }
  .single-level.active {
    color: #333;
    .active-line {
      background: #2a2c44;
    }
  }
}
.right {
 margin: 0 20px;
}
</style>
