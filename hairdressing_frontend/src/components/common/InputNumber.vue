<template>
  <div class="root-wrap">
    <p class="subtract" @click="subtract" :class="{'disabled-button':value===min}" v-if="editable">
      <i style="margin-right:2px;" class="icon iconfont icon-icon_num_minus"></i>
    </p>
    <input class="input" type="number" v-model="num" @input="input" @keyup="keyUp" :disabled="!editable">
    <p class="add" @click="add" v-if="editable">
      <i style="margin-right:2px;" class="icon iconfont icon-icon_num_add"></i>
    </p>
  </div>
</template>
<script>
  export default {
    props: {
      value: {
        type: Number,
        default: 1
      },
      max: Number,
      min: Number,
      editable: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        num: ''
      };
    },
    created() {
      this.num = this.$props.value
    },
    watch: {
      value(val) {
        this.num = val;
      }
    },
    methods: {
      subtract() {
        if (this.value <= this.min) {
          return;
        }
        this.$emit("input", this.num - 1);
      },
      add() {
        if (this.value >= this.max) {
          return;
        }
        this.$emit("input", this.num + 1);
      },
      input(e) {
        let num = e.target.valueAsNumber;
        this.num = Math.round(num);
        if (isNaN(num) || num < 1) {
          this.num = 1;
          this.$emit("input", this.num);
        } else if (num > this.max) {
          this.num = this.max
          this.$emit("input", this.num);
        } else if (num <= this.min) {
          this.num = this.min
          this.$emit("input", this.num);
        }else{
          this.$emit("input", this.num);
        }
      },
      keyUp(e) {
        console.log(e);
      }
    }
  };
</script>
<style lang="scss" scoped>
  @mixin w-h {
    width: 32px;
    height: 32px;
  }

  .root-wrap {
    display: inline-flex;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    height: 32px;
    overflow: hidden;
    margin-top: 3px;

    .input {
      margin: 0;
      padding: 0;
      line-height: 32px;
      text-align: center;
      @include w-h;
      border: none;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
    }

    input {
      -moz-appearance: textfield;
    }

    .subtract,
    .add {
      @include w-h;
      text-align: center;
      line-height: 32px;
      font-size: 40px;
      transition: all 0.6s;
      box-sizing: border-box;
      border-left: 1px solid #dcdfe6;
      cursor: pointer;

      i {
        margin: 0;
        padding: 0;
        display: block;
        line-height: 32px;
      }

      &:hover {
        background: #cecece;
      }
    }

    .subtract {
      box-sizing: border-box;
      border-right: 1px solid #dcdfe6;
      border-left: none;
    }

    .disabled-button {
      cursor: not-allowed;
    }
  }
</style>
