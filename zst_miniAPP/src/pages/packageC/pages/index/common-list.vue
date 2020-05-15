<template>
  <div class="common-list">
    <div class="head_title fz-36 font-weight">周边活动商家</div>
    <div class="list-item box_padding bg-FFFFFF flex_box" v-for="(item,index) in [1,2,3,4]">
      <img src="" alt="" class="thumb">
      <div class="detail">
        <div class="flex_box justify_space_between" style="align-items: flex-end;margin-bottom:60rpx;">
          <div>
            <p class="fz-30 fc-0D0D0F">街头披萨（民和路店）</p>
          </div>
          <div>
            <p class="fz-30 fc-8D8E98">0.01km</p>
          </div>
        </div>
        <div class="flex_box justify_space_between" style="align-items: flex-end">
          <div>
            <div class="fz-30 fc-8D8E98">参与人数 <span class="fz-34 fc-F7094D">150040人</span></div>
          </div>
          <div>
            <p class="fz-28 fc-F7094D">砍价进行中</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "common-list",
    data(){
      return {

      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
