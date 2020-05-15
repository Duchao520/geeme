<template>
  <div class="number-root" :style="{width:width?width:'40px',height:small?'30px':'40px'}">
    <el-input
      :disabled="disabled"
      @input="input"
      v-model="num"
      type="number"
      :style="sonStyle"
      :class="[widthClass>=200?'width':'',big?'big':'',small?'small':'']"
      @blur="blur"
      @focus="valueChanged = false"
      :placeholder="placeholder?placeholder:''"
      @keyup.native="keyUp"
      @mousewheel.native.prevent
      v-bind="$attrs"
    >
      <div v-if="slotObj.show" class="slot-append" slot="append">{{slotObj.name}}</div>
    </el-input>
    <div style="z-index:2">
      <slot name="append"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      value: Number,
      min: {
        type: Number,
        default: -100000
      },
      max: {
        type: Number,
        default: 10000000
      },
      width: String,
      // height: String,
      big: {
        type: Boolean,
        default: false
      },
      small: {
        type: Boolean,
        default: false
      },
      decimal: {
        /* 是否可以取小数（默认两位） */
        type: Boolean,
        default: true
      },
      placeholder: String,
      disabled: {
        type: Boolean,
        default: false
      },
      slotObj: {
        type: Object,
        default: () => {
          return {
            show: false
          }
        }
      },
      sonStyle: {
        type: String,
      },
      noBlur: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      if (this.value === null) {
        this.num = null;
      } else {
        this.num =
          this.value < this.min
            ? this.min
            : this.value > this.max
            ? this.max
            : this.value;
      }
    },
    computed: {
      widthClass() {
        return parseInt(this.width);
      }
    },
    watch: {
      value(val) {
        this.num = val;
        this.valueChanged = true;
      }
    },
    data() {
      return {
        num: 0,
        valueChanged: false
      };
    },
    methods: {
      input(val) {
        console.log(val)
        let num = Number(val);
        this.num = num;
        this.emit();
      },
      blur() {
        if (this.noBlur) return
        this.emit();
        if (this.valueChanged) {
          this.$emit("blur");
        }
      },
      emit() {
        console.log(this.num)
        let num = this.num;
        if (num === null && this.value === null) {
          return;
        } else if (num > this.max) {
          this.num = this.max;
          num = this.num;
        } else if (num < this.min) {
          this.num = this.min;
          num = this.min;
        } else {
          this.num = num;
        }
        this.num = this.decimal
          ? Number(
            (num + "").substr(
              0,
              (num + "")
                .substr(0)
                .split(".")
                .shift().length + 3
            )
          )
          : Math.round(num);
        this.$emit("input", this.num);
      },
      keyUp(e) {
        if (e.keyCode === 13) {
          this.emit();
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .number-root {
    display: flex;
    /deep/ .el-input__inner {
      flex: auto;
      padding-left: 3px;
      padding-right: 3px;
      box-sizing: border-box;
      text-indent: 4px;
    }
  }
  .width {
    /deep/ .el-input__inner {
      text-align: left;
      box-sizing: border-box;
      text-indent: 12px;
    }
  }
  .big {
    height: 40px;
    line-height: 100%;
  }
  .small {
    /deep/ .el-input__inner {
      height: 30px;
    line-height: 100%;
    }
  }
</style>
