<template>
    <web-view :src="url"></web-view>
</template>

<script>
    import { getSignIn , getQuery ,base64src,base64Name} from '@/common/js/comm';
    export default {
        name: "index",
        data(){
          return {
            result:'',
            shareCardId:'',
            shareuserId:'',
            url:''
          }
        },
        mounted(){
          let par = getQuery();
          this.result = par.result;
          this.shareCardId = par.shareCardId?par.shareCardId:'';
          this.shareuserId = par.shareuserId ? par.shareuserId :'';
          var obj = {
            "isAppAccess":0,
            "isMainCard":0,
            "shareuserId":this.shareuserId,
            "cardNO":"",
            "attach":"",
          }
          var JsonStr = JSON.stringify(obj);
          this.url=`${this.result}?otherParams=${encodeURIComponent(JsonStr)}&shareCardId=${this.shareCardId}`;
          console.log(this.url);
          console.log(par);
        },
        methods:{

        }
    }
</script>

<style scoped>

</style>
