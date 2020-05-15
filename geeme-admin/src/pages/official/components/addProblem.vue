<template>
  <G-FullPage :title="pageType === 1 ? '添加问题' : '编辑问题'" @back="back">
    <div class="problem-content" v-loading="loading">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="问题标题" prop="title">
          <div style="width: 200px;">
            <el-input v-model="form.title" placeholder="请输入问题标题" maxlength="64"></el-input>
          </div>
        </el-form-item>
        <el-form-item 
          label="所属模块" 
          prop="id"
          :rules="[
            { required: true, validator: validateTopicId, trigger: 'blur' },
          ]"
        >
          <el-cascader v-model="levelsArr" :options="levelsOptions" :props="cascaderProps" clearable/>
        </el-form-item>
        <el-form-item label="解决方案" prop="solution">
          <!-- <quill-editor
            v-model='form.solution'
            ref="myQuillEditor" 
            :options="editorOption"
          ></quill-editor> -->
          <richEditor v-model='form.solution'></richEditor>
        </el-form-item>
        <el-form-item prop="status" label="发布状态">
          <el-radio v-model="form.status" :label="1">立即发布</el-radio>
          <el-radio v-model="form.status" :label="2">存为草稿</el-radio>
        </el-form-item>
        <div class="footer">
          <el-button class="normal_blue_btn" @click="sendData">保存</el-button>
          <el-button plain class="plain_gray_btn" @click="back">取消</el-button>
        </div>
      </el-form>
    </div>
  </G-FullPage>
</template>
<script>
// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
  ['blockquote', 'code-block'],     //引用，代码块
  [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
  [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
  [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
  [{ 'direction': 'rtl' }],             // 文本方向
  [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
  [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
  [{ 'align': [] }],    //对齐方式
  [{ 'font': [] }],     //字体
  ['clean'],    //清除字体样式
  ['image','video']    //上传图片、上传视频
];
import {quillEditor} from 'vue-quill-editor'
import richEditor from '@/components/richEditor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import fetch from '@/utils/fetch';
export default {
  data() {
    return {
      form: {
        id: 0,
        title: '',
        topicId: '', // lv2
        solution: '',
        status: 1, // 1-online 上线, 2-drafts 草稿箱
      },
      pageType: 1,
      levelsArr: [],
      levelsOptions: [],
      cascaderProps: {
        label: 'topicName',
        value: 'id',
        children: 'children'
      },
      editorOption: {
        theme: "snow", // or 'bubble'
        placeholder: "请输入解决方案",
        modules: {
          toolbar: {
            container: toolbarOptions,
          }
        }
      },
      loading: false,
      rules: {
        title: [
          { required: true, message: '请输入问题标题', trigger: 'blur' }
        ],
        solution: [
          { required: true, message: '请输入问题解决方案', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择发布状态', trigger: 'change' }
        ],
      }
    }
  },
  created() {
    this.getCascaderOptions()

    // 视为编辑否则视为新增
    if (this.$route.params.classId) {
      this.pageType = 2
      this.loading = true
      this.getQADetails(this.$route.params.id)
    }
  },
  methods: {
    // - 格式化问题模块选项
    async getCascaderOptions() {
      let res = await fetch({
        method: 'get',
        url: '/api/main-data/feign/queryAllQuestionTopic'
      })
      this.levelsOptions = []
      res.listQueryAllQuestionTopicInfo.map(i => {
        let item = {
          children: i.listSecondLevelTopic,
          ...i.firstLevelTopic
        }
         this.levelsOptions.push(item)
      })
    },
    // - 问题详情 --编辑用--
    async getQADetails(id) {
      let res = await fetch({
        method: 'get',
        url: `/api/main-data/getQuestionById/${id}`
      })
      this.form = {
        id: res.baseQuestionInfo.id,
        title: res.baseQuestionInfo.title,
        topicId: res.baseQuestionInfo.topicId,
        solution: res.baseQuestionInfo.solution,
        status: res.baseQuestionInfo.status,
      }
      this.levelsArr = [res.baseQuestionInfo.parentId, res.baseQuestionInfo.topicId]
      res.success ? this.$message.success(res.message) : this.$message.error(res.message)
      this.loading = false
    },
    sendData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.form))
          let url = this.pageType === 1 ? '/api/main-data/createQuestion' : '/api/main-data/updateQuestion'
          fetch({
            method: 'post',
            url: url,
            data
          }).then(res => {
            res.success ? this.$message.success(res.message) : this.$message.error(res.message)
            this.back()
          })
        } else {
          this.$message.error('必填信息不完整')
          return false;
        }
      });
    },
    validateTopicId(rule, value, callback) {
      if (this.form.topicId) {
        callback()
      } else {
        callback(new Error('请选择所属模块'))
      }
    },
    back() {
      this.$router.push("/app/official/problem");
    },
  },
  watch: {
    'levelsArr'(v, o) {
      this.form.topicId = v.length ? v[1] : null
    }
  },
  components: {
    quillEditor,
    richEditor,
  }
};
</script>

<style>
.editor {
  line-height: normal !important;
  /* height: 476px; */
}
.ql-container {
  /* min-height: 300px; */
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  value: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  value: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  value: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  value: "14px";
  transform: translateY(-8px);
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  value: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  value: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  value: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  value: "文本";
  transform: translateY(-8px);
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  value: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  value: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  value: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  value: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  value: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  value: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  value: "标准字体";
  transform: translateY(-8px);
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  value: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  value: "等宽字体";
}
</style>

<style lang='less' scoped>
.problem-content {
  .common-scrollbar();
  padding: 40px 0 0 30px;
  overflow-y: auto;
  height: calc(100vh - 105px);
  display: flex;
  // /deep/ .el-form {
  //   padding: 0 20px;
  // }
  .footer {
    margin-bottom: 12px;
    margin-left: 85px;
  }
}
</style>
