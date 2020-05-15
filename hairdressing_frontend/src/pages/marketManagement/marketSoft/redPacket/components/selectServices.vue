<template>
  <el-dialog 
    :title="title"
    :visible="goodsVisible"
    @close="$emit('close')"
    width="800px"
  >
    <div class="dialog-body scrollbar">
      <div class="class-box" v-for="(lv1, idx) in list" :key="lv1.id">
        <div class="first-class-line">
          <i class="icon iconfont" :class="lv1.open ? 'icon-icon_open_off' : 'icon-icon_open_on'" @click="toggle(idx)"></i>
          <el-checkbox @change="checkAllChange(lv1.checked, idx)" v-model="lv1.checked" :indeterminate="lv1.indeterminate">{{lv1.sortName}}</el-checkbox>
        </div>
        <div class="second-class-box" v-show="lv1.open">
          <el-checkbox class="lv-2nd-checkbox" @change="checkSingleChange(lv2.checked, idx)" v-for="lv2 in lv1.sortTwo" :key="lv2.id" v-model="lv2.checked">{{lv2.sortName}}</el-checkbox>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button plain class="plain_gray_btn" @click="$emit('close')">取消</el-button>
      <el-button class="normal_blue_btn" @click="sendData">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'select-services-or-product',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.initList()
    this.list.length && this.renderSected() 
  },
  methods: {
    // 一级分类展开/折叠
    toggle(idx) {
      this.list[idx].open = !this.list[idx].open
      this.$forceUpdate()
    },
    // 一级分类变更状态
    checkAllChange(status, idx) {
      this.list[idx].indeterminate = false
      this.list[idx].sortTwo.map(i => {i['checked'] = status})
      this.$forceUpdate()
    },
    // 二级分类变更状态
    checkSingleChange(status, idx) {
      let hasChecked = this.list[idx].sortTwo.some(i => i.checked)
      let hasNoChecked = this.list[idx].sortTwo.some(i => !i.checked)
      if (hasChecked && hasNoChecked)  {
        this.list[idx].indeterminate = true
        this.list[idx].checked = false
      } else {
        this.list[idx].indeterminate = false
        if (hasChecked) {
          this.list[idx].checked = true
        } else {
          this.list[idx].checked = false
        }
      }
      this.$forceUpdate()
    },
    sendData() {
      this.$emit('suberData', this.list)
    },
    initList() {
      this.list = JSON.parse(JSON.stringify(this.superList))
    },
    // 渲染已选表格数据到模态框
    renderSected() {
      let repeat = 0
      let firstId = 0
      for (let tag = 0; tag < this.superCheckedGoods.length; tag++) {
        if (this.superCheckedGoods[tag].typeOneId === firstId) {
          repeat++
        } else {
          repeat = 1
          firstId = this.superCheckedGoods[tag].typeOneId
        }
        for (let i = 0; i < this.list.length; i++) {
          if (this.superCheckedGoods[tag].typeOneId === this.list[i].jimeiClassId) {
            this.list[i].checked = repeat === this.list[i].sortTwo.length ? true : false // 一级分类的全选状态
            this.list[i].indeterminate = repeat === this.list[i].sortTwo.length ? false : true // 一级分类的半选状态
            for (let j = 0; j < this.list[i].sortTwo.length; j++) {
              if (this.superCheckedGoods[tag].typeTwoId === this.list[i].sortTwo[j].jimeiClassId) {
                this.list[i].sortTwo[j].checked = true // 二级分类的选择状态
                break
              }
            }
            break
          }
        }
      }
    }
  },
  props: {
    goodsVisible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: '选择服务分类'
    },
    // 备选项
    superList: {
      type:Array,
      required: true
    },
    // 选中项
    superCheckedGoods: {
      type: Array,
      required: true
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.dialog-body {
  min-height: 400px;
  .first-class-line {
    height: 40px;
    line-height: 40px;
    padding: 0 18px;
    background: #f4f5f7;
    .iconfont {
      font-size: 14px;
      margin-right: 10px;
    }
  }
  .second-class-box {
    padding: 0 25px;
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    .lv-2nd-checkbox {
      margin: 10px 20px;
    }
  }
}
</style>
