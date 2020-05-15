<template>
  <div class="searchProgress">
    <v-toast ref="toast" :tip="tip"></v-toast>
    <div style="height: .1rem"></div>
    <group title="进件查询" label-width="2rem">
      <radio title="进件类型" :options="options" @on-change="change"></radio>
      <x-input title="手机号码" required v-model="mobilePhone" placeholder="请输入手机号码" type="tel" keyboard="number" is-type="china-mobile"></x-input>
    </group>
    <x-button type="primary" style="width: 6.8rem;margin-top: .6rem;margin-bottom: .6rem" @click.native="querymch">提交信息</x-button>
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
      querymch(){
        var _self = this , _data;
        if(!_self.mobilePhone){
          _self.toast('请输入手机号')
        }else{
          _data = {
            mobilePhone: _self.mobilePhone,
            isGetUpgradeState: _self.isGetUpgradeState
          };
          querymch(_data).then(res => {
            if(res.data.state == 1){
              _self.$router.push({
                name: 'queryResult',
                params: {
                  wxMicroMerchantApplyMentStateJSON: res.data.wxMicroMerchantApplyMentStateJSON,
                  alipayOpenAgentOrderQueryJSON: res.data.alipayOpenAgentOrderQueryJSON
                }
              })
            }else{
              _self.toast(decodeURIComponent(res.data.msg));
            }
          })
        }

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
