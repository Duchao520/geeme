<template>
  <div class="chooseAddAssist">
    <el-dialog :visible="showAddAssistants" @close="$emit('close')" :append-to-body="true" width="800px">
      <div
        slot="title"
        style="font-size:18px;font-weight:600;color:#333333"
      >选择{{currentStaffType==='assistant'?'工位':'销售'}}
      </div>
      <div class="assistContent">
        <!-- 助理列表 -->
        <div class="assist-left">
          <div class="please-select">请选择</div>
          <div class="assist-lists">
            <el-checkbox-group v-model="checkedStaffIds" class="staffs" @change="changeCheckedStaffs">
              <div 
                v-for="(item,index) in availableAssistantsOrStaff"
                :key="index"
                class="el-checkbox-div"
              >
                <el-checkbox :label="item.id">
                  <div class="avaiable-assistant">
                    <img
                      class="assistAvatar"
                      :src="formatPicImage(item.headPortrait,'style', 146, 'someone')"
                    >
                    <div class="assistText">
                      <div class="assistName" :title="`${item.name}${(item.shopNum || shopStaffsInfo[item.id]) ? `(${item.shopNum || shopStaffsInfo[item.id]})` : ''}`">
                        {{item.name}}
                        <span v-if="item.shopNum || shopStaffsInfo[item.id]">({{item.shopNum || shopStaffsInfo[item.id]}})</span>
                      </div>
                      <div class="assistLevel" :title="item.levelName">
                        {{item.levelName}}
                      </div>
                    </div>
                  </div>
                </el-checkbox>
                <div class="tag-box">
                  <span 
                    class="send-type-tags text-cant-copy" 
                    :class="{active: item.isChosen}" 
                    @click.stop="item.isChosen = !item.isChosen"
                    v-if="isService && checkedStaffIds.includes(item.id)"
                  >
                    {{item.isChosen ? '指 定' : '非指定'}}
                  </span>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </div>
        <!-- 选中的助理 -->
        <div class="assist-right">
          <div class="commission-ratio-title">配置业绩分配比例</div>
          <div class="commission-ratio-lists">
            <el-form class="selected-assistants" ref="form" :model="form">
              <template v-for="(item,index) in form.checkedStaffs">
                <div class="selected-item" :key="item.id">
                  <div class="selected-info-detail">
                    <i class="iconfont icon icon-icon_sort_up arrow" v-if="index != 0"
                       @click="sortStaff(index,item.id)"></i>
                    <img
                      class="selected-avatar"
                      :src="formatPicImage(item.headPortrait,'style', 146, 'someone')"
                    >
                    <div class="selected-info">
                      <p :title="`${item.name}${(item.shopNum || shopStaffsInfo[item.id]) ? `(${item.shopNum || shopStaffsInfo[item.id]})` : ''}`">
                        {{item.name}}
                        <span v-if="item.shopNum || shopStaffsInfo[item.id]">({{item.shopNum || shopStaffsInfo[item.id]}})</span>
                      </p>
                      <!-- <span>辅助工位</span> -->
                      <span :title="item.levelName">{{item.levelName}}</span>
                    </div>
                  </div>
                  <el-form-item 
                    :prop="'checkedStaffs.'+index+'.ratio'"
                    :rules="{ required: true, validator:ratioValidator }"
                  >
                    <el-input v-model="item.ratio" :disabled="!enableAdjust">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </div>
              </template>
            </el-form>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="plain_gray_btn" @click="$emit('close')">取 消</el-button>
        <el-button class="normal_blue_btn" @click="confirmSelectStaff">确认选择</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  /**
   * 1、完全没有提成方案：不限制，可编辑
   * 2、有提成方案
   *      人数大于提成方案人数：不允许
   *      人数不大于提成方案人数：提示再选人数    或者
   * */
  import * as utils from "@/assets/js/utils";
  import * as axios from "@/util/axios";
  import {mapState} from "vuex";

  export default {
    props: {
      showAddAssistants: Boolean,
      availableAssistantsOrStaff: Array,
      mainStaffId: {
        type: Number,
        default: 0,
      },
      isService: {
        type: Boolean,
        default: false
      }
    },
    data() {
      let ratioValidator = (rule, value, callback) => {
        if (value < 0 || value > 100) {
          callback("0-100之间的数字")
        } else {
          let bool = /^(100|(([1-9]){1}[0-9]?|0{1})((\.)([0-9]){1,2})?)$/.test(value);
          if (bool) {
            callback()
          } else {
            callback("最多两位小数")
          }
        }
      };
      return {
        formatPicImage: utils.formatPicImage,
        checkedStaffIds: [],
        currentStaffType: "assistant",
        allocationModelList: [],
        autoAllocate: false,
        enableAdjust: false,
        form: {
          checkedStaffs: [],
        },
        ratioValidator,
      };
    },
    watch: {
      checkedStaffIds(newValue, oldValue) {
        if (newValue.length >= 6) {
          this.checkedStaffIds = oldValue;
          this.$message({type: "warning", message: "选择的人数已达上限"})
        }
      }
    },
    computed: {
      ...mapState({
        currentInfo: state => state.manage.currentInfo,
        shopStaffsInfo: state => state.shopStaffsInfo.infoMap, // -员工编号
      }),
      /*
      * 什么时候禁止添加更多：
      *   1、人数达上限（5人上限或者是提成的模板的上限）
      *   2、已经点击声明了不需要助理（此时为不可点击状态，自然也就无法点击）
      * */
      staffSelectedDisabled() {
        let staffLength = this.checkedStaffIds.length;
        let allocationModel = this.allocationModelList.sort((prior, forward) => {
          return forward.numberOfPeople - prior.numberOfPeople;
        })[0];
        if (allocationModel) {
          let allocationModelLength = allocationModel.numberOfPeople;
          if (staffLength > 5 || staffLength > allocationModelLength) {
            return true;
          } else {
            return false;
          }
        } else {
          return false
        }
      }
    },
    methods: {
      /*
      * 点击箭头为助理或者销售人重新排序
      * */
      sortStaff(index) {
        let ids = JSON.parse(JSON.stringify(this.checkedStaffIds));
        let tempId = ids.splice(index, 1)[0];
        ids.splice(index - 1, 0, tempId);
        this.checkedStaffIds = ids;
        this.changeCheckedStaffs();
      },
      confirmSelectStaff() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.checkedStaffIds.length === 0) {
              this.$emit("confirmSelectStaff", []);
              return;
            }
            let total = this.form.checkedStaffs.map(item => Number(item.ratio)).reduce((i, j) => {
              return i + j
            });
            if (total !== 100 && this.checkedStaffIds.length !== 0) {
              this.$message({type: "warning", message: "业绩分配比例之和应该为100"});
              return
            }
            let checkedStaffs = this.form.checkedStaffs.map(item => {
              item.ratio = Number(item.ratio);
              return item;
            });
            // - 需要加一道工序， 把左侧的是否指定赋值给checkedStaffs
            let checkedArr = this.availableAssistantsOrStaff.filter(i => {return this.checkedStaffIds.includes(i.id)}) // 选中的人的属性
            let obj = {}
            checkedArr.map(i => { obj[i.id] = i.isChosen })
            checkedStaffs.map(i => { i.isChosen = obj[i.id] })
            // - 以上操作完成指定、非指定赋值
            this.$emit("confirmSelectStaff", checkedStaffs);
          } else {
            console.warn("ERROR SUBMIT")
          }
        });
      },

      getPerformanceAllocation(staffType) {
        axios.post("/getPerformanceAllocation", {
          storeId: this.currentInfo.shopId,
          type: staffType
        }).then(res => {
          this.allocationModelList = res.allocationModel || [];
          this.autoAllocate = res.autoAllocate;
          this.enableAdjust = res.enableAdjust;
          this.changeCheckedStaffs();
        })
      },

      changeCheckedStaffs() {
        if (this.staffSelectedDisabled) {
          this.checkedStaffIds = this.checkedStaffIds.splice(0, this.checkedStaffIds.length - 1);//这句的意思是即使你已经选上了第六个，也给你裁减掉（仅保留5个）
          this.$message({type: "warning", message: "选择人数已达上限"});
          return
        }

        let staffIds = this.checkedStaffIds,
          len = staffIds.length,
          availableAssistantsOrStaff = this.availableAssistantsOrStaff;
        if (len === 0) {
          this.form.checkedStaffs = []
        } else if (len === 1) {
          let oneStaff = availableAssistantsOrStaff.filter(item => item.id === staffIds[0])[0];
          this.form.checkedStaffs = [{
            ...oneStaff,
            id: oneStaff.id,
            ratio: 100,
            staffName: oneStaff.name
          }]
        } else {
          this.form.checkedStaffs = this.changeCheckedStaffsInMany()
        }

      },

      changeCheckedStaffsInMany: function () {
        let staffIds = this.checkedStaffIds,                              //被选择的id
          len = staffIds.length,
          availableAssistantsOrStaff = this.availableAssistantsOrStaff,   //所有的助理
          filterCheckedStaffs = [];                                       //用于填充助理信息的数组
        for (let index = 0; index < len; index++) {
          const id = staffIds[index];
          let staff = availableAssistantsOrStaff.filter(item => item.id === id)[0];
          filterCheckedStaffs.push({
            ...staff,
            id: staff.id,
            staffName: staff.name,
            ratio: this.ratioTransfer(index, len)
          })
        }
        return filterCheckedStaffs;
      },
      ratioTransfer(index, len) {
        if (this.autoAllocate) {
          if (len === 3) {
            return !index ? 34 : 33
          } else {
            return 100 / len
          }
        } else {
          let allocationModelList = this.allocationModelList,             //所有可用的提成模式
            staffIds = this.checkedStaffIds,                              //被选择的id
            len = staffIds.length,
            applicableAllocationModel = (allocationModelList.filter(item => item.numberOfPeople === len)[0] || {}).allocationModel;

          let matching = {
            0: "first",
            1: "second",
            2: "third",
            3: "forth",
            4: "fifth"
          };
          return applicableAllocationModel[matching[index]];
        }
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "@/assets/css/scrollbar.scss";

  * {
    box-sizing: border-box;
  }

  .assistContent {
    width: 100%;
    border-top: 1px solid #f0f1f4;
    padding: 27px 26px 26px 29px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;


    .assist-left {
      width: 60%;
      height: 380px;
      background-color: #f4f5f7;
      display: flex;
      flex-direction: column;

      .please-select {
        padding: 10px 0 0 17px;
        color: #666666;
        font-size: 14px;
        margin-bottom: 14px;
      }

      .assist-lists {
        flex: auto;
        overflow-y: auto;
        @include scroll-bar(4px, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
        overflow-x: hidden;

        .staffs {
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          .el-checkbox-div {
            width: 50%;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            padding: 0 4px 0 26px;
            position: relative;
          }
          .el-checkbox {
            margin: 0;
            box-sizing: border-box;
            flex: 1;
            height: 55px;

            .avaiable-assistant {
              display: flex;
              flex-wrap: nowrap;
              justify-content: flex-start;
              overflow-x: hidden;

              .assistAvatar {
                width: 35px;
                height: 35px;
                margin-right: 7px;
                border-radius: 50%;
              }

              .assistText {
                .assistName {
                  color: #333333;
                  font-size: 15px;
                  line-height: 21px;
                }

                .assistName, .assistLevel {
                  // max-width: 74px;
                  max-width: 124px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                .assistLevel {
                  color: #999999;
                  line-height: 1;
                  font-size: 12px;
                  max-width: 72px;
                }
              }
            }
          }
          .tag-box {
            width: 52px;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-items: center;
            position: absolute;
            right: 4px;
            bottom: 6px;
          }
        }
      }
    }

    .assist-right {
      width: 40%;
      height: 380px;
      background-color: #dee1e6;
      height: 380px;
      display: flex;
      flex-direction: column;
      @include scroll-bar(
          6px,
          rgba(131, 107, 107, 0.2),
          rgba(111, 111, 111, 0)
      );

      .commission-ratio-title {
        padding: 10px 0 0 44px;
        color: #666666;
        font-size: 14px;
        margin-bottom: 14px;
      }

      .commission-ratio-lists {
        width: 100%;
        flex: auto;
        overflow-y: auto;
        @include scroll-bar(
            6px,
            rgba(131, 107, 107, 0.2),
            rgba(111, 111, 111, 0)
        );
        overflow-x: hidden;
        padding-right: 30px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;

        .selected-assistants {
          .selected-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-left: 44px;
            position: relative;
            width: 100%;

            .selected-info-detail {
              display: flex;

              .arrow {
                width: 40px;
                font-size: 14px;
                line-height: 40px;
                color: #00cf82;
                position: absolute;
                left: 0;
                top: 0;
                text-align: center;
                cursor: pointer;
                align-items: center;
              }

              .selected-avatar {
                width: 35px;
                height: 35px;
                margin-right: 7px;
                border-radius: 50%;
              }

              .selected-info {
                height: 100%;
                display: flex;
                flex-direction: column;
                align-content: space-between;
                align-items: flex-start;

                p {
                  width: 90px;
                  color: #333333;
                  font-size: 15px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  position: relative;

                  &:after {
                    content: "";
                    background: linear-gradient(to left, #dee1e6, rgba(222, 225, 230, 0.3));
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 10px;
                    height: 100%;
                  }
                }

                span {
                  display: inline-block;
                  width: 90px;
                  color: #999999;
                  font-size: 12px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  position: relative;
                }
              }
            }

            .el-form-item {
              margin-bottom: 0;

              /deep/ .el-input {
                width: 100px;

                .el-input__inner {
                  background: #F4F4F4;
                  padding: 0 10px;
                }

                .el-input-group__append {
                  width: 40px;
                  padding: 0;
                  text-align: center;
                  background: #F5F7FA;
                  color: #333333;
                }
              }
            }
          }
        }
      }
    }
  }


  .dialog-footer {
    overflow: hidden;
  }

  /deep/ .el-dialog__body {
    padding: 0;
  }

  /deep/ .el-checkbox {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }

  .send-type-tags {
    border-radius: 12px;
    padding: 0px 4px;
    font-size: 10px;
    display: inline-block;
    width: 50px;
    height: 18px;
    text-align: center;
    margin-top: 12px;
    cursor: pointer;
    // border: 1px solid rgba(193, 192, 201, 1);
    color: #fff;
    background: #BEC3C6;
    &.active {
      background: #58C9F3;
    }
  }
</style>
