<template>
  <div class="default-root-wrap">
    <div class="default-root">
      <img src="@/assets/img/icon_default_search.png" alt>
      <div class="text">
        <h6>很抱歉，没有找到符合条件的内容</h6>
        <p>小建议：</p>
        <p>1. 请查看输入的文字是否有误</p>
        <p>2. 尽量使用简结的关键词，可提高搜索效果哦~</p>
        <p>3. 也可以尝试搜索其他的近义词</p>
        <button @click="$emit('clear-back')">返回列表</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.default-root-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  .default-root {
    display: flex;
    img {
      width: 110px;
      height: 110px;
      display: block;
      border-radius: 50%;
    }
    .text {
      margin: -10px 0 0 37px;
      h6 {
        line-height: 45px;
        color: #333333;
        font-size: 18px;
      }
      p {
        line-height: 20px;
        font-size: 14px;
        color: #999999;
      }
      button {
        margin-top: 40px;
        color: #f52d56;
        border: 2px solid #f52d56;
        width: 120px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        border-radius: 20px;
        box-sizing: border-box;
        transition: all 0.6s;
        &:hover {
          background: #efefef;
        }
      }
    }
  }
}
</style>
