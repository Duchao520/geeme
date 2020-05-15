<template lang="pug">
  section.sub-header
    .header-left
      el-button.first(
        v-show="first",
        type="primary",
        @click="btnClick('first')"
      ) {{ first }}
      el-button.second(
        v-show="second",
        type="primary",
        @click="btnClick('second')"
      ) {{ second }}
      // g-gradbtn(
      //   v-show="third",
      //   :mark="'third'",
      //   :title="third",
      //   :icon="'icon_add'",
      //   @click="btnClick"
      // )
      RedButton(
        v-show="third"
        buttonText="快速预约" 
        @click="thirdBtnClick"
      )
    // 下拉部分
    .header-middle.select(
      v-show="selectname"
    )
      el-select(
        v-model="select",
        :placeholder="selectname",
        :popper-append-to-body="false"
        @change="changeSelect"
      )
        el-option(
          v-for="item in selectlist",
          :key="item.id",
          :label="item.name",
          :value="item.id"
        )
    .header-right.search(
      v-show="sname"
    )
      input-search(
        :placeholder="sname",
        width="auto"
        v-model="keyword"
        v-on="$listeners"
      )
    .header-right.list(
      v-show="list"
    )
      ul.right-list
        li.list-item(
          v-for="item in list"
        ) 
          span.dot(
            :class="item.dot"
          )
          span.name {{ item.name }}
    .clearfix
</template>
<script>
import RedButton from './RedButton.vue'
export default {
  components: { RedButton },
  props: {
    first: String, // 第一个按钮的名称
    second: String, // 第二个按钮的名称
    third: String, // 第三个按钮的名称
    sname: String, // 搜索框内容
    selectname: String, // 下拉框内容
    list: Array, // 预约状态点列表
    selectlist: Array, // 下拉框列表
    selectId: {
      type: [Number, String],
      default: null
    } // 默认下拉的id
  },
  data() {
    return {
      keyword: '',
      select: ''
    }
  },
  watch: {
    selectId(val) {
      this.select = val
    }
  },
  created() {
    // this.select = this.selectId
  },
  methods: {
    btnClick(type) { 
      this.$emit('click', type)
    },
    thirdBtnClick() {
      this.$emit('toSuper', 'addNewAppo')
    },
    // // 搜索
    // search(data) {
    //   this.$emit('search', data)
    // },
    // 中间的下拉
    changeSelect(data) {
      this.$emit('select', data)
    }
  },
}
</script>
<style lang="scss" scoped>
  .clearfix {
    clear: both;
  }
  @mixin btn-style {
    width: 92px;
    height: 35px;
    padding: 0;
    line-height: 35px;
}
  .sub-header {
    padding: 20px;
    .header-left {
      float: left;
      .first {
        background: #58C9F3;
        border-color: #58C9F3;
        @include btn-style
      }
      .second {
        background: #75C74F;
        border-color: #75C74F;
        margin-left: 20px;
        @include btn-style
      }
      .third {
        width: 140px;
        height: 40px;
        border: none;
        background: -webkit-gradient(linear, right top, left top, from(#FB598F), to(#F52D56));
        background: linear-gradient(to left, #FB598F, #F52D56);
        color: #fff;
        font-size: 16px;
        outline: none;
        border-radius: 20px;
        margin: 0px 34px 0 20px;
        cursor: pointer;
        padding-left: 12px;
        line-height: 40px;
        .icon {
          width: 17px;
          height: 17px;
          vertical-align: middle;
          margin-left: 12px;
          color: #fff;
          font-size: 14px;
          padding: 4px;
          border-radius: 50%;
          background: #F6315B;
        }
      }
    }
    .header-middle {
      margin-left: 20px;
      float: left;
    }
    .header-right {
      float: right;
      &.list {
        margin-top: 22px;
        .right-list {
          .list-item {
            display: inline-block;
            font-size: 12px;
            .dot {
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              margin-right: 8px;
              &.lan {
                background: #92DCF8;
              }
              &.lu {
                background: #A0DC85;
              }
              &.huang {
                background: #F4D552;
              }
              &.hei {
                background: #707171;
              }
              &.hui {
                background: #BEC3C6;
              }
            }
            .name {
              margin-right: 12px;
            }
            &:last-child {
              .name {
                margin-right: 0;
              }
            }
          }
        }
      }
      
    }
  }
</style>