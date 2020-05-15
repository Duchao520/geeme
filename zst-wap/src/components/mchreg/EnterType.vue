<template>
  <div class="searchProgress">
    <v-toast ref="toast" :tip="tip"></v-toast>
    <div style="height: .1rem"></div>
    <group title="进件类型" label-width="2rem">
      <radio title="进件类型" :options="options" @on-change="change"></radio>
    </group>
    <x-button type="primary" style="width: 6.8rem;margin-top: .6rem;margin-bottom: .6rem" @click.native="enter">开始进件</x-button>
    <x-button type="primary" plain style="width: 6.8rem;margin-top: .6rem;margin-bottom: .6rem" @click.native="search">查询进件结果</x-button>
    <p class="fz-28 fc-8D8E98 text-center">Copyright © 助商通 2015-2019</p>
  </div>
</template>

<script>
  import { XInput,Group,XButton ,Radio} from 'vux';
  import {querymch} from "@/assets/js/comm";

  export default {
    name: "searchProgress",
    components: {
      XInput,Group,XButton , Radio
    },
    data(){
      return{
        mobilePhone: '',
        isGetUpgradeState: '',
        tip: '',
        activeCode: this.$route.query.activeCode ? this.$route.query.activeCode : '',
        options : [
          {value: '小微进件',key: 0},
          {value: '企业进件',key: 1}
        ]
      }
    },
    methods: {
      change (value, label) {
        this.isGetUpgradeState = value;
        console.log(this.isGetUpgradeState);
      },
      toast(tip){
        this.tip = tip;
        this.$refs.toast.toast();
      },
      enter(){
        if(this.isGetUpgradeState == 0){
          this.$router.push({
            name: 'mchpar',
            query: {activeCode: this.activeCode}
          })
        }else if(this.isGetUpgradeState == 1){
          this.$router.push({
            name: 'merchantPar'
          })
        }
      },
      search(){
        this.$router.push({
          name: 'searchProgress'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .searchProgress{
    background: #ECECEC;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
