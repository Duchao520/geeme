<template lang="pug">
.center-person__wrap
  .form_area
    el-form(
      :model="myForm",
      ref="myForm",
      label-width="1.53rem"
    )
      .avatar-wrap
        el-form-item(
          label="头像"
        )
          img.avatar.person-form-item(
            :src="formatPicImage(myForm.headPortrait,'style',40,'someone',myForm.sex)"
          )
      //- el-form-item(
      //-   label="姓名"
      //- )
      //-   el-input.person-form-item.input(
      //-     v-model="myForm.username",
      //-     maxlength="16",
      //-     placeholder="请输入姓名"
      //-   )
        // span.tip 仅可修改一次
      el-form-item(
        label="昵称"
      )
        el-input.person-form-item.input(
          v-model="myForm.nickname",
          maxlength="30",
          placeholder="请输入昵称"
        )
        // span.tip 仅可修改一次
      el-form-item(
        label="性别"
      )
        el-select.person-form-item.input(
          v-model="myForm.sex",
          placeholder="请选择性别"
        )
          el-option(
            v-for="(item, index) in sexList",
            :key="index",
            :label="item.label",
            :value="item.value"
          )
      el-form-item(
        label="生日"
      )
        el-date-picker.person-form-item.input(
          type="date",
          placeholder="选择日期",
          v-model="myForm.birthDay"
          value-format='yyyy-MM-dd'
        )
      el-form-item(
        label="登录手机号"
      )
        span.mobile.person-form-item {{ myForm.telephone }}
        // 接口没有，暂时注释
        g-clickbtn(
          :title="'编辑'",
          :icon="'icon_operate_edit'",
          :mark="'/center/account'"
        )
      el-form-item(
        label="个人简介"
      )
        el-input(
          placeholder="最多150字",
          type="textarea",
          :rows="4",
          :maxlength="150",
          v-model="myForm.personalProfile"
        )
      el-form-item
        .group-item
          g-btn(
            :type="'blue1'",
            :size="'large'",
            :name="'保存'",
            @click.native="submit('saveInfo')"
          )
</template>
<script>
import * as api from "@/assets/js/interface";
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import { constants } from "zlib";
export default {
  props: {
    list: Object
  },
  data() {
    return {
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      myForm: {
        headPortrait: null, // 头像
        username: null, // 姓名
        nickname: null, // 昵称
        sex: null, // 性别
        birthDay: null, // 生日
        telephone: null, // 手机号码
        personalProfile: null // 备注
      },
      sexList: [
        {
          label: "男",
          value: "男"
        },
        {
          label: "女",
          value: "女"
        },
        {
          label: "保密",
          value: "保密"
        }
      ],
      datas: datas
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.manage.userInfo;
    }
  },
  watch: {
    list(val) {
      console.log(val)
      this.myForm = this.userInfo;
      this.myForm = JSON.parse(JSON.stringify(val));
    }
  },
  methods: {
    submit(type) {
      this.$emit("submit", {
        type: type,
        data: this.myForm
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.center-person__wrap .form_area .group-item:last-child {
  margin-left: 10px;
}
.el-textarea {
  width: 99%;
  margin-left: 10px;
}
</style>
