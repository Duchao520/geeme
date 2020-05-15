<template>
  <el-dialog
    :title="showTitle"
    :visible="classSelectVisible"
    @close="hideThisDialog"
    @open="prepareData"
    width="800px"
  >
    <div class="select-content">
      <div class="class-wrapper" v-for="item in list" :key="item.id">
        <button class="level-one" @click="toggle">
          <i class="iconfont">&#xe68d;</i>
          <el-checkbox
            v-model="item.checked"
            :indeterminate="item.indeterminate"
            @change="onChange(item)"
          >{{item.sortName}}</el-checkbox>
        </button>
        <div class="level-two">
          <el-row>
            <el-col :span="6" v-for="i in item.sortTwo" :key="i.id" style="margin: 11px 0;">
              <el-checkbox v-model="i.checked" @change="onChange(i)">{{i.sortName}}</el-checkbox>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 无分类时显示提示 -->
      <div class="no-class-tip" v-if="showTip">
        <img src="./assets/bg_default_goods.png" />
        <p>暂时没有分类，请前往总部或门店新增服务</p>
      </div>
    </div>

    <div class="operation">
      <el-button @click="hideThisDialog">取消</el-button>
      <el-button type="primary" @click="saveSelect">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    selectType: String,
    classSelectVisible: Boolean,
    oriList: Array
  },
  data() {
    return {
      list: []
    };
  },
  computed: {
    showTitle() {
      switch (this.selectType) {
        case "product":
          return "选择产品分类";
        case "service":
          return "选择服务分类";
      }
    },
    showTip() {
      return !(this.oriList instanceof Array) || this.oriList.length === 0  
    }
  },
  methods: {
    prepareData() {
      this.list = JSON.parse(JSON.stringify(this.oriList));
      this.$forceUpdate()
    },
    hideThisDialog() {
      this.$emit("close");
    },
    toggle() {
      if (event.target.className !== "level-one") {
        return;
      }
      const element = event.target.nextSibling.nextSibling;
      const icon = event.target.firstChild/* .innerHTML = '&#xe6a5;' */
      if (element.style.maxHeight) {
        element.style.maxHeight = null;
        icon.innerHTML = '&#xe68d;'
      } else {
        element.style.maxHeight = element.scrollHeight + "px";
        icon.innerHTML = '&#xe6a5;'
      }
    },
    onChange(data) {
      if (data.jimeiParentId === 0 && !data.checked) {
        this.checkAll(data, false, false);
      } else if (data.jimeiParentId === 0 && data.checked) {
        this.checkAll(data, true, false);
      } else if (data.jimeiParentId !== 0) {
        this.searchTree(this.list, this.check.bind(this, data));
      }
      this.$forceUpdate();
    },
    checkAll(current, checked, indeterminate) {
      current["checked"] = checked;
      current["indeterminate"] = indeterminate;
      current.sortTwo.map(i => (i["checked"] = checked));
    },
    searchTree(tree, f, prev = null) {
      for (let i of tree) {
        f.call(this, i, prev);
        const sub = i.sortTwo;
        if (sub instanceof Array && sub.length > 0) {
          this.searchTree(sub, f, i);
        }
      }
    },
    checkStatus(current) {
      const result = current.filter(i => !!i.checked);
      return result.length;
    },
    check(data, current, prev) {
      const id = data.jimeiParentId;
      if (current.jimeiClassId === id) {
        const result = this.checkStatus(current.sortTwo);
        console.log(result);
        if (result === 0) {
          current.checked = false;
          current.indeterminate = false;
        } else if (result === current.sortTwo.length) {
          current.checked = true;
          current.indeterminate = false;
        } else {
          current.checked = false;
          current.indeterminate = true;
        }
      }
    },
    saveSelect() {
      const data = JSON.parse(JSON.stringify(this.list))
      this.$emit('done', {
        type: this.selectType,
        data
      })
      this.hideThisDialog()
    }
  }
};
</script>

<style lang="scss" scoped>
.select-content {
  width: 800px;
  height: 520px;
  border: 1px solid #dcdfe6;
  border-right: none;
  border-left: none;
  overflow-y: scroll;
  position: relative;
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
  .class-wrapper {
    .level-one {
      width: 100%;
      height: 40px;
      text-align: left;
      background: #f4f5f7;
      padding: 0 0 0 18px;
      cursor: pointer;
      border-bottom: 1px solid #dcdfe6;
      i {
        color: #dcdfe6;
        margin: 0 6px 0 0;
        pointer-events: none;
      }
    }
    .level-two {
      background: #ffffff;
      padding: 0 0 0 64px;
      border-bottom: 1px solid #dcdfe6;
      transition: max-height 0.2s ease-out;
      overflow: hidden;
      max-height: 0;
      margin: -1px 0 0 0;
    }
  }
  /* 无分类时给提示 */
  .no-class-tip {
    position: absolute;
    text-align: center;
    top: 140px;
    left: 50%;
    transform: translate(-50%, 0);
    img {
      width: 300px;
      margin: 0 0 40px 0;
    }
    p {
      font-size: 16px;
      color: #999999;
    }
  }
}
.operation {
  padding: 20px;
  text-align: right;
}
</style>
