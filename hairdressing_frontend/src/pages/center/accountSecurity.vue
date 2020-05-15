<template>
  <div class="access-safety">
    <center-nav :list="[{id:1,name:'账户安全'}]" :current="1"></center-nav>
    <div class="component"><component @vertify="componentId='VerifyMobile'" :is="componentId"></component></div>
  </div>
</template>

<script>
import CenterNav from "@/components/center/nav";
import Remind from "@/components/center/accountSecurity/Remind"
import VerifyMobile from "@/components/center/accountSecurity/VerifyMobile"

export default {
  components: {
    "center-nav": CenterNav,
    'Remind':Remind,
    'VerifyMobile':VerifyMobile,
  },
  data() {
    return {
      componentId:'Remind'
    }
  },
};
</script>

<style lang="scss">
.access-safety {
  box-sizing: border-box;
  padding: 0 20px;
  .component{
    box-sizing: border-box;
    padding: 0 18px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
