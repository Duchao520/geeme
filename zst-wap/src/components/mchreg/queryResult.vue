<template>
  <div class="queryResult">
    <div style="height: .1rem"></div>
    <group title="微信进件结果">
      <cell title="进件结果" :value="wxMicroMerchantApplyMentStateJSON.applyment_state_desc ? wxMicroMerchantApplyMentStateJSON.applyment_state_desc : ''"></cell>
      <template v-if="wxMicroMerchantApplyMentStateJSON.applyment_state == 'REJECTED'">
        <cell title="失败原因" arrow-direction="up" is-link></cell>
        <cell-box :border-intent="true" class="sub-item" v-for="(item,index) in wxMicroMerchantApplyMentStateJSON.audit_detail" :key="index">{{item.reject_reason}}</cell-box>
      </template>
      <template v-if="wxMicroMerchantApplyMentStateJSON.applyment_state == 'ACCOUNT_NEED_VERIFY' || wxMicroMerchantApplyMentStateJSON.applyment_state == 'TO_BE_SIGNED' || wxMicroMerchantApplyMentStateJSON.applyment_state == 'NEED_SIGN'">
        <cell title="继续进行" value="继续进行" is-link @click.native="navigateto(wxMicroMerchantApplyMentStateJSON.sign_url)"></cell>
      </template>
    </group>
    <group title="支付宝进件结果">
      <cell title="进件结果" :value="getAliApplyState(alipayOpenAgentOrderQueryJSON.orderStatus)"></cell>
      <template v-if="alipayOpenAgentOrderQueryJSON.orderStatus == 'MERCHANT_APPLY_ORDER_CANCELED'">
        <cell title="失败原因" arrow-direction="up" is-link></cell>
        <cell-box :border-intent="false" class="sub-item">{{alipayOpenAgentOrderQueryJSON.reject_reason}}</cell-box>
      </template>
      <template v-if="alipayOpenAgentOrderQueryJSON.orderStatus == 'MERCHANT_CONFIRM'">
        <cell title="继续进行" value="继续进行" is-link @click.native="navigateto(alipayOpenAgentOrderQueryJSON.confirmUrl)"></cell>
      </template>
    </group>
  </div>
</template>

<script>
  import { XInput,Group,XButton ,Radio , Cell , CellBox} from 'vux';
  export default {
    name: "queryResult",
    components: {
      XInput,Group,XButton , Radio , Cell , CellBox
    },
    data(){
      return{
        wxMicroMerchantApplyMentStateJSON: this.$route.params.wxMicroMerchantApplyMentStateJSON,
        alipayOpenAgentOrderQueryJSON: this.$route.params.alipayOpenAgentOrderQueryJSON
      }
    },
    methods: {
      navigateto(url){
        window.location.href = url;
      },
      getAliApplyState(obj) {
        var stateDesc = "";
        switch (obj){
          case 'MERCHANT_INFO_HOLD':
            stateDesc ="暂存(MERCHANT_INFO_HOLD)";
            break;
          case 'MERCHANT_AUDITING':
            stateDesc ="审核中(MERCHANT_AUDITING)";
            break;
          case 'MERCHANT_CONFIRM':
            stateDesc ="待商户确认(MERCHANT_CONFIRM)";
            break;
          case 'MERCHANT_CONFIRM_SUCCESS':
            stateDesc ="商户确认成功(MERCHANT_CONFIRM_SUCCESS)";
            break;
          case 'MERCHANT_APPLY_ORDER_CANCELED':
            stateDesc ="审核失败或商户拒绝(MERCHANT_APPLY_ORDER_CANCELED)";
            break;
          default:
            stateDesc ="";
            break;
        }
        return stateDesc;
      }
    }
  }
</script>

<style scoped>
  .queryResult{
    background: #ECECEC;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
