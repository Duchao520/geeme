<template>
  <div class="adviser-wrap">
    <el-row justify="space-between" type="flex" class="dviser-wrap-content">
      <el-row type="flex" align="middle" justify="center" class="info-box" v-for="item in boxData" :key="item.title" @click.native='goto(item)'>
        <img :src="item.img" alt="">
        <p v-text="item.title"></p>
        <span v-text="item.info"></span>
      </el-row>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'adviser',
  data() {
    return {
      boxData: [
        {
          title: '400-800-0650',
          info: '24 小时全国热线',
          img: require('@/assets/images/about_icon_call.png'),
          type: ''
        },
        {
          title: '在线咨询',
          info: '点击咨询在线客服',
          img: require('@/assets/images/about_icon_adv.png'),
          type: 'linkService',
        },
        {
          title: '及美官方服务号',
          info: '扫一扫关注我们',
          img: require('@/assets/images/about_icon_ser.png'),
          type: ''
        },
        {
          title: '及美官方微博',
          info: '马上关注我们',
          img: require('@/assets/images/about_icon_wei.png'),
          type: ''
        },
      ]
    }
  },
  methods: {
    goto(item) {
      if (item.type == 'linkService'){
        ysf('open');
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.adviser-wrap{
  padding: 0 10px;
  margin-top: 30px;
  padding-bottom: 20px;
}
.info-box{
  width: 20vw;
  height: 21vw;
  max-width: 280px;
  max-height: 232px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  flex-direction: column;
  cursor: pointer;
  border-radius: 8px;
  img{
    max-width: 80px;
    max-height: 80px;
    width: 7vw;
    height: 7vw;
  }
  p{
    color: rgba(51, 51, 51, 1);
    font-size: 22px;
    text-align: center;
    padding-top: 19px;
  }
  span{
    color: rgba(158, 171, 190, 1);
    font-size: 16px;
    text-align: center;
    padding-top: 6px;
  }
}
</style>
