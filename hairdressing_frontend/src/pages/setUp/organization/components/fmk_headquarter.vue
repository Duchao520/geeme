<template>
  <div class="fmk-headquarter-box" id="fmk-headquarter-box">
    <div class="office-top-box">
      <div class="title-line">
        <span class="office-name">
          {{tags.nodeName}}
        </span>
        <i></i>
        <span class="children-size">
          下级部门 ({{childrenSize}}个)
        </span>
        <el-button class="add-office normal_blue_btn" size="small" @click="addNewOffice">新增子部门</el-button>
      </div>
      <div class="out-side">
        <el-table :data="officeData" :key="0" stripe>
          <el-table-column align="left" label="排序" width="84">
            <template slot-scope="scope">
              <span>{{scope.row.sort}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="部门名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="总人数">
            <template slot-scope="scope">
              <span>{{scope.row.total}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="子部门数">
            <template slot-scope="scope">
              <span>{{scope.row.children}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="操作" min-width="160">
            <template slot-scope="scope">
              <el-button class="normal_blue_btn" plain size="mini" @click="handleEditOffice(scope.row)" icon="el-icon-edit-outline">编辑</el-button>
              <el-button class="normal_gray_btn" size="mini" @click="handleDelOffice(scope.row)" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- officeData.length -->
        <div class="office-pages" v-show="5 > officePageSize">
          <el-pagination
            layout="prev, pager, next"
            @current-change="handleCurrentChangeInOffice"
            :small='size'
            :current-page="officePages.pageNo"
            :page-size="officePageSize"
            :total="105">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="office-bottom-box">
      <div class="title-line">
        <span class="office-name">
          {{tags.nodeName}}
        </span>
        <i></i>
        <span class="children-size">
          成员 ({{totalMembers}}人)
        </span>
        <!-- <el-button class="add-member" type="primary" size="small" @click="addNewOffice">新增成员</el-button> -->
      </div>
      <div class="out-side">
        <!-- <el-checkbox-group v-model="checkedArr" @change="handleChecked"> -->
          <el-table :data="officePersonData" :key="0" stripe>
            <el-table-column align="left" label="姓名">
              <template slot-scope="scope">
                <div class="client_area">
                  <!-- <el-checkbox 
                    :key="scope.row.id" 
                    :label="scope.row.id"
                    class="check_single"
                  ></el-checkbox> -->
                  <span>{{scope.row.name}}</span>
                </div> 
              </template>
            </el-table-column>
            <el-table-column align="left" label="登录手机号">
              <template slot-scope="scope">
                <span>{{scope.row.phone}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="部门/门店">
              <template slot-scope="scope">
                <span>{{scope.row.office}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="职务身份">
              <template slot-scope="scope">
                <span>{{scope.row.job}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="角色">
              <template slot-scope="scope">
                <span>{{scope.row.root}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column align="left" label="操作" min-width="160">
              <template slot-scope="scope">
                <el-button type="primary" plain size="mini" @click="handleEditOffice(scope.row)" icon="el-icon-edit-outline">编辑</el-button>
                <el-button type="info" size="mini" @click="handleDelOffice(scope.row)" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        <!-- </el-checkbox-group> -->
        <!-- <div class="footer">
          <el-checkbox class="all_check" v-model="allCheckedFlag" @change="checkAll">全选</el-checkbox>
        </div> -->
        <!-- officeData.length -->
        <div class="office-person-pages" v-show="5 > officePageSize">
          <el-pagination
            layout="prev, pager, next"
            @current-change="handleCurrentChangeInOffice"
            :small='size'
            :current-page="officePages.pageNo"
            :page-size="officePageSize"
            :total="105">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      childrenSize: 4, // 子部门数, 需要改变
      totalMembers: 104, // 门数员工数, 需要改变
      officePageSize: 4, // 分页数, 固定
      size: true,
      officeData: [],
      officePersonData: [],
      officePages: {
        pageNo: 1
      },
      paternalArrayForCheckbox: [], // 全选框的比对父本数组
      // checkedArr: [],
      //allCheckedFlag: false, // 全选是否激活
    }
  },
  methods: {
    addNewOffice() {
      console.log('打开创建部门对话框')
    },
    handleEditOffice(row) {
      console.log('表格行编辑', row)
    },
    handleDelOffice(row) {
      console.log('表格行删除', row)
    },
    handleCurrentChangeInOffice(page) {
      this.officePages.pageNo = page
      // 请求切换页面的部门数据
    },
    setCheckedAllArr() {
      this.paternalArrayForCheckbox = []
      this.officePersonData.forEach((item, index) => {
        this.paternalArrayForCheckbox.push(item.id);
      });
    },
    /* checkAll() {
      this.checkedArr = this.allCheckedFlag ? this.paternalArrayForCheckbox : [];
    }, */
    /* handleChecked() {
      this.allCheckedFlag = this.checkedArr.length == this.officePersonData.length;
    } */
  },
  created() {
    console.log('我在这里请求总部的部门id数据,获取部门列表和当前部门的员工 ', this.tags.nodeId)
    this.officeData = [
      {
        sort: 1,
        id: 1,
        name: '总裁办',
        total: 6,
        children: 4
      },
      {
        sort: 2,
        id: 2,
        name: '财务中心',
        total: 5,
        children: 2
      },
      {
        sort: 1,
        id: 1,
        name: '总裁办',
        total: 6,
        children: 4
      },
      {
        sort: 1,
        id: 1,
        name: '总裁办',
        total: 6,
        children: 4
      },
    ]
    this.officePersonData = [
      {
        id: 1,
        name: '张3',
        phone: 13633334444,
        office: '总裁办',
        job: '发型师',
        root: '管理员',
      },
      {
        id: 2,
        name: '李四',
        phone: 13633334444,
        office: '总裁办',
        job: '发型师',
        root: '管理员',
      },
      {
        id: 3,
        name: '张3',
        phone: 13633334444,
        office: '总裁办',
        job: '发型师',
        root: '管理员',
      },
      {
        id: 4,
        name: '李四',
        phone: 13633334444,
        office: '总裁办',
        job: '发型师',
        root: '管理员',
      },
    ]
    this.setCheckedAllArr()
  },
  watch: {
    'tags.nodeId': (v, o) => {
      console.log('我在这里监听部门id变化,用新的参数重新请求数据', v)
    }
  }
}
</script>

<style>
#fmk-headquarter-box .client_area .el-checkbox__label {
  display: none;
}
</style>

<style lang='scss' scoped>
.office-top-box {
  position: relative;
  margin-bottom: 12px;
  .title-line {
    height: 32px;
    .office-name {
      font-weight: bold;
    }
    .children-size {
      color: #666;
    }
    .iconfont {
      font-size: 10px;
      margin: 0 4px;
    }
    i {
      display: inline-block;
      width: 4px;
      height: 4px;
      border-right: 1px solid #999;
      border-top: 1px solid #999;
      transform: rotate(45deg);
      margin: 0 8px;
    }
  }
  .add-office {
    position: absolute;
    right: 0;
  }
  
}
.out-side {
  position: relative;
  min-width: 800px;
  margin-top: 12px;
  padding: 15px;
  box-sizing: border-box;
  height: 330px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 8px 0px rgba(174, 184, 229, 0.3);
}
.office-pages, .office-person-pages {
  position: absolute;
  right: 0;
  bottom: 6px;
}
.footer {
  position: absolute;
  bottom: 6px;
  .all_check {
    left: 12px;
  }
}
.office-bottom-box {
  position: relative;
  margin-top: 30px;
  margin-bottom: 20px;
  .client_area {
    // text-align: center;
    display: flex;
  }
  .check_single {
    margin: 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }
  .title-line {
    height: 32px;
    .office-name {
      font-weight: bold;
    }
    .children-size {
      color: #666;
    }
    .iconfont {
      font-size: 10px;
      margin: 0 4px;
    }
    i {
      display: inline-block;
      width: 4px;
      height: 4px;
      border-right: 1px solid #999;
      border-top: 1px solid #999;
      transform: rotate(45deg);
      margin: 0 8px;
    }
  }
  .add-member {
    position: absolute;
    right: 0;
  }
}
</style>
