<template>

</template>

<script>
  import {closeWebView} from "@/assets/js/jsBridge";

  export default {
    name: "closeWebView",
    mounted() {
      closeWebView();
    }
  }
</script>

<style scoped>

</style>
