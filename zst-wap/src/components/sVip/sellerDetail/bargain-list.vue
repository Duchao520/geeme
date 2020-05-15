<template>
  <div class="bargain-list" v-show="bargains.length > 0">
    <p class="fz-34 font-weight" style="margin-bottom: .3rem">砍价活动({{bargains.length}})</p>
    <div class="bargain-item"
         v-for="(item,idx) in bargains"
         :key="idx">
      <div class="flex_box">
        <img v-lazy="item.mainImg" alt="" class="thumb">
        <div style="width: 5.4rem">
          <p class="fz-28 fc-0D0D0F txt-ellipsis" style="margin-bottom: .12rem">{{item.title}}</p>
          <p class="fz-24 fc-0D0D0F txt-ellipsis" style="margin-bottom: .24rem">龙虾2斤、水煮毛豆1份、啤酒2瓶免费拿</p>
          <div class="flex_box justify_space_between align_center">
            <p class="flex_box align_center" v-if="$accMul($accMul(Number(item.price),Number(item.discount)),0.1) != 0">
              <i class="iconfont icon-renminbi fz-38 fc-F7094D">{{Number($accMul($accMul(Number(item.price),Number(item.discount)),0.1)).toFixed(2)}}</i>
              <i class="iconfont icon-renminbi fz-30 fc-8D8E98" style="text-decoration: line-through">{{Number($accMul(Number(item.price),1).toFixed(2))}}</i>
            </p>
            <p class="fz-38 fc-F7094D" v-else>砍价免费拿</p>
            <router-link :to="{name: 'goodsDetail',query: {bargainId: item.id,origin: 1}}"
                         class="fz-34 fc-ffffff"
                         tag="button">参与砍价</router-link>
          </div>
        </div>
      </div>
      <div class="flex_box justify_space_between">
        <p class="fz-20" style="color: #F47F0F">还剩{{item.surplusShareNum}}份疯抢中...</p>
        <p class="fz-20 fc-0D0D0F">已有{{item.helperNum}}人参与</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "bargain-list",
    props: ['bargains'],
    data(){
      return{

      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .bargain-list{
    width: 100%;
    background: #FFFFFF;
    box-sizing: border-box;
    padding: .2rem;
    .bargain-item{
      border-bottom: .01rem solid #E5E5E5;
      padding-bottom: .12rem;
      margin-bottom: .18rem;
      .thumb{
        display: block;
        width: 1.6rem;height: 1.6rem;
        background: #000;
        border-radius: .1rem;
        margin-right: .24rem;
      }
      button{
        display: block;
        width: 1.68rem;
        height: .6rem;
        border-radius: .1rem;
        background: #FA336C;
      }
    }

  }
</style>
