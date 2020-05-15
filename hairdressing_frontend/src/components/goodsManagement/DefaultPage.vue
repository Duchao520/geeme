<template>
  <div class="default-root">
    <div class="con">
        <div class="content">
            <img src="@/assets/img/bg_default_goods.png" alt="">
            <p>{{text}}</p>
            <button @click="$emit('add-sort')">{{buttonText}}</button>
        </div>
    </div>
  </div>
</template>
<script>
export default {
    props: {
        text:String,
        buttonText:String
    }
};
</script>
<style lang="scss" scoped>
@mixin size{
width: 100%;
  height: 100%;
}
.default-root {
  @include size;
  box-sizing: border-box;
  padding: 20px;
  height: calc(100vh - 50px);
  .con {
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    background: #ffffff;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    @include size;
    .content{
        transform: translateY(-30px);
        display: flex;
        flex-direction: column;
        align-items: center;
        img{
            width: 300px;
        }
        p{
            color: #999999;
            font-size: 16px;
            margin: 30px;
        }
        button{
            box-sizing: border-box;
            padding: 0 23px;
            line-height: 40px;
            font-size: 16px;
            color: white;
            background: #F52D56;
            border-radius: 20px;
            border: 1px solid rgba(245,45,45,.5)
        }
    }
  }
}
</style>
