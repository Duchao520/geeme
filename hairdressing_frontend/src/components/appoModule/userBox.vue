<template lang="pug">
.user-box
  .appo-userbox(
    v-for="item in list"
    @click="toPagesInNewTags(`/shop-inner/customerRecord/${item.id}`)"
  )
    .img-box
      .box
        img.img(
          :src="formatPicImage(item.headPortrait, 'style', 40, 'someone', item.sex)"
        )
        img.sex(
          v-show="item.sex === '女'",
          src="@/assets/img/female_tip.png"
        )
        img.sex(
          v-show="item.sex === '男'",
          src="@/assets/img/male_tip.png"
        )
    .desc
      .name(
        :title="item.name"
      ) {{ item.name }}
      .phone {{ item.mobile }}
    .level {{ item.memberLevel }}
</template>
<script>
import * as utils from '@/assets/js/utils'
export default {
  props: {
    list: {
      type: Array,
      default: [
          {
            headPortrait: '',
            name: '',
            sex: '',
            mobile: '',
            memberLevel: ''
          }
        ]
    }
  },
  data() {
    return {
      formatPicImage: utils.formatPicImage // 有尺寸的图片处理
    }
  },
  watch:{
    'list'(n){
      // console.log(n)
    }
  },
  methods:{
    test(){
      // console.log(this.list)
    }
  }
}
</script>
<style lang="scss">
  .appo-userbox {
    padding: 10px;
    position: relative;
    line-height: 22px;
    color: #666666;
    border: 1px solid #F0F1F4;
    width: 174px;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    cursor:pointer;
    .img-box {
      display: inline-block;
      .box {
        position: relative;
        .img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: inline-block;
          vertical-align: middle;
        }
        .sex {
          width: 15px;
          height: 15px;
          position: absolute;
          right: 0;
          top: -5px;
        }
      }

    }

    .desc {
      display: inline-block;
      vertical-align: middle;
      margin-left: 8px;
      .name {
        width: 120px;
        font-size: 14px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .phone {
        font-size: 12px;
      }
    }
    .level {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 10px;
      color: #fff;
      line-height: 14px;
      padding: 0 4px 0 8px;
      background: -webkit-linear-gradient(to left,  #070707, #616161); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(to left, #070707), #616161; /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(to left, #070707), #616161; /* Firefox 3.6 - 15 */
      background: -ms-linear-gradient(to left, #070707), #616161; /* Firefox 3.6 - 15 */
      background: linear-gradient(to left,  #070707, #616161); /* 标准的语法 */
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }
  }
</style>
