<script>
import { mapMutations } from 'vuex'
import { UNIONID , SET_OPEN_ID , SESSIONKEY ,ISIPX} from './store/mutation-types'
import Tips from '@/common/js/tips'
export default {
  data(){

  },
  methods:{
    ...mapMutations({
      unionid:'UNIONID',
      openId:'SET_OPEN_ID',
      sessionkey:'SESSIONKEY',
      isIpx:'ISIPX'
    }),
    checkIsIPhoneX() {
        const self = this
        wx.getSystemInfo({
            success: function (res) {
                console.log(res);
                if (res.model.search('iPhone X') != -1) {
                   self.isIpx(1);
                }else{
                   self.isIpx(0)
                }
                console.log(self.$store.state.isIpx);
            }
        })
    },
  },
  created () {
    // 登录
    //登录参数获取  nick ico  gender  province  city   wxUnionId
    var _this = this;
    wx.login({
      success: res => {
        // ------ 获取凭证 ------
        var code = res.code;
        if (code) {
          _this.$http.getToken(code).then(res=>{
            if(res.state==1) {
              if(res.data.unionid) {
                _this.unionid(res.data.unionid);
              }
              _this.openId(res.data.openid);
              _this.sessionkey(res.data.session_key);
            }else{
              Tips.toast(`${res.msg}`,'none');
            }
          })
        } else {
          Tips.toast(`${res.errMsg}`,'none');
        }
      },
      fail(res){
        console.log('获取凭证失败',res);
      }
    })
    _this.checkIsIPhoneX()
  }
}
</script>

<style>
@import '../src/style/iconfont.css';
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
