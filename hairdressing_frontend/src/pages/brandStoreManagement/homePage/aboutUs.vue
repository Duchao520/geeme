<template>
  <div class="about-us-main scrollbar" v-loading="loading">
    <div class="form-box">
      <richTextEditor :value="content" @input="textChange"></richTextEditor>
      <el-button
        style="margin-top: 20px;"
        @click="saveRichText"
        :loading="btnLoad"
        class="normal_red_btn"
      >保存修改</el-button>
    </div>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import { mapState } from "vuex";
import richTextEditor from "@/components/rich_text_editor";
export default {
  components: {
    richTextEditor
  },
  data() {
    return {
      aboutUsForm: {
        name: ""
      },
      rules: {},
      content: '',
      btnLoad: false,
      loading: false,
      id: null
    };
  },
  mounted() {
    this.getAboutUsInfo();
  },
  methods: {
    async getAboutUsInfo() {
      try {
        this.loading = true
        const res = await axios.post("/getBrandIntroduction", {
          brandId: this.currentInfo.brandId,
          type: 1
        });
        this.content = res.content
        this.id = res.id
        this.loading = false
      } finally {

      }
    },
    async saveRichText() {
      // 小程序要求转格式
      let content =  this.content.replace('!circle160', '')
      try {
        this.btnLoad = true
        const res = await axios.post('/createOrUpdateBrandIntroduction',{
          brandId: this.currentInfo.brandId,
          content,
          type: 1,
          id: this.id
        })
        if (!res.success) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.btnLoad = false
      } finally {
        this.btnLoad = false
      }
    },
    textChange(text) {
      this.content = text
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    })
  }
};
</script>

<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";
.about-us-main {
  box-sizing: border-box;
  height: calc(100% - 32px);
  padding: 32px 40px 20px;
  overflow-y: auto;
  .form-box {
    // width: 800px;
  }
}
</style>