<template>
  <div id="gm_personal_center">
    <v-header :header="header"></v-header>
    <div class="full_container">
      <div class="container_area">
        <!-- 顶部操作 -->
        <div class="per_header">
          <div class="head_left">
            <img :src="perForm.headPortrait" class="fixed_img">
            <div class="per_msg">
              <p>{{ perForm.nickname }}</p>
              <p>{{ perForm.telephone }}</p>
              <p>
                <span @click="toUpdatePass">修改密码</span>
                <span @click="logout">退出</span>
              </p>
            </div>
          </div>
          <div class="head_right">
            <el-button @click="toChooseShop">我的店铺</el-button>
            <el-button type="primary" @click="toCreateShop">创建店铺</el-button>
          </div>
        </div>
        <!-- 表单 -->
        <div class="per_form">
          <el-form :model="perForm" label-width="80px">
            <el-form-item label="姓名:">
              <el-input v-model.trim="perForm.username" placeholder="请输入姓名"></el-input>
              <span class="tip" v-show="perForm.username.length === 0">仅可修改一次</span>
            </el-form-item>
            <el-form-item label="昵称:">
              <el-input v-model.trim="perForm.nickname" placeholder="请输入昵称"></el-input>
            </el-form-item>
            <el-form-item label="性别:">
              <el-select v-model="perForm.sex" placeholder="请选择">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
                <el-option label="保密" value="保密"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生日:">
              <el-date-picker
                style="width:100%;max-width:400px;"
                v-model.trim="perForm.birthDay"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="登录手机:">
              <el-input
                v-model.trim="perForm.telephone"
                placeholder="请输入手机号"
                disabled
                maxlength="11"
              ></el-input>
              <span class="tip">如需修改，请联系客服</span>
            </el-form-item>
            <el-form-item label="头像:">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="myHeaders"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="addPic" :src="perForm.headPortrait" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span class="tip">支持jpg，png格式，建议像素800*800px以上，大小不超过1M</span>
            </el-form-item>
            <el-form-item label="个人简介:">
              <el-input
                type="textarea"
                :rows="4"
                :maxlength="150"
                placeholder="请输入个人简介（不超过150字）"
                v-model.trim="perForm.personalProfile"
              ></el-input>
            </el-form-item>
            <el-form-item label>
              <el-button type="primary" @click="updateUserInfo">保存</el-button>
              <el-button @click="$router.go(-1);">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/loginCommon/LoginHeader.vue";
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import { mapActions, mapState } from "vuex";
export default {
  name: "GmPersonalCenter",
  components: {
    "v-header": Header
  },
  data() {
    return {
      header: {
        title: "个人中心",
        isphone: false
      },
      avatarId: "",
      perForm: {
        username: "",
        nickname: "",
        sex: "保密",
        birthDay: "",
        telephone: "",
        headPortrait: "",
        personalProfile: ""
      }
    };
  },
  computed: {
    uploadUrl() {
      return api.uploadPicture.URL;
    },
    // 本地头像显示地址
    avatar() {
      return utils.isInString(this.perForm.headPortrait, datas.imgUrl.URL)
        ? this.perForm.headPortrait
        : datas.imgUrl.URL + this.perForm.headPortrait;
    },
    userInfo() {
      return this.$store.state.manage.userInfo;
    },
    myHeaders() {
      return utils.getUploadHeader();
    },
    addPic() {
      return this.perForm.headPortrait !== datas.avatar.URL;
    }
  },
  created() {
    for (let key in this.userInfo) {
      this.perForm[key] = this.userInfo[key];
    }
  },
  methods: {
    // 点击去创建店铺
    toCreateShop() {
      this.$router.push("/create/brands");
    },
    saveUserInfoRes(res) {
      if (res.success) {
        // 提示
        utils.showTip(this, { msg: "保存成功", type: "success" });
      } else {
        // 提示
        utils.showTip(this, { msg: "保存失败", type: "error" });
      }
    },
    // 保存用户信息
    updateUserInfo() {
      let perForm = this.perForm;
      let params = {
        username: perForm.username,
        nickname: perForm.nickname,
        sex: perForm.sex,
        birthDay: perForm.birthDay,
        telephone: perForm.telephone,
        headPortrait: this.avatarId,
        personalProfile: perForm.personalProfile
      };
      // 获取用户信息
      axios.post(api.updateUserInfo.URL, params).then(res => {
        this.saveUserInfoRes(res);
      });
    },
    toChooseShop() {
      this.$router.push("/center/brands");
    },
    logout() {
      axios.post(api.logout.URL)
    },
    toUpdatePass() {
      this.$router.push("/center/password");
    },
    handleAvatarSuccess(res, file) {
      this.avatarId = file.response.fileKey;
      this.perForm.headPortrait = datas.imgUrl.URL + file.response.fileKey;
    },
    beforeAvatarUpload(file) {
      const isJPG = utils.checkImgType(file.type);
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 1M!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="scss">
#gm_personal_center {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
}
</style>

<style lang="scss" scoped>
.full_container {
  background: #fff;
  .container_area {
    padding: 80px 0 100px 160px;
  }
}
.per_header {
  display: flex;
  .head_left {
    flex: 1;
    display: flex;
    .per_msg {
      padding-top: 10px;
      p {
        font-size: 18px;
      }
      span {
        color: #e6333f;
        font-size: 14px;
        margin-right: 10px;
        padding-top: 10px;
        display: inline-block;
        cursor: pointer;
      }
    }
  }
  .fixed_img {
    width: 92px;
    height: 92px;
    border-radius: 50%;
    margin-right: 20px;
  }
  .head_right {
    padding-right: 200px;
    margin-top: 10px;
  }
}
.per_form {
  margin-top: 30px;
  .tip {
    color: #9b9b9b;
    font-size: 14px;
    padding-left: 10px;
  }
}
</style>


