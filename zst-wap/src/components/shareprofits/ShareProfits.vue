<template>
  <div class="hello">
    <h2>{{msg}}</h2>
    <router-link to="/testPage">sss</router-link>
  </div>
</template>

<script>
// import Brodcast from "@/assets/js/Broadcast.js";
export default {
  name: 'ShareProfits',
  data () {
    return {
      msg: '这是分享赚页面'
    }
  },
  created(){
  },
  beforeMount(){
  },
  mounted(){
    this.tokenPromise.then(function(data){
      alert("share口令"+data);



    });
    console.log('ShareProfits.vue mounted');

  },beforeUpdate(){
  },props:['tokenPromise']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
