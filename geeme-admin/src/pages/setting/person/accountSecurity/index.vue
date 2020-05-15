<template>
  <div class="account-security-wrapper">
    <!-- 手机 -->
    <div class="item">
      <div class="title">
        <i class="iconfont done">&#xe6a1;</i>
        <span>绑定手机</span>
      </div>
      <div class="info">
        已绑定手机：135****2250若已停用或丢失，请立即更换，避免账户被盗。
        <G-OptButton type="bind" label="修改绑定" size="small" style="margin: 0 0 0 13px;"/>
      </div>
    </div>
    <!-- 邮箱 -->
    <div class="item">
      <div class="title">
        <i class="iconfont undone">&#xe6a7;</i>
        <span>绑定邮箱</span>
      </div>
      <div class="info">
        未绑定邮箱。
        <G-OptButton type="bind" label="立即绑定" size="small" style="margin: 0 0 0 13px;"/>
      </div>
    </div>
    <!-- 微信 -->
    <div class="item">
      <div class="title">
        <i class="iconfont undone">&#xe6a7;</i>
        <span>绑定微信</span>
      </div>
      <div class="info">
        未绑定微信。
        <G-OptButton type="bind" label="立即绑定" size="small" style="margin: 0 0 0 13px;"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  mounted() {},
  methods: {
  },
}
</script>

<style lang="less" scoped>
.account-security-wrapper {
  padding: 45px 0 0 0;
  .item {
    margin: 0 0 27px 30px;
    height: 17px;
    display: flex;
    .title {
      display: flex;
      align-items: center;
      padding: 0 27px 0 0;
      border-right: 1px solid #DCDFE6;
      i {
        margin: 0 7px 0 0;
        font-size: 21px;
        &.done {
          color: #00CF82;
        }
        &.undone {
          color: #FF9E02;
        }
      }
      span {
        color: rgba(51, 51, 51, 1);
        font-size: 14px;
      }
    }
    .info {
      padding: 0 0 0 24px;
      color: rgba(51, 51, 51, 1);
      font-size: 14px;
      display: flex;
      align-items: center;
    }
  }
}
</style>