<template>
  <div class="container">
    <div class="container-inner">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
 
  data() {
    return {
      
    };
  },
  mounted() {


  },
  watch: {
    
  },
  methods: {
    
  }
};
</script>
<style lang="scss" scoped>

.container {
  box-sizing: border-box;
  padding:0 20px;
  height: 100%;
  .container-inner{
    height: 100%;
  }
}
</style>