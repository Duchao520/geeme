<template>
  <div class="winRule">
    <v-head :title="'领奖攻略'"
            :borderBtm="true"></v-head>
    <main class="fz-28 box_padding" style="padding: .12rem" v-html="winrule">

    </main>
  </div>
</template>

<script>
  import vHead from '@/components/common/v-head'
  export default {
    name: "winRule",
    components: {
      vHead
    },
    data(){
      return{
        winrule: this.$route.params.winrule
      }
    }
  }
</script>

<style scoped>

</style>
