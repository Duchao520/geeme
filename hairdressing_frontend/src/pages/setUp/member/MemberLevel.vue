<template>
  <div class="m-level-wrap">
    <el-row type="flex" class="m-level-wrap_content">
      <div class="member-card" v-for="(item,index) in brandMemberLevelsList"
           :key="index">
        <div class="m-level-wrap_head">
          <div class="img" :style="{
            backgroundImage:`url(${utils.formatPicImg(item.backgroundImage)})`
          }"></div>
          <i class="icon iconfont icon-icon_diamond"></i>
        </div>
        <span>{{item.levelName}}</span>
        <div class="section">
          <p>成长值条件：<span>{{item.experience}}</span></p>
          <p>当前会员数：<span>{{item.levelMemberCount}}</span></p>
        </div>
        <div class="manage-buttons">
          <i class="icon iconfont icon-icon_operate_edit" @click="toMemberLevelDetail(item)"></i>
          <i class="icon iconfont icon-icon_operate_delete" @click="deleteMemberLevel(item)" v-if="index"></i>
        </div>
      </div>
    </el-row>
    <el-button class="normal_blue_btn" @click="$router.push('/brand-inner/add-member-level')">新增会员级别</el-button>
    <g-del-model
      :delTagDialogVisible="delTagDialogVisible"
      @close="delTagDialogVisible=false"
      @confirm="modelConfirm"
      :title="modelInfo.title"
      :content="modelInfo.content"
      :icon="modelInfo.icon"
      :iconColor="modelInfo.iconColor"
    ></g-del-model>
  </div>
</template>
<script>
  import * as axios from "@/util/axios";
  import {mapState} from "vuex";
  import * as utils from "@/assets/js/utils";

  export default {
    data() {
      return {
        utils,
        brandMemberLevelsList: [],
        delFunction: null,
        delTagDialogVisible: false,
        modelInfo: {
          title: "确定要删除吗？",
          content: "删除后，相关信息无法恢复，请谨慎操作！",
          icon: "icon_popup_question",
          iconColor: "#FF6D61"
        }
      }
    },
    computed: {
      ...mapState({
        currentInfo: state => state.manage.currentInfo,
      }),
    },
    mounted() {
      this.getBrandMemberLevelList()
    },
    methods: {
      getBrandMemberLevelList() {
        axios.post("/getBrandMemberLevelList", {brandId: this.currentInfo.brandId}).then(res => {
          this.brandMemberLevelsList = res.brandMemberLevelsList;
        })
      },
      toMemberLevelDetail(data) {
        this.$router.push({
          path: "/brand-inner/edit-member-level",
          query: {id: data.id}
        })
      },
      deleteMemberLevel(data) {
        this.delTagDialogVisible = true;
        this.delFunction = () => {
          axios.post("/deleteBrandLevelInfo", {
            brandId: this.currentInfo.brandId,
            levelId: data.id
          }).then(res => {
            this.$message({
              type: res.success ? "success" : "warning",
              message: res.message
            });
            this.getBrandMemberLevelList();
            this.delTagDialogVisible = false;
            this.delFunction = null;
          })
        }
      },
      modelConfirm() {
        this.delFunction()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .m-level-wrap {
    width: 97%;
    height: calc(100vh - 155px);
    margin: 0 auto;

    &_content {
      width: 100%;
      flex-flow: row wrap;
    }

    &_head {
      position: relative;
      width: 100px;
      height: 100px;
      overflow: hidden;
      border-radius: 50%;
      margin-bottom: 10px;

      i {
        position: absolute;
        top: 33%;
        left: 33%;
        font-size: 30px;
        width: 39px;
        height: 34px;
        color: #fff;
      }
    }

  }

  .member-card {
    box-sizing: border-box;
    width: 219px;
    height: 270px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    border-radius: 8px;
    margin-bottom: 20px;
    margin-right: 20px;
    padding-top: 34px;

    .img {
      width: 100%;
      height: 100%;
      background-position: center;
      background-size: cover;
    }

    span {
      color: rgba(51, 51, 51, 1);
      font-size: 14px;
      text-align: center;
    }

    .section {
      width: 96%;
      padding-left: 13px;
      padding-top: 24px;
    }

    p {
      color: #999999;
      font-size: 14px;
      text-align: left;
      height: 20px;
      padding-bottom: 10px;
    }

    .manage-buttons {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      box-sizing: border-box;
      padding-right: 5px;

      .icon {
        width: 20px;
        height: 20px;
        padding-right: 5px;
        cursor: pointer;
      }

      .icon-icon_operate_edit {
        color: #58C9F3;
      }

      .icon-icon_operate_delete {
        color: #BEC3C6;
      }
    }
  }

</style>
