<template>
  <div class="bottom">copyright © 2017-2019  All Rights Reserved 杭州及美网络科技有限公司 版权所有  浙ICP备17055820号-2</div>
</template>
<script>
export default {
    data(){
    return{
      boxShow:false
    }
  },
  mounted(){
    window.addEventListener('resize',() => {

        let box = document.documentElement.clientWidth/document.documentElement.clientHeight
        this.boxShow = box<1

    })
  }
}
</script>

<style lang="scss">

        #gm_login_page .el-form,#gm_register .el-form, #gm_retrieve_pass .el-form{
            margin-top: 0.3rem;
            .el-input__inner{
              height: 0.66rem;
              border-top:none;
              border-left: none;
              border-right: none;
              border-radius: 0;
              font-size:0.16rem;
              box-sizing: border-box;
            }
            .el-button{
              width: 100%;
              height: 0.44rem;
              line-height: 0;
              margin-top: 0.3rem;
              font-size:0.18rem;
            }
            .el-form-item{
              margin-bottom:0;
            }
        }
        #gm_login_page .el-form{
          .el-button{
            margin-top: 0rem;
          }
        }

        .bottom{
          width: 100%;
          // height: 73px;
          line-height: 73px;
          color: #AAAAAA;
          font-size: 12px;
          text-align: center;
          position: absolute;
          bottom: 0;
          left:0;
        }
            .bottom.active{
          width: auto;

        }

        .login_area{
          width: 100%;
          // height: 8.60rem;
          height: 100vh;
          // display: flex;

          .login_div{
            width:3.52rem;
            height:4.24rem;
            background:#fff;
            // margin-top:0.62rem;
            padding: 0.4rem 0.4rem 0 0.4rem;
            .login_title{
              font-size: 0.2rem;
              color: #333333;
            }
            .check_route{
              display:flex;
              flex-direction:row;
              margin-top:0.3rem;
              font-size:0.14rem;
              color:#9B9B9B;
              p{
                flex:1;
                span{
                  color: #999999 100%;
                }
              }
              span{
                cursor: pointer;
                color:#E22C37;
              }
            }
          }
        }
</style>


