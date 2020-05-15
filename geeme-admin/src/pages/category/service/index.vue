<template>
  <div class="service-class-wrapper">
    <div class="operation">
      <div>
        <a-button type="primary" style="margin-right:10px;" @click="add('one')">新增一级分类</a-button>
        <a-button type="primary" @click="add('two')">新增二级分类</a-button>
      </div>
      <a-input-search placeholder="请输入分类名称" style="width: 280px" enterButton @search="onSearch"/>
    </div>

    <div class="content">
      <a-spin class="spin" tip="Loading..." :spinning="spinning"/>

      <div class="title">
        <div style="width: 15%;">一级分类</div>
        <div style="width: 30%;">所属行业</div>
        <div style="width: 55%;">二级分类</div>
      </div>

      <div>
        <div class="class-wrapper" v-for="item in list" :key="item.id">
          <ClassItem
            class="level-one"
            :data="item"
            @edit="onEdit"
            @blur="onBlur"
            @delete="onDelete"
          />

          <div class="level-two">
            <ClassItem
              class="item"
              v-for="item in item.subClass"
              :key="item.id"
              :data="item"
              :level="2"
              @edit="onEdit"
              @blur="onBlur"
              @delete="onDelete"
            ></ClassItem>
          </div>
        </div>
      </div>
    </div>

    <!-- modal -->
    <LevelOne
      v-if="levelOneVisible"
      :visible="levelOneVisible"
      :operation="operation"
      :id="classId"
      @cancel="onCancel"
      @success="onSuccess"
    />

    <LevelTwo
      v-if="levelTwoVisible"
      :visible="levelTwoVisible"
      :operation="operation"
      :id="classId"
      @cancel="onCancel"
      @success="onSuccess"
    />
  </div>
</template>

<script>
import LevelOne from "./components/levelOne";
import LevelTwo from "./components/levelTwo";
import ClassItem from "../components/classItem";
import {
  getServiceClass,
  sortServiceClass,
  deleteServiceClass
} from "@/api/class";
export default {
  components: {
    LevelOne,
    LevelTwo,
    ClassItem
  },
  data() {
    return {
      list: [],
      levelOneVisible: false,
      levelTwoVisible: false,
      operation: "add",
      classId: null,
      spinning: false
    };
  },
  mounted() {
    this.getServiceClass();
  },
  methods: {
    onSortChange() {
      console.log("change");
    },
    async getServiceClass(name) {
      this.spinning = true;
      try {
        const res = await getServiceClass(name);
        this.list = res.data;
      } finally {
        this.spinning = false;
      }
    },
    formatProfession(list) {
      let str = "";
      for (let i of list) {
        str += `${i.name} `;
      }
      return str;
    },
    add(level) {
      this.operation = "add";
      if (level === "one") {
        this.levelOneVisible = true;
      } else if (level === "two") {
        this.levelTwoVisible = true;
      }
    },
    onEdit(data) {
      this.operation = "edit";
      this.classId = data.id;
      if (data.level === "one") {
        this.levelOneVisible = true;
      } else if (data.level === "two") {
        this.levelTwoVisible = true;
      }
    },
    onCancel() {
      this.levelOneVisible = false;
      this.levelTwoVisible = false;
    },
    onSuccess() {
      this.levelOneVisible = false;
      this.levelTwoVisible = false;
      this.getServiceClass();
    },
    async onBlur(data) {
      const res = await sortServiceClass(data);
      if (res.code === 1200) {
        this.$message.success("操作成功");
        this.getServiceClass();
      }
    },
    async onDelete(data) {
      const res = await deleteServiceClass(data);
      if (res.code === 1200) {
        this.$message.success("删除成功");
        this.getServiceClass();
      }
    },
    onSearch(value, event) {
      this.getServiceClass(value);
    }
  }
};
</script>

<style lang="less" scoped>
.service-class-wrapper {
  height: @mainContentH;
  .operation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .content:extend(.normal-content-one) {
    .common-scrollbar();
    position: relative;
    overflow-y: auto;
    height: calc(100% - 52px);
    padding: 0 20px 20px 20px;
    color: #333333;
    font-size: 14px;
    .title {
      display: flex;
      div {
        line-height: 20px;
        padding: 30px 0 20px 10px;
        box-sizing: border-box;
        &:nth-child(2) {
          padding-left: 0;
        }
      }
    }

    .class-wrapper {
      display: flex;
      margin: -1px 0;
      .level-one {
        width: 45%;
        border: 1px solid #f0f1f4;
        border-bottom: none;
      }
      &:last-child .level-one {
        border-bottom: 1px solid #f0f1f4;
      }
      .level-two {
        width: 55%;
        margin: 1px 0;
        .item {
          border: 1px solid #f0f1f4;
          border-left: none;
          height: 60px;
          margin: -1px 0;
        }
      }
      /* &:nth-child(1) {
        .level-two .item:nth-child(1) {
          border-top: 1px solid #f0f1f4;
        }
      } */
    }

    .spin {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>