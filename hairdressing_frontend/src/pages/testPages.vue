<template>
  <div class="some-test-box">
    <div class="demo-line test" style="height: 100px;">
      <div class="rotate-dom">
        
      </div>
    </div>
    <div class="demo-line">
      <el-button plain class="plain_green_btn">绿色 空心</el-button>
      <el-button plain class="plain_blue_btn">蓝色 空心</el-button>
      <el-button plain class="plain_pink_btn">粉红 空心</el-button>
      <el-button plain class="plain_gray_btn" @click="toOtherPages">灰色 空心</el-button>
    </div>
    <div class="demo-line">
      <el-button class="normal_green_btn">绿色 实心</el-button>
      <el-button class="normal_peacock_blue_btn">孔雀蓝 实心</el-button>
      <el-button class="normal_blue_btn">蓝色 实心</el-button>
      <el-button class="normal_yellow_btn">橘黄 实心</el-button>
      <el-button class="normal_pink_btn">粉红 实心</el-button>
      <el-button class="normal_red_btn">红色 实心</el-button>
      <el-button class="normal_silvery_gray_btn">银灰 实心</el-button>
      <el-button class="normal_light_gray_btn">浅灰 实心</el-button>
      <el-button class="normal_gray_btn" @click="dosomething">灰色 实心</el-button>
    </div>
    <!-- <div class="demo-line">
      <el-select v-model="value" placeholder="请选择" ref="test">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="demo-line">
      <el-cascader v-model="cValue" :options="cOptions" ref="tttt"></el-cascader>
    </div>
    <div class="demo-line">
      <el-date-picker
        v-model="value1"
        ref="date"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
    </div>
    <div class="demo-line">
      <el-table :data="tableData" :span-method="arraySpanMethod" :border="true">
        <el-table-column prop="level1" label="第一级">
          <template slot-scope="scope">
            <span>{{scope.row.level1}}</span>
            <p @click="firstColCilck(scope.row)">第一级的批量设置</p>
          </template>
        </el-table-column>
        <el-table-column prop="level2" label="第二级"></el-table-column>
        <el-table-column prop="name" label="名字"></el-table-column>
        <el-table-column prop="count" label="内容-级别计数"></el-table-column>
        <el-table-column prop="count1" label="???"></el-table-column>
      </el-table>
    </div> -->
    <div class="demo-line">
      <el-checkbox-group v-model="cardUsefor">
        <el-checkbox :label="goods.value" v-for="goods in canBuyType" :key="goods.value">{{goods.name}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="demo-line">
      <el-upload
        class="avatar-uploader"
        :action="uploadUrl"
        :headers="myHeaders"
        :show-file-list="false"
        :on-success="uploadVideo"
        :before-upload="beforeUpload"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
  </div>
</template>
<script>
import * as api from "@/assets/js/interface";
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios';
export default {
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: "哈哈1",
          level1: "一级1",
          level2: "二级1-1",
          count: "1-1-1"
        },
        {
          id: 2,
          name: "哈哈2",
          level1: "一级1",
          level2: "二级1-1",
          count: "1-1-2"
        },
        {
          id: 3,
          name: "哈哈3",
          level1: "一级1",
          level2: "二级1-1",
          count: "1-1-3"
        },
        {
          id: 4,
          name: "哈哈4",
          level1: "一级1",
          level2: "二级1-2",
          count: "1-2-1"
        },
        {
          id: 5,
          name: "哈哈5",
          level1: "一级1",
          level2: "二级1-2",
          count: "1-2-2"
        },
        {
          id: 6,
          name: "哈哈6",
          level1: "一级2",
          level2: "二级2-1",
          count: "2-1-1"
        },
        {
          id: 7,
          name: "哈哈7",
          level1: "一级2",
          level2: "二级2-2",
          count: "2-2-1"
        },
        {
          id: 8,
          name: "哈哈8",
          level1: "一级3",
          level2: "二级3-1",
          count: "3-1-1"
        },
        {
          id: 9,
          name: "哈哈9",
          level1: "一级4",
          level2: "二级4-1",
          count: "4-1-1"
        },
        {
          id: 9,
          name: "哈哈9",
          level1: "一级4",
          level2: "二级4-1",
          count: "4-1-1"
        },
        {
          id: 9,
          name: "哈哈9",
          level1: "一级4",
          level2: "二级4-1",
          count: "4-1-1"
        },
        {
          id: 9,
          name: "哈哈9",
          level1: "一级4",
          level2: "二级4-1",
          count: "4-1-1"
        },
        {
          id: 9,
          name: "哈哈9",
          level1: "一级4",
          level2: "二级4-1",
          count: "4-1-1"
        },
        {
          id: 9,
          name: "哈哈9",
          level1: "一级4",
          level2: "二级4-1",
          count: "4-1-1"
        },
        {
          id: 9,
          name: "哈哈9",
          level1: "一级4",
          level2: "二级4-1",
          count: "4-1-1"
        },
        {
          id: 9,
          name: "哈哈9",
          level1: "一级4",
          level2: "二级4-1",
          count: "4-1-1"
        },
        {
          id: 9,
          name: "哈哈9",
          level1: "一级4",
          level2: "二级4-1",
          count: "4-1-1"
        },
        {
          id: 9,
          name: "哈哈9",
          level1: "一级4",
          level2: "二级4-1",
          count: "4-1-1"
        },
        {
          id: 9,
          name: "哈哈9",
          level1: "一级4",
          level2: "二级4-1",
          count: "4-1-1"
        },
        {
          id: 9,
          name: "哈哈9",
          level1: "一级4",
          level2: "二级4-1",
          count: "4-1-1"
        }
      ],
      firstColSpan: [],
      secondColSpan: [],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      cOptions: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致"
                },
                {
                  value: "fankui",
                  label: "反馈"
                },
                {
                  value: "xiaolv",
                  label: "效率"
                },
                {
                  value: "kekong",
                  label: "可控"
                }
              ]
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航"
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航"
                }
              ]
            }
          ]
        },
        {
          value: "zujian",
          label: "组件",
          children: [
            {
              value: "basic",
              label: "Basic",
              children: [
                {
                  value: "layout",
                  label: "Layout 布局"
                },
                {
                  value: "color",
                  label: "Color 色彩"
                },
                {
                  value: "typography",
                  label: "Typography 字体"
                },
                {
                  value: "icon",
                  label: "Icon 图标"
                },
                {
                  value: "button",
                  label: "Button 按钮"
                }
              ]
            },
            {
              value: "form",
              label: "Form",
              children: [
                {
                  value: "radio",
                  label: "Radio 单选框"
                },
                {
                  value: "checkbox",
                  label: "Checkbox 多选框"
                },
                {
                  value: "input",
                  label: "Input 输入框"
                },
                {
                  value: "input-number",
                  label: "InputNumber 计数器"
                },
                {
                  value: "select",
                  label: "Select 选择器"
                },
                {
                  value: "cascader",
                  label: "Cascader 级联选择器"
                },
                {
                  value: "switch",
                  label: "Switch 开关"
                },
                {
                  value: "slider",
                  label: "Slider 滑块"
                },
                {
                  value: "time-picker",
                  label: "TimePicker 时间选择器"
                },
                {
                  value: "date-picker",
                  label: "DatePicker 日期选择器"
                },
                {
                  value: "datetime-picker",
                  label: "DateTimePicker 日期时间选择器"
                },
                {
                  value: "upload",
                  label: "Upload 上传"
                },
                {
                  value: "rate",
                  label: "Rate 评分"
                },
                {
                  value: "form",
                  label: "Form 表单"
                }
              ]
            },
            {
              value: "data",
              label: "Data",
              children: [
                {
                  value: "table",
                  label: "Table 表格"
                },
                {
                  value: "tag",
                  label: "Tag 标签"
                },
                {
                  value: "progress",
                  label: "Progress 进度条"
                },
                {
                  value: "tree",
                  label: "Tree 树形控件"
                },
                {
                  value: "pagination",
                  label: "Pagination 分页"
                },
                {
                  value: "badge",
                  label: "Badge 标记"
                }
              ]
            },
            {
              value: "notice",
              label: "Notice",
              children: [
                {
                  value: "alert",
                  label: "Alert 警告"
                },
                {
                  value: "loading",
                  label: "Loading 加载"
                },
                {
                  value: "message",
                  label: "Message 消息提示"
                },
                {
                  value: "message-box",
                  label: "MessageBox 弹框"
                },
                {
                  value: "notification",
                  label: "Notification 通知"
                }
              ]
            },
            {
              value: "navigation",
              label: "Navigation",
              children: [
                {
                  value: "menu",
                  label: "NavMenu 导航菜单"
                },
                {
                  value: "tabs",
                  label: "Tabs 标签页"
                },
                {
                  value: "breadcrumb",
                  label: "Breadcrumb 面包屑"
                },
                {
                  value: "dropdown",
                  label: "Dropdown 下拉菜单"
                },
                {
                  value: "steps",
                  label: "Steps 步骤条"
                }
              ]
            },
            {
              value: "others",
              label: "Others",
              children: [
                {
                  value: "dialog",
                  label: "Dialog 对话框"
                },
                {
                  value: "tooltip",
                  label: "Tooltip 文字提示"
                },
                {
                  value: "popover",
                  label: "Popover 弹出框"
                },
                {
                  value: "card",
                  label: "Card 卡片"
                },
                {
                  value: "carousel",
                  label: "Carousel 走马灯"
                },
                {
                  value: "collapse",
                  label: "Collapse 折叠面板"
                }
              ]
            }
          ]
        },
        {
          value: "ziyuan",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components"
            },
            {
              value: "sketch",
              label: "Sketch Templates"
            },
            {
              value: "jiaohu",
              label: "组件交互文档"
            }
          ]
        }
      ],
      cValue: [],
      value1: '',
      canBuyType: [
        {
          value: 1,
          name: '产品'
        },
        {
          value: 2,
          name: '服务'
        },
        {
          value: 4,
          name: '次卡'
        },
        {
          value: 8,
          name: '时间卡'
        },
        {
          value: 16,
          name: '身份卡'
        },
      ],
      cardUsefor: [], // 储值卡可用范围
    }  
  },
  created() {
    this.setSpanData(this.tableData, this.firstColSpan, "level1");
    this.setSpanData(this.tableData, this.secondColSpan, "level2");
  },
  mounted() {
    // - 储值卡 模拟接口数据 ->
    let arr = this.canBuyType.map(i => i.value)
    let totalFormApi = 13
    arr.map(i => {
      if (totalFormApi & i) {
        this.cardUsefor.push(i)
      }
    })
    // - 储值卡 模拟接口数据 <-

    let dom = document.getElementsByClassName("some-test-box")[0];
    dom.addEventListener("scroll", () => {
      this.$refs.test.handleClose();
      this.$refs.date.handleClose();
      this.$refs.tttt.toggleDropDownVisible(false);
    });
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      let _row = 1;
      let _col = 1;
      if (columnIndex === 0) {
        _row = this.firstColSpan[rowIndex];
      } else if (columnIndex === 1) {
        _row = this.secondColSpan[rowIndex];
      }
      _col = _row > 0 ? 1 : 0;
      return {
        rowspan: _row,
        colspan: _col
      };
    },
    firstColCilck(row) {
      console.log(row);
    },
    dosomething() {
      this.tableData.map(i => {
        this.$set(i, "count1", "我被改变了!!");
      });
    },
    toOtherPages() {
      this.toPagesInNewTags('/test/180801', {id: 404, age: null, name: 'haozhiqiang'})
    },
    uploadVideo() {},
    beforeUpload() {},
  },
  computed: {
    submitTotal() {
      if (this.cardUsefor.length > 1) {
        return (this.cardUsefor).reduce((x, y) => x + y)
      } else {
        return this.cardUsefor.join('') * 1
      }
    },
    myHeaders() {
      return utils.getUploadHeader();
    },
    uploadUrl() {
      return api.uploadPicture.URL;
    },
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.some-test-box {
  width: 100vw;
  height: 100vh;
  background: #fff;
  margin-top: -20px;
  overflow: auto;
  .demo-line {
    min-height: 20px;
    margin-top: 20px;
    margin-left: 20px;
  }
}
.rotate-dom {
  background: red;
  width: 50px;
  height: 50px;
  // &:hover {
  //   animation: rotate 3s linear infinite;
  // }
  animation: rotate 3s linear infinite;
}
@keyframes rotate{from{transform: rotate(0deg)}
    to{transform: rotate(359deg)}
}
</style>
