<template lang="pug">
  button.btn(
    :title="title"
    :style="{ padding: padding }",
    type="button",
    :class="[type]"
    @click="clickBtn"
    v-bind="$attrs"
    :disabled="disabled"
    v-loading="btnLoad"
    element-loading-spinner="el-icon-loading"
    element-loading-text="加载中"
  )
    i.icon.iconfont(
      :class="['icon-'+icon]"
      :style="{fontSize: iconSize + 'px', margin: '0 ' + (iconSize/4) + 'px' }"
    )
    span.name(
      :style="{marginLeft: !!name && !noIcon ? '4px' : '0'}"
    ) {{ name }}
</template>
<script>
export default {
  props: {
    name: String,
    type: {
      type: String,
      default: "green"
    },
    title: {
      type: String,
      default: ""
    },
    mark: {
      type: String,
      default: ""
    },
    icon: String,
    status: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    padding: {
      type: String,
      default: ""
    },
    iconSize: Number,
    noIcon: {
      type: Boolean,
      default: false
    },
    btnLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    clickBtn() {
      if (!!this.mark) {
        this.$emit("click", {
          mark: this.mark,
          status: !this.status
        });
      } else {
        this.$emit("click", !this.status);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.btn {
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 5px;
  font-size: 12px;
  border-radius: 3px;
  min-width: 32px;
  min-height: 29px;
  cursor: pointer;
  transition: all 0.4s;
  white-space: nowrap;
  .icon {
    font-size: 16px;
    vertical-align: middle;
  }
  // .font-size-12 {
  //   font-size: 12px;
  //   margin: 0 2px;
  // }
  .name {
    vertical-align: middle;
  }
}
.green {
  color: #75c74f;
  background: #fff;
  border: 1px solid #75c74f;
  &:hover {
    color: #fff;
    background: #6dbb4a;
  }
  &:active {
    color: #fff;
    background: #63b141;
  }
}
.greenFill {
  color: #fff;
  background: #75C74F;
  border: 1px solid #75C74F;
  &:hover {
    background: #6dbb4a;
    border-color: #6dbb4a;
  }
  &:active {
    background: #61AD3F;
    border-color: #61AD3F;
  }
}
.red {
  color: #f52d56;
  background: #fff;
  border: 1px solid #f52d56;
  &:hover {
    color: #fff;
    background: #f52d56;
    border: 1px solid #f52d56;
    .icon {
      color: #fff;
    }
    &:hover {
      background: #e02047;
    }
    &:active {
      background: #d11d42;
    }
  }
  &:active {
    color: #fff;
    background: #6dbb4a;
  }
}
.open-bill {
  color: #fff;
  background: #f52d56;
  border-color: #f52d56;
  &:hover {
    background: #e02047;
    border-color: #e02047;
  }
  &:active {
    background: #d11d42;
    border-color: #d11d42;
  }
}
.mgreenFill {
  color: #fff;
  background: #41cac0;
  border: 1px solid #41cac0;
  &:hover {
    // color: #41cac0;
    background: #39b2a9;
  }
  &:active {
    color: #fff;
    background: #2fa39b;
  }
}
.mgreen {
  color: #41cac0;
  background: #fff;
  border: 1px solid #41cac0;
  &:hover {
    color: #fff;
    background: #41cac0;
  }
  &:active {
    color: #fff;
    background: #6dbb4a;
  }
}
.orange {
  color: #ff6d61;
  background: #fff;
  border: 1px solid #ff6d61;
  &:hover {
    color: #fff;
    background: #ff6d61;
  }
  &:active {
    color: #fff;
    background: #6dbb4a;
  }
}
.orange-yellow {
  color: #fff;
  background: #fcb322;
  border: 1px solid #ff6d61;
  &:hover {
    background: #f0a91c;
  }
  &:active {
    background: #e39e17;
  }
}
.orangeFill {
  color: #fff;
  background: #ff6d61;
  border: 1px solid #ff6d61;
}
.cancel{
   color: #bec3c6;
   background: #fff;
   border: 1px solid #bec3c6;
   &:hover {
     color: #fff;
     background: #bec3c6;
   }
   &:active {
     color: #fff;
     background: #adb6bb;
   }
 }
.delete {
  color: #bbbbbb;
  background: #fff;
  border: 1px solid #bec3c6;
  &:hover {
    color: #fff;
    background: #bec3c6;
  }
  &:active {
    color: #fff;
    background: #adb6bb;
  }
}
.deepGrey {
  color: #7f7f7f;
  background: #fff;
  border: 1px solid #7f7f7f;
  &:hover {
    color: #fff;
    background: #7f7f7f;
  }
  &:active {
    color: #fff;
    background: #6dbb4a;
  }
}
.lgreyFill {
  color: #676868;
  background: #f4f5f7;
  border: 1px solid #f4f5f7;
}
.detail {
  color: #58c9f3;
  background: #fff;
  border: 1px solid #58c9f3;
  &:hover {
    color: #fff;
    background: #58c9f3;
  }
  &:active {
    color: #fff;
    background: #53bee6;
    border-color: #53bee6;
  }
}
.remark {
  color: #777777;
  background: #fff;
  border: 1px solid #e0e3e9;
  &:hover {
    color: #fff;
    background: #bec3c6;
    border-color: #bec3c6;
  }
  &:active {
    color: #fff;
    background: #adb6bb;
    border-color: #adb6bb;
  }
}
.offShelf {
  color: #676868;
  background: #F4F5F7;
  border: 1px solid #F4F5F7;
  i {
    color: #333333;
  }
}
.recommend {
  color: #ffffff;
  background: #58C9F3;
  border: 1px solid #58C9F3;
  &:hover {
    background: #53BEE6;
    border-color: #53BEE6;
  }
  &:active {
    background: #54B1D3;
    border-color: #54B1D3;
  }
}
  .grey{
    color: #676868;
    background: #F4F5F7;
    border: 1px solid #F4F5F7;
    &:hover {
      background: #EDF0F5;
      border-color: #EDF0F5;
    }
    &:active {
      background: #E1E4EA;
      border-color: #E1E4EA;
    }
  }
</style>
