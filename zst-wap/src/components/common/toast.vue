<template>
    <transition name="alertMsg">
        <div class="toast" v-show="toastFlag">
          <div class="con">
            {{tip}}
          </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "toast",
        props: ['tip'],
        data(){
            return{
                toastFlag: false
            }
        },
        methods: {
            toast(){
                var _self = this;
                _self.toastFlag = true;
                setTimeout(() => {
                    _self.toastFlag = false;
                },3000)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .toast{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        font-size: .3rem;
        color: #FFFFFF;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
      .con{
        overflow: hidden;
        background: rgba(12,12,12,.5);
        padding:0.15rem 0.4rem;
        border-radius: 0.1rem;
      }
    }
</style>
