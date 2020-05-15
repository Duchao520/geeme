<template>
  <div class="reminder-content">
    <i class="icon iconfont icon-icon_popup_plaint"></i>
    <i class="arrow"></i>
    <p class="reminder-title">{{errorInfo.title}}</p>
    <p class="reminder-reason">{{errorInfo.reason}}</p>
  </div>
</template>
<script>
  export default {
    props: {
      errorInfo: Object
    }
  }
</script>
<style lang="scss" scoped>
  .reminder-content {
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 65px;
    position: relative;
    text-align: center;
    .iconfont {
      font-size: 50px;
      color: #f52d56;
    }

    .reminder-title {
      line-height: 25px;
      font-size: 18px;
      color: #333333;
      margin: 20px 0 10px;
    }

    .reminder-reason {
      line-height: 17px;
      font-size: 12px;
      color: #666666;
      width: 182px;
    }

    .arrow {
      position: absolute;
      top: 50%;
      left: 0;
      display: block;
      width: 11px;
      height: 11px;
      background: #f1f2f7;
      -webkit-transform: rotateZ(45deg);
      transform: rotateZ(45deg);
      margin-left: -5px;
      margin-right: 27px;
    }
  }
</style>
