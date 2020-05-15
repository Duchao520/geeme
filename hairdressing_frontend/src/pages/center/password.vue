<template lang="pug">
.center-password__wrap
  center-nav(
    :list="[{id: 1,name: '修改密码'}]",
  )
  .update-password
    .input-item
      g-input(
        :type="'password'",
        :mark="'old'",
        :value="old",
        :placeholder="'请输入旧密码'",
        @change="change"
      )
    .input-item
      g-input(
        :type="'password'",
        :mark="'mynew'",
        :value="mynew",
        :placeholder="'请输入新密码'",
        @change="change"
      )
    .input-item
      g-input(
        :type="'password'",
        :mark="'renew'",
        :value="renew",
        :placeholder="'请再次输入新密码'",
        @change="change"
      )
  .operate-group
    .operate-item
      g-btn(
        :name="'保存修改'",
        :size="'extend'",
        :type="'blue1'",
        :mark="'confirm'",
        @click="operate"
      )
    .operate-item( v-if = 'false' )
      g-btn(
        :name="'取消'",
        :size="'extend'",
        :type="'black'",
        :mark="'cancel'",
        @click="operate"
      )
  p.forget(
    @click="toRetrievePass"
  ) 忘记密码？
</template>
<script>
import * as api from '@/assets/js/interface'
import * as axios from '@/util/axios';
import * as utils from '@/assets/js/utils'
import CenterNav from '@/components/center/nav'
import sha256 from 'js-sha256'
export default {
  data() {
    return {
      old: '', // 旧密码
      mynew: '', // 新密码
      renew: '' // 重新输入的新密码
    }
  },
  components: {
    'center-nav': CenterNav,
  },
  computed: {
    telephone() { return this.$store.state.manage.userInfo.telephone }
  },
  methods: {
    // 清空输入框
    clear(type) {
      this[type] = ''
    },
    operate(data) {
      if (data.mark === 'cancel') {
        this.old = ''
        this.mynew = ''
        this.renew = ''
        utils.showTip(this, {msg: '取消成功', type: 'success'})
      } else {
        // 检测输入框机制
        // 校验旧密码/新密码/确认新密码
        if ( this.checkUserInfo(['old', 'mynew'])) {
          if (!utils.compareArr([this.mynew, this.renew])) {
            // 新密码与旧密码比较
            this.message = "两次新密码不一致，请重填"
            // 提示
            utils.showTip(this, {msg: this.message, type: 'error'})
          } else if (utils.compareArr([this.old, this.mynew])) {
            // 新密码与旧密码比较
            this.message = "新密码与旧密码一致，请重填"
            // 提示
            utils.showTip(this, {msg: this.message, type: 'error'})
          } else {
            // 前端检查通过后才会调用修改密码接口
            // 开始向后台发送请求验证
            let params = {
              // newPassword: this.mynew,
              newPassword: sha256(`&${this.mynew}_gm`),
              oldPassword: sha256(`&${this.old}_gm`)
            }
            axios.post(api.updatePassword.URL, params).then(res => {
              this.updatePassRes(res)
            })
          }
        }
      }
    },
    change(data) {
      this[data.mark] = data.val
    },
    // 修改密码接口处理
    updatePassRes(res) {
      if (res.success) {
        // 提示 res.message
        utils.showTip(this, {msg: '密码修改成功，将在2秒后强制登出!', type: 'success', time: '2000', onClose: () => {
           axios.post(api.logout.URL)
        }})
        // this.$router.go(-1)
      } else {
        // 提示
        utils.showTip(this, {msg: res.message, type: 'error'})
      }

    },
    // 校验用户信息输入框
    checkUserInfo(types) {
      let _type = ''
      for (let i = 0, len = types.length; i < len; i++) {
        _type = this[types[i]]
        if (types[i] === 'old' && !utils.checkPassword(_type)) {
          // console.log(types[i] === 'old' && !utils.checkPassword(_type), _type)
          this.message = "密码格式为6~16长度至少一个数字和字母组合,区分大小写字母"
          // 提示
          utils.showTip(this, {msg: this.message, type: 'error'})
          return false
        } else if (types[i] === 'mynew' && !utils.checkPassword(_type)) {
          // console.log(types[i] === 'mynew' && !utils.checkPassword(_type))
          this.message = "密码格式为6~16长度至少一个数字和字母组合,区分大小写字母"
          // 提示
          utils.showTip(this, {msg: this.message, type: 'error'})
          return false
        }
      }
      return true
    },
    // 跳转到忘记密码页面
    toRetrievePass() {
      this.$router.push("/retrieve-pass");
    },
  },
}
</script>
<style lang="scss" scoped>
  .center-password__wrap{
    box-sizing: border-box;
    padding: 0 15px;
  }
  /deep/ .center-nav__wrap .nav-list .nav-item{
    cursor: text;
  }
</style>
