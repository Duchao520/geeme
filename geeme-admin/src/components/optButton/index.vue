<template>
  <!-- 此组件为表格内部专用操作按钮 -->
  <a-button ghost type="primary" :style="finalInfo.style" @click="onClick" :size="size" :loading="loading">
    <i class="iconfont" v-html="finalInfo.icon" v-show="!loading" style='margin-right: 5px'></i>
    {{finalInfo.title}}
  </a-button>
</template>

<script>
export default {
  props: {
    type: String,
    loading: {
      type: Boolean,
      default: false
    },
    label: String,
    size: String
  },
  data() {
    return {
      // title: "编辑",
      // icon: "&#xe677;",
      // style: {
      //   color: "#58C9F3",
      //   borderColor: "#58C9F3",
      //   margin: "0 5px",
      //   padding: '0 7px'
      // }
    };
  },
  created() {
    // this.titleFormatter(this.type);
  },
  computed: {
    finalInfo () {
      switch (this.type) {
        case "edit":
          return {
            style: {
              color: '#58C9F3',
              borderColor: '#58C9F3',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '编辑',
            icon: '&#xe677;'
          }
        case "delete":
          return {
            style: {
              color: '#BEC3C6',
              borderColor: '#BEC3C6',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '删除',
            icon: '&#xe676;'
          }
        case "recovery":
          return {
            style: {
              color: '#75C74F',
              borderColor: '#75C74F',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '恢复',
            icon: '&#xe683;'
          }
        case "detail":
          return {
            style: {
              color: '#58C9F3',
              borderColor: '#58C9F3',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '详情',
            icon: '&#xe679;'
          }
        case "open":
          return {
            style: {
              color: '#75C74F',
              borderColor: '#75C74F',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '开启',
            icon: '&#xe6dc;'
          }
        case "auth":
          return {
            style: {
              color: '#75C74F',
              borderColor: '#75C74F',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '认证',
            icon: '&#xe6e3;'
          }
        case "deletePhoto":
          return {
            style: {
              color: '#000',
              borderColor: '#E0E3E9',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '删除',
            icon: '&#xe676;'
          }
        case "export":
          return {
            style: {
              color: '#41CAC0',
              borderColor: '#41CAC0',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '导出Excel',
            icon: ''
          }
        case "aduit":
          return {
            style: {
              color: '#41CAC0',
              borderColor: '#41CAC0',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '提交审核',
            icon: ''
          }
        case "release":
          return {
            style: {
              color: '#58C9F3',
              borderColor: '#58C9F3',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '发布',
            icon: '&#xe719;'
          }
        case "revoke":
          return {
            style: {
              color: '#75C74F',
              borderColor: '#75C74F',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '发布',
            icon: '&#xe683;'
          }
        case "aduitSolid":
          return {
            style: {
              color: '#fff',
              borderColor: '#41CAC0!important',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '提交审核',
            icon: ''
          }
        case "releaseSolid":
          return {
            style: {
              color: '#fff',
              borderColor: '#58C9F3',
              background: '#58C9F3!important',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '发布',
            icon: '&#xe719;'
          }
        case "disabled":
          return {
            style: {
              color: '#FF6D61',
              borderColor: '#FF6D61',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '禁用',
            icon: '&#xe681;'
          }
        case "revokeSolid":
          return {
            style: {
              color: '#fff',
              borderColor: '#75C74F',
              background: '#75C74F!important',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '撤销',
            icon: '&#xe683;'
          }
        case "resend":
          return {
            style: {
              color: '#fff',
              borderColor: '#58C9F3',
              background: '#58C9F3!important',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '重发',
            icon: '&#xe719;'
          }
        case "bind":
          return {
            style: {
              color: '#333',
              borderColor: '#666',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: this.label,
            icon: ''
          }
        case "renewal":
          return {
            style: {
              color: '#41CAC0',
              borderColor: '#41CAC0',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '续期',
            icon: '&#xe71a;'
          }
        case "newCoupon":
          return{
            style: {
              color: '#41CAC0',
              borderColor: '#41CAC0',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '新开券'
          }
        case "attendCoupon":
          return{
            style: {
              color: '#FC9939',
              borderColor: '#FC9939',
              margin: "0 5px",
              padding: '0 7px'
            },
            title: '续期券'
          }
      }
    }
  },
  methods: {
    // titleFormatter(type) {
    //   switch (type) {
    //     case "edit":
    //       this.style.color = "#58C9F3";
    //       this.style.borderColor = "#58C9F3";
    //       this.title = "编辑";
    //       this.icon = "&#xe677;";
    //       break;
    //     case "delete":
    //       this.style.color = "#BEC3C6";
    //       this.style.borderColor = "#BEC3C6";
    //       this.title = "删除";
    //       this.icon = "&#xe676;";
    //       break;
    //     case "recovery":
    //       this.style.color = "#75C74F";
    //       this.style.borderColor = "#75C74F";
    //       this.title = "恢复";
    //       this.icon = "&#xe683;";
    //       break;
    //     case "detail":
    //       this.style.color = "#58C9F3";
    //       this.style.borderColor = "#58C9F3";
    //       this.title = "详情";
    //       this.icon = "&#xe679;";
    //       break;
    //     case "auth":
    //       this.style.color = "#75C74F";
    //       this.style.borderColor = "#75C74F";
    //       this.title = "认证";
    //       this.icon = "&#xe6e3;";
    //       break;
    //     case "deletePhoto":
    //       this.style.color = '#000000';
    //       this.style.borderColor = "#E0E3E9";
    //       this.title = "删除";
    //       this.icon = "&#xe676;";
    //       break;
    //     case "export":
    //       this.style.color = '#41CAC0';
    //       this.style.borderColor = "#41CAC0";
    //       this.title = "导出Excel";
    //       this.icon = "";
    //       break;
    //     case "aduit":
    //       this.style.color = '#41CAC0';
    //       this.style.borderColor = "#41CAC0";
    //       this.title = "提交审核";
    //       this.icon = "";
    //       break;
    //     case "release":
    //       this.style.color = '#58C9F3';
    //       this.style.borderColor = "#58C9F3";
    //       this.title = "发布";
    //       this.icon = "&#xe719;";
    //       break;
    //     case "revoke":
    //       this.style.color = '#75C74F';
    //       this.style.borderColor = "#75C74F";
    //       this.title = "撤销";
    //       this.icon = "&#xe683;";
    //       break;
    //     case "aduitSolid":
    //       this.style.color = '#fff';
    //       this.style.borderColor = "#41CAC0";
    //       this.style.background = "#41CAC0!important";
    //       this.title = "提交审核";
    //       this.icon = "";
    //       break;
    //     case "releaseSolid":
    //       this.style.color = '#fff';
    //       this.style.borderColor = "#58C9F3";
    //       this.style.background = "#58C9F3!important";
    //       this.title = "发布";
    //       this.icon = "&#xe719;";
    //       break;
    //     case "revokeSolid":
    //       this.style.color = '#fff';
    //       this.style.borderColor = "#75C74F";
    //       this.style.background = "#75C74F!important";
    //       this.title = "撤销";
    //       this.icon = "&#xe683;";
    //       break;
    //     case "bind":
    //       this.style.color = '#333333';
    //       this.style.borderColor = "#666666";
    //       this.title = this.label;
    //       this.icon = "";
    //       break;
    //     case "renewal":
    //       this.style.color = '#41CAC0';
    //       this.style.borderColor = "#41CAC0";
    //       this.title = "续期";
    //       this.icon = "&#xe71a;";
    //       break;
    //   }
    // },
    onClick() {
      this.$emit("click");
    }
  },
  watch: { }
};
</script>

<style lang="less" scoped>
</style>
