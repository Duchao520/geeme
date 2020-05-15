<template>
  <transition name="slide">
    <div class="type-select" v-show="selectFlag" @click="selectFlag = false">
      <section class="select-container" v-show="selectFlag">
        <main style="border-bottom: 12rpx solid #EEEEEE">
          <div class="option flex_box justify_space_between align_center"
               v-for="(item,index) in typeList"
               @click.stop="selected = index">
            <p class="fz-34">{{item.name}}</p>
            <i class="iconfont icon-wanchenggouxuan2 fc-FEB623 fz-34"
               v-show="selected == index"></i>
          </div>
        </main>
        <main>
          <div class="option flex_box justify_space_between align_center">
            <p class="fz-34">砍成时间</p>
            <p class="fz-30 fc-8D8E98" @click.stop="showDatePicker">2018-06-25至2019-06-25<i
              class="iconfont icon-arrow-right fc-0D0D0F"></i></p>
          </div>
        </main>
      </section>
      <date-picker ref="datePicker"></date-picker>
    </div>
  </transition>

</template>

<script>

  export default {
    components: {

    },
    data() {
      return {
        typeList: [
          {
            name: '全部'
          },
          {
            name: '未消费'
          },
          {
            name: '已消费'
          }
        ],
        selected: 0,
        selectFlag: false
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .slide-enter-active {
    animation: fadeInDown .3s;
  }

  .slide-leave-active {
    animation: fadeOutUp .3s;
  }

  .type-select {
    position: fixed;
    top: 102rpx;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(12, 12, 12, .5);
    z-index: 55;

    .select-container {
      background: #FFFFFF;

      main {
        box-sizing: border-box;
        padding: 0 30rpx;

        .option {
          padding: 38rpx 0;
          border-bottom: 2rpx solid #EEEEEE;
        }
      }

    }
  }
</style>
