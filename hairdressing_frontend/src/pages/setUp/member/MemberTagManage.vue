<template>
  <div class="member-tag-manage">
    <h6>品牌默认标签</h6>
    <div class="tags">
      <el-tag
        v-for="(tag,index) in tags"
        :key="index"
        closable
        @close="handleClose(tag)"
      > {{tag.name}}
      </el-tag>
    </div>
    <button><span class="icon iconfont icon-icon_ope_append"></span><span>新增标签</span></button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tags: [
          {name: '标签一'},
          {name: '标签二'},
          {name: '标签三'},
          {name: '标签四'},
          {name: '标签五'}
        ]
      };
    },
    methods:{
      handleClose(tag){
        console.log(tag);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .member-tag-manage {
    box-sizing: border-box;
    padding: 0 20px 20px;

    h6 {
      font-size: 16px;
      color: #333333;
      line-height: 1;
    }

    .tags {
      padding-top: 20px;

      .el-tag {
        width: 78px;
        height: 28px;
        border-radius: 17px;
        border: 1px solid rgba(206, 212, 218, 1);
        background: transparent;
        font-size: 12px;
        line-height: 26px;
        color: #666666;
        position: relative;
        margin: 0 15px 15px 0;
        /deep/ .el-tag__close{
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(40%,-40%);
          background: #D8D8D8;
          color: #fff;
          display: none;
        }
        &:hover{
          /deep/ .el-tag__close{
            display: inline-block;
          }
        }
      }
    }

    button{
      color: #58C9F3;
      .iconfont{
        margin-right: 3px;
      }
    }
  }
</style>
