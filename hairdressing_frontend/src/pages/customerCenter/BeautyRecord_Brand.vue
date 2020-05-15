<template>
  <div class="pages-main-box scrollbar">
    <div class="pages-edit-container">
      <div class="BeautyRecord text-for-copy">
        <div class="BeautyLeft">
          <g-avatar
            :pic="brandInfo.headPortrait"
            :disabled="true"
            :remarkPic="brandInfo.remarkHeadPortrait"
            :six="brandInfo.sex"
            :stext="'展示头像'"
          ></g-avatar>
        </div>
        <div class="BeautyRight">
          <el-row type="flex" align="bottom" class="userName">
            <span>{{brandInfo.name||'佚名'}}</span>
            <img :src="brandInfo.memberLevel==='普通会员'?mlImg:''" alt />
            <p>会员编号：{{brandInfo.memberSerialNo||'暂无数据'}}</p>
          </el-row>
          <!-- 个人信息-品牌 -->
          <div class="userInfo" v-if="currentEntry === 'brand'">
            <div class="userInfoTitle weight">个人信息</div>
            <el-form :model="brandInfo" label-width="100px" class="brand-demo-ruleForm">
              <el-row :gutter="50">
                <el-col :span="10">
                  <el-form-item label="备注昵称">{{brandInfo.nickName}}</el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="性别">{{brandInfo.sex}}</el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="50">
                <el-col :span="10">
                  <el-form-item label="手机号码">{{brandInfo.mobile}}</el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="微信号">{{brandInfo.weChat}}</el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="50">
                <el-col :span="10">
                  <el-form-item label="归属门店">{{brandInfo.belongStoreName}}</el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="服务者">{{brandInfo.serverName}}</el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="50">
                <el-col :span="10">
                  <el-form-item label="生日">{{brandInfo.birthDay}}</el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="星座">{{brandInfo.constellation}}</el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="50">
                <el-col :span="10">
                  <el-form-item label="客户来源">{{sourceComputed}}</el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item
                    label="居住地"
                    placeholder="请输入居住地"
                  >{{brandInfo.liveProvince}} {{brandInfo.liveCity}}</el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!-- 接口有了 暂未对接 -->
          <div class="user-tags" v-if="currentEntry ==='brand'">
            <el-row type="flex" justify="space-between" align="middle">
              <div class="userLabelTitle weight">客户标签</div>
            </el-row>
            <div class="customer-tags-box">
              <div class='tags-list' v-for='(item,key) in brandInfo.storeTagsList' :key='key'>
                <h3>{{item.storeCity}} {{item.storeName}}</h3>
                <ul>
                  <li v-for='(item1,key1) in item.tags' :key='key1'>{{item1.name}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import { mapState } from "vuex";
export default {
  data() {
    return {
      mlImg: require("@/assets/images/memberlervel/img_flag_normal.png"),
      editable: false,
      reSelected: false,
      sources: [],
      brandInfo: {}
    };
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    currentEntry() {
      return this.$store.state.authRouter.currentEntry;
    },
    sourceComputed() {
      let sourcesMap = {};
      this.sources.forEach(v => {
        sourcesMap[v.id] = v.name;
      });
      return sourcesMap[this.brandInfo.source]
    }
  },
  mounted() {
    this.getCustomerByBrandCID()
    this.getBrandSource()
  },
  methods: {
    getCustomerByBrandCID() {
      axios
        .get(`/getBrandCustomerBaseInfo/${this.$route.params.id}`)
        .then(res => {
          this.brandInfo = res
        })
    },
    getBrandSource() {
      axios.get('/getCustomerChannelInfos').then(res => {
        this.sources = res.channels
      })
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
* {
  box-sizing: border-box;
}
.pages-main-box {
  width: calc(100vw - 40px);
  height: calc(100vh - 105px);
  padding: 0 20px 20px;
  margin-top: 85px;
  overflow-y: auto;
  box-sizing: content-box;
  .pages-edit-container {
    min-height: calc(100vh - 105px);
  }
}
.new-tag {
  width: 80px;
  padding-bottom: 5px;
  color: rgba(88, 201, 243, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
  cursor: pointer;
  i {
    font-size: 14px;
    padding-right: 5px;
  }
}
.BeautyRecord {
  // width: 100%;
  // max-width: 1440px;
  // min-height: 100vh;
  // border-radius: 8px;
  // background-color: white;
  // padding: 35px 21px 32px 70px;
  // margin: 0px auto;
  // display: flex;
  // flex-wrap: nowrap;
  // justify-content: flex-start;
  max-width: 1440px;
  min-height: 100%;
  box-sizing: border-box;
  padding: 40px 70px;
  margin: 0 auto;
  background: #fff;
  border-radius: 6px;
  display: flex;
  .BeautyLeft {
    width: 20%;
  }
  .BeautyRight {
    width: 80%;
    /deep/ .el-input__inner {
      max-width: 200px;
    }
    /deep/ .el-form-item__label {
      color: #666666;
    }
    .weight {
      font-weight: 600;
    }
    .userName {
      width: 100%;
      height: 30px;
      margin-bottom: 20px;
      span:first-child {
        color: #333333;
        font-size: 22px;
        font-weight: 600;
        line-height: 19px;
      }
      img:nth-child(2) {
        width: 32px;
        height: 14px;
        margin: 0 10px;
      }
      p {
        display: inline-block;
        color: rgba(153, 153, 153, 1);
        font-size: 12px;
        line-height: 12px;
      }
    }
    /* 个人信息 */
    .userInfo {
      margin-bottom: 20px;
      .userInfoTitle {
        width: 100%;
        color: #333333;
        font-size: 16px;
        margin-bottom: 8px;
        font-weight: 600;
      }
      .userInfoContent {
        width: 100%;
        border: 1px solid #f0f1f4;
        padding: 20px 52px 0;
      }
      .mask-label {
        display: inline-block;
        width: 200px;
        height: 40px;
        line-height: 40px;
        position: relative;
      }
      .mask-info {
        top: 1px;
        left: 2px;
        width: 174px;
        height: 38px;
        z-index: 10;
        text-indent: 14px;
        background: #fff;
        position: absolute;
        &.opacity {
          opacity: 0;
        }
      }
    }
    /* 关键数据 */
    .UserData {
      margin-bottom: 20px;
      .userDataTitle {
        width: 100%;
        color: #333333;
        font-size: 16px;
        margin-bottom: 8px;
      }
      .userDataContent {
        width: 100%;
        border: 1px solid #f0f1f4;
        padding: 21px 0 30px;
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        .userDataItem {
          height: 53px;
          text-align: center;
          display: flex;
          flex-wrap: wrap;
          align-content: space-between;
          justify-content: center;
          border-right: 1px solid #d5dadf;
          &.active {
            border: 0;
          }
          p {
            width: 100%;
            color: #333333;
            font-size: 18px;
          }
          span {
            color: #666666;
            font-size: 14px;
          }
        }
      }
    }
    /* 客户标签 */
    .UserLabel {
      margin-bottom: 20px;

      .userLabelTitle {
        width: 100%;
        color: #333333;
        font-size: 16px;
        margin-bottom: 8px;
      }
      .userLabelContent {
        width: 100%;
        border: 1px solid #f0f1f4;
        border-radius: 4px;
        padding: 20px 30px 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        .userLabelItem {
          padding: 6px 15px;
          font-size: 12px;
          color: #666666;
          border: 1px solid #ced4da;
          margin-right: 15px;
          margin-bottom: 15px;
          border-radius: 17px;
        }
      }
    }
    /* 备注 */
    .Notes {
      margin-bottom: 40px;

      .notesTitle {
        width: 100%;
        color: #333333;
        font-size: 16px;
        margin-bottom: 8px;
      }
    }

    /* 底部按钮 */
    .buttons {
      width: 100%;
      height: auto;
      margin-top: 40px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
    }
  }
}
/deep/ .el-button--primary {
  background-color: #58c9f3;
  border: 0;
}
/deep/ .el-form-item__content {
  padding-left: 26px;
}
// ================brand===============
// 以后抽空重构 门店和品牌分开维护
.brand-demo-ruleForm {
  border: 1px solid #f0f1f4;
}
.customer-tags-box{
  border: 1px solid #f0f1f4;
  padding: 0 30px;
  .tags-list{
    clear: both;
    h3{
      color: rgba(51, 51, 51, 1);
      font-size: 14px;
      padding: 20px 0;
    }
    ul li{
      // float: left;
      display: inline-block;
      font-size: 12px;
      color: #666666;
      left: 369px;
      border-radius: 17px;
      border: 1px solid rgba(206, 212, 218, 1);
      padding: 5px 15px;
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
}
</style>
