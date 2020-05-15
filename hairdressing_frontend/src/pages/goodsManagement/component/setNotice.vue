<template>
  <div>
    <el-dialog
      title="设置须知模板"
      :visible="setNoticeModelVisible"
      @close="hideThisDialog"
      @open="resetNoticeSet"
      width="800px"
    >
      <div class="set-notice-wrapper">
        <div class="notice-list-wrapper" ref="noticeList">
          <ul class="notice-list">
            <li
              v-for="item in list"
              :key="item.notesTitle"
              @click="choose(item)"
              :class="{active: form == item}"
            >{{item.notesTitle}}</li>
          </ul>
          <!-- 添加规则 -->
          <div class="add-notice" @click="add">
            <i class="icon iconfont icon-icon_ope_append"></i>
            新增模板
          </div>
        </div>

        <div class="notice-detail">
          <el-form :model="form" ref="noticeForm" label-width="100px" :rules="rules">
            <el-form-item label="模板标题" prop="notesTitle">
              <el-input v-model="form.notesTitle"></el-input>
            </el-form-item>

            <el-form-item label="模板内容" prop="notesData">
              <input-with-count
                v-model="form.notesData"
                placeholder="请输入备注"
                :autosize="{ minRows: 6, maxRows: 6}"
                :length="450"
              ></input-with-count>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('noticeForm')">保存模板</el-button>
              <el-button @click="del()">删除模板</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import util from "@/util/base.js";
export default {
  props: {
    setNoticeModelVisible: Boolean
  },
  data() {
    return {
      list: [],
      /* 模板指向 */
      index: 0,
      form: {
        brandId: this.$store.state.manage.currentInfo.brandId,
        id: '',
        notesTitle: '',
        notesData: ''
      },
      /* 表单原型，用于重置 */
      oriForm: {
        brandId: this.$store.state.manage.currentInfo.brandId,
        id: '',
        notesTitle: '',
        notesData: '',
      },
      rules: {
        notesTitle: [
          { required: true, message: "请输入模板标题", trigger: "submit" }
        ],
        notesData: [
          { required: true, message: "请输入模板内容", trigger: "submit" }
        ]
      },
      // 新增模板计数
      count: 0
    };
  },
  methods: {
    hideThisDialog() {
      console.log('close')
      this.$emit("close");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        /* 表单验证不通过 */
        if (!valid) { return false }
        /* 模板名重复 */
        const arr = this.list.filter(i => i.notesTitle === this.form.notesTitle)
        if (arr.length > 1) {
          this.$message.error('模板名称已存在')
          return false
        }
        /* submit */
        let url
        /* 判断新增/修改 */
        if (this.form.id === '') {
          url = api.createMembershipCardNotes.URL
        } else {
          url = api.modifyMembershipCardNotes.URL
        }
        axios.post(url, this.form).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.resetNoticeSet()
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          console.log(err)
        })
      });
    },
    /* 点击选择，并记录下该 index */
    choose(i) {
      this.index = this.list.indexOf(i);
      this.form = i;
    },
    /* 临时新增的无 id */
    add() {
      const count = util.sectionToChinese(++this.count);
      this.list.push({
        brandId: this.$store.state.manage.currentInfo.brandId,
        id: '',
        notesTitle: `新增模板${count}`,
        notesData: ''
      });
      this.index = this.list.length - 1
      this.form = this.list[this.index];
    },
    del() {
      if (!this.list instanceof Array || this.list.length === 0) {
        return false
      }
      if (this.form.id === '') {
        this.list = this.list.filter(i => i !== this.form);
        this.resetIndex()
      } else {
        axios.post(api.deleteMembershipCardNotes.URL, {notesId: this.form.id}).then(res => {
         if (res.success) {
           this.$message.success('删除成功')
           this.resetNoticeSet()
         } else {
           this.$message.error('删除失败')
         }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    resetIndex() {
      if (this.list.length === 0) {
        this.index = 0
        this.form = JSON.parse(JSON.stringify(this.oriForm))
      } else if (this.index > this.list.length - 1) {
        this.index = this.list.length - 1
        this.form = this.list[this.index]
      } else {
        this.form = this.list[this.index]
      }
    },
    /* 重置: 表单还原 计数还原 重新获取须知列表数据 表单定向值第一个或没有 滚动条返回顶部 */
    resetNoticeSet() {
      console.log('reset')
      this.form = JSON.parse(JSON.stringify(this.oriForm))
      this.count = 0
      this.index = 0
      axios.get(`${api.getMembershipCardNotes.URL}/${this.form.brandId}`).then(res => {
        this.list = res.listCardNotes || []
        if (this.list.length > 0) {
          this.form = this.list[this.index];
          this.$refs.noticeList.scrollTo(0,0)
        }
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.set-notice-wrapper {
  height: 338px;
  border-top: 1px solid rgba(240, 241, 244, 1);
  display: flex;
  .notice-list-wrapper {
    width: 213px;
    /* height: 100%; */
    border-right: 1px solid rgba(240, 241, 244, 1);
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
    ul.notice-list {
      /* margin: 0 0 13px 0; */
      li {
        width: 100%;
        height: 50px;
        color: #333333;
        font-size: 14px;
        text-align: center;
        line-height: 50px;
        cursor: pointer;
        &:hover,
        &.active {
          background: #58c9f3;
          color: #ffffff;
        }
      }
    }
    .add-notice {
      color: #58c9f3;
      font-size: 14px;
      cursor: pointer;
      text-align: center;
      height: 50px;
      line-height: 50px;
      &:hover {
        background: #58c9f3;
        color: #ffffff;
      }
    }
  }
  .notice-detail {
    flex: 1;
    height: 100%;
    padding: 26px 57px 34px 17px;
    box-sizing: border-box;
  }
}
</style>