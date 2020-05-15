<template>
    <div class="remind">
        <i style="color:#00CF82" class="icon iconfont icon-icon_order_success"></i>
        <span style="font-weight:600">绑定手机</span>
        <span style="font-size:18px;color:#DCDFE6;margin:0 24px">|</span>
        <span>已绑定手机：{{phoneNumber}}若已停用或丢失，请立即更换，避免账户被盗。</span>
        <button @click="vertify">修改绑定</button>
    </div>
</template>
<script>
export default {

    computed: {
        phoneNumber(){
            var phone  = this.$store.state.manage.userInfo.telephone;
            return phone.replace(phone.slice(3,7),'****')
        }
    },
    methods: {
        vertify(){
            this.$emit("vertify")
        }
    }
}
</script>
<style lang="scss" scoped>
.remind{
    box-sizing: border-box;
    padding-top: 40px;
    line-height: 28px;
    font-size: 14px;
    color: #333333;
    button{
        width: 70px;
        height: 28px;
        line-height: 26px;
        border: 1px solid #666666;
        border-radius: 5px;
    }
}
</style>
