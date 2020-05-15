<template>
  <div class="pages-main-box scrollbar">
    <div class="pages-edit-container">
      <div class="BeautyRecord text-for-copy">
        <div class="BeautyLeft">
          <g-avatar
            :pic="ruleForm.baseInfo.headPortrait"
            @uploadPic="uploadPic"
            :disabled="ruleForm.baseInfo.belongStoreId !== currentInfo.shopId || currentEntry === 'brand'"
            :remarkPic="ruleForm.baseInfo.remarkHeadPortrait"
            :six="ruleForm.baseInfo.sex"
            :stext="'展示头像'"
          ></g-avatar>
        </div>
        <div class="BeautyRight">
          <el-row type="flex" align="bottom" class="userName">
            <span>{{ruleForm.baseInfo.name||'佚名'}}</span>
            <!-- <img :src="ruleForm.baseInfo.memberLevel==='普通会员'?mlImg:''" alt /> -->
            <p><span class="send-type-tags">{{ruleForm.baseInfo.memberLevel}}</span>
              会员编号：{{ruleForm.baseInfo.memberSerialNo||'暂无数据'}}</p>
          </el-row>

          <div class="userInfo">
            <div class="userInfoTitle weight">个人信息</div>
            <div class="userInfoContent">
              <el-form
                :model="ruleForm.baseInfo"
                :rules="rules"
                :disabled="ruleForm.baseInfo.belongStoreId !== currentInfo.shopId"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-row :gutter="50">
                  <el-col :span="10">
                    <el-form-item label="客户姓名" prop="name">
                      <el-input placeholder="请输入客户姓名" v-model="ruleForm.baseInfo.name"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="50">
                  <el-col :span="10">
                    <el-form-item label="备注昵称" prop="nickName">
                      <el-input
                        v-model="ruleForm.baseInfo.nickName"
                        placeholder="请输入客户备注昵称"
                        maxlength="16"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="性别" prop="sex">
                      <el-select
                        v-model="ruleForm.baseInfo.sex"
                        placeholder="请选择性别"
                        ref="scrollSelect0"
                        :popper-append-to-body="false"
                      >
                        <el-option
                          :label="item.label"
                          :value="item.label"
                          v-for="item in sexList"
                          :key="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="50">
                  <el-col :span="10">
                    <el-form-item label="手机号码" prop="mobile">
                      <el-input v-model="ruleForm.baseInfo.mobile" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="微信号" prop="weChat">
                      <el-input v-model="ruleForm.baseInfo.weChat" placeholder="请输入微信号"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="50">
                  <el-col :span="10">
                    <el-form-item label="归属门店">
                      <el-input disabled v-model="ruleForm.baseInfo.belongStoreName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="服务者" prop="staffName">
                      <!-- 门店端 不是归属门店 显示input -->
                      <el-input
                        v-if="ruleForm.baseInfo.belongStoreId !== currentInfo.shopId"
                        disabled
                        v-model="ruleForm.baseInfo.serverName"
                      />
                      <!-- 门店端 是归属门店自己 显示下拉选择且可编辑 -->
                      <label
                        class="mask-label"
                        v-if="ruleForm.baseInfo.belongStoreId === currentInfo.shopId"
                      >
                        <div
                          class="mask-info"
                          :class="{opacity: reSelected}"
                        >{{ruleForm.baseInfo.serverName}}
                        </div>
                        <!-- :popper-append-to-body="false" -->
                        <el-select
                          v-if="ruleForm.baseInfo.belongStoreId === currentInfo.shopId"
                          v-model="ruleForm.baseInfo.serverId"
                          placeholder="请选择服务者"
                          ref="scrollSelect1"
                          @change="handleServerChanged"
                        >
                          <el-option
                            v-for="item in staffOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </label>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="50">
                  <el-col :span="10">
                    <el-form-item label="生日" prop="birthday">
                      <el-date-picker
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        v-model="ruleForm.baseInfo.birthDay"
                        type="date"
                        placeholder="请输入生日"
                        :clearable="false"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="星座">
                      <el-select
                        ref="scrollSelect2"
                        v-model="ruleForm.baseInfo.constellation"
                        :popper-append-to-body="false"
                        placeholder="请选择客户星座"
                      >
                        <el-option
                          v-for="item in constellation"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="50">
                  <el-col :span="10">
                    <el-form-item label="客户来源" prop="customerSource">
                      <el-select
                        ref="scrollSelect3"
                        v-model="ruleForm.baseInfo.source"
                        :popper-append-to-body="false"
                        placeholder="请选择客户来源"
                      >
                        <el-option
                          v-for="item in sources"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="居住地" placeholder="请输入居住地">
                      <province-city-select
                        ref="scrollSelect4"
                        @change="getAddress"
                        :myAddress="ruleForm.baseInfo.myAddress"
                      ></province-city-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="50">
                  <el-col :span="10">
                    <el-form-item label="消费周期" prop="consumptionCycle">
                      <el-input v-model="ruleForm.baseInfo.consumptionCycle" placeholder="限填数字">
                        <template slot="append">
                          天
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>

          <!-- 关键数据 -->
          <!-- <div class="UserData">
            <div class="userDataTitle weight">关键数据</div>
            <div class="userDataContent">
              <div
                :class="{userDataItem:true,active:item.id%4 == 0} "
                v-for="(item,index) in ruleForm.keyData.keyValBeans"
                :key="index"
              >
                <p>{{item.name}}</p>
                <span>{{item.value}}</span>
              </div>
            </div>
          </div>-->

          <!-- 客户标签 shop -->
          <div class="UserLabel">
            <el-row type="flex" justify="space-between" align="middle">
              <div class="userLabelTitle weight">客户标签</div>
              <!-- <el-popover
                placement="top-start"
                title="添加标签"
                width="200"
                trigger="click"
                >
                <div class="new-tag__modal">
                  <el-input placeholder="输入自定义标签" maxlength="12" v-model="ruleForm.baseInfo.tags">
                    <div class="text" slot="append" @click="addNewTagFn">新增</div>
                  </el-input>
                </div>
                <div class="new-tag" slot="reference"><i class="icon iconfont icon-icon_ope_append"></i>添加标签</div>
              </el-popover>-->
            </el-row>
            <div class="userLabelContent">
              <div
                class="userLabelItem"
                v-for="(item,index) in ruleForm.baseInfo.tags"
                :key="index"
              >{{item.name}}
              </div>
              <div v-if="ruleForm.baseInfo.tags&&ruleForm.baseInfo.tags.length===0">暂无标签</div>
            </div>
          </div>
          <!-- 备注 -->
          <div class="Notes" style="width:500px">
            <div class="notesTitle">备注</div>
            <input-with-count
              :length="150"
              :autosize="{minRows:5,maxRows:100}"
              v-model="ruleForm.baseInfo.remark"
            ></input-with-count>
          </div>
          <!-- 底部按钮 -->
          <div class="buttons">
            <el-button
              type="primary"
              @click="saveModify"
              :loading="btnLoading"
              v-if="checkHasBtnPermission(`shop_customer_customerRecord_base_save`)"
            >保存修改
            </el-button>
            <!-- <el-button>门店转出</el-button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as axios from '@/util/axios'
  import * as utils from '@/assets/js/utils'
  import * as datas from '@/assets/js/datas'
  import CountList from '@/components/staff/count-list'
  import CardList from '@/components/staff/card-list'
  import {regionData} from 'element-china-area-data'
  import InputWithCount from '@/components/common/InputWithCount'
  import {mapState} from 'vuex'
  import {reg, checkReg} from '@/assets/js/RegExp'
  import {types} from 'util'

  export default {
    data () {
      let validateWeixin = (rule, value, callback) => {
        if (value && value.length > 0) {
          if (checkReg(reg['weixin'], value)) {
            callback()
          } else {
            callback(new Error('请输入正确的微信号!'))
          }
        } else {
          callback()
        }
      }
      let validatePhone = (rule, value, callback) => {
        console.log(value)
        if (reg.phone.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的手机号'))
        }
      }
      return {
        ruleForm: {
          baseInfo: {
            id: 1,
            name: '',
            tags: [],
            nickName: '',
            mobile: '',
            weChat: '',
            sex: '',
            birthDay: '',
            constellation: '',
            liveCity: '',
            liveProvince: '',
            serverId: 1,
            serverName: '',
            source: '',
            remark: '',
            belongStoreName: '',
            myAddress: {},
            headPortrait: '',
            remarkHeadPortrait: '',
            consumptionCycle: '',
          },
          keyData: {
            keyValBeans: []
          }
        },
        btnLoading: false,
        // 表单验证规则
        rules: {
          sex: [{required: true, message: '请选择性别', trigger: 'change'}],
          mobile: [{required: true, message: '请输入手机号', validator: validatePhone, trigger: 'change'}],
          weChat: [
            {
              required: false,
              message: '请输入正确的微信号！',
              validator: validateWeixin,
              trigger: 'blur'
            },
            {
              required: false,
              message: '请输入正确的微信号！',
              validator: validateWeixin,
              trigger: 'change'
            }
          ],
          name: [
            {required: true, message: '请输入客户姓名', trigger: 'blur'},
            {required: true, message: '请输入客户姓名', trigger: 'change'}
          ],
          nickName: [
            {required: true, message: '请输入客户备注昵称', trigger: 'blur'},
            {required: true, message: '请输入客户备注昵称', trigger: 'change'}
          ]
          // staffName: [
          //   { required: true, message: "请输入服务者", trigger: "blur" }
          // ],
          // customerSource: [
          //   { required: true, message: "请选择客户来源", trigger: "blur" }
          // ],
          // birthday: [{ required: true, message: "请选择生日", trigger: "blur" }]
        },
        //备注
        notes: '',
        sexList: [
          {
            label: '男',
            value: 1
          },
          {
            label: '女',
            value: 2
          },
          {
            label: '保密',
            value: null
          }
        ],
        mlImg: require('@/assets/images/memberlervel/img_flag_normal.png'),
        editable: false,
        reSelected: false,
        sources: [],
        staffOptions: [],
        constellation: [
          {name: '摩羯座'},
          {name: '水瓶座'},
          {name: '双鱼座'},
          {name: '白羊座'},
          {name: '金牛座'},
          {name: '双子座'},
          {name: '巨蟹座'},
          {name: '狮子座'},
          {name: '处女座'},
          {name: '天秤座'},
          {name: '天蝎座'},
          {name: '射手座'}
        ],
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
      }
    },
    components: {
      'count-list': CountList,
      'card-list': CardList,
      'input-with-count': InputWithCount
    },
    computed: {
      ...mapState(['queryParams']),
      currentInfo () {
        return this.$store.state.manage.currentInfo
      },
      currentEntry () {
        return this.$store.state.authRouter.currentEntry
      },
      sourceComputed () {
        let sourcesMap = {}
        this.sources.forEach(v => {
          sourcesMap[v.id] = v.name
        })
        return sourcesMap[this.ruleForm.baseInfo.source]
      }
    },
    mounted () {
      this.getCustomerBaseInfoById()
      let page = document.getElementsByClassName('pages-main-box')[0]
      page.addEventListener('scroll', this.closeDropdown, false)
    },
    methods: {
      getCustomerBaseInfoById () {
        axios
        // .get(`/getCustomerBaseInfoById/` + this.queryParams.beautyRecordId)
          .get(`/getCustomerBaseInfoById/${this.$route.params.id}`)
          .then(res => {
            this.editable = res.editable
            this.ruleForm = res
            this.ruleForm.baseInfo.myAddress = {
              province: res.baseInfo.liveProvince,
              city: res.baseInfo.liveCity
            }
          })
          .then(() => {
            axios
              .get(`/getSimpleStaffListByShopId/${this.ruleForm.baseInfo.belongStoreId || this.currentInfo.shopId}`)
              .then(res => {
                this.staffOptions = res.staffList
              })
          })
          .then(() => {
            axios
              .get(`/getStoreCustomerListFilter/${this.currentInfo.shopId}`)
              .then(res => {
                this.sources = res.sources
                this.sources.shift()
              })
          })
      },
      getAddress (data) {
        this.ruleForm.baseInfo.myAddress = data
        this.ruleForm.baseInfo.liveProvince = data.province
        this.ruleForm.baseInfo.liveCity = data.city
      },
      saveModify () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.btnLoading = true
            let params = JSON.parse(JSON.stringify(this.ruleForm.baseInfo))
            let tags = []
            delete params.belongStoreName
            params.tags.forEach(tag => {
              tags.push(tag.id)
            })
            params.tags = tags
            axios
              .post(`/updateCustomerBaseInfo`, params)
              .then(res => {
                if (res.success) {
                  // let args = {
                  //   isPath: true,
                  //   time: 320,
                  //   loading: "btnLoading"
                  // };
                  // this.deplay(args); // 如果用关闭方法这里就不要了
                  utils.showTip(this, {
                    msg: res.message,
                    type: res.success ? 'success' : 'error'
                  })
                  this.btnLoading = false
                }
              })
              .catch(error => {
                this.$message({type: 'error', message: '保存失败'})
                this.btnLoading = false
              })
          } else {
            console.warn('error submit')
          }
        })
      },
      /**展示上传的头像 */
      uploadPic (data) {
        // this.ruleForm.baseInfo.headPortrait = data.fileKey;
        this.ruleForm.baseInfo.remarkHeadPortrait = data.fileKey
      },
      handleServerChanged () {
        this.reSelected = true
      },
      closeDropdown () {
        // [性别, 服务者, 星座, 客户来源, 居住地]
        [...Array(5).keys()].map(dom => {
          // 级联的隐藏参考 testPages.vue, 此处对 ProvinceCitySelect.vue 进行了封装处理
          this.$refs[`scrollSelect${dom}`].handleClose()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/css/scrollbar.scss";

  * {
    box-sizing: border-box;
  }

  .pages-main-box {
    width: calc(100vw - 40px);
    height: calc(100vh - 105px);
    padding: 0 20px 20px;
    margin-top: 85px;
    overflow-y: auto;
    box-sizing: content-box;

    .pages-edit-container {
      min-height: calc(100vh - 105px);
    }
  }

  .new-tag {
    width: 80px;
    padding-bottom: 5px;
    color: rgba(88, 201, 243, 1);
    font-size: 14px;
    font-family: PingFangSC-Regular;
    cursor: pointer;

    i {
      font-size: 14px;
      padding-right: 5px;
    }
  }

  .BeautyRecord {
    // width: 100%;
    // max-width: 1440px;
    // min-height: 100vh;
    // border-radius: 8px;
    // background-color: white;
    // padding: 35px 21px 32px 70px;
    // margin: 0px auto;
    // display: flex;
    // flex-wrap: nowrap;
    // justify-content: flex-start;
    max-width: 1440px;
    min-height: 100%;
    box-sizing: border-box;
    padding: 40px 70px;
    margin: 0 auto;
    background: #fff;
    border-radius: 6px;
    display: flex;

    .BeautyLeft {
      width: 20%;
    }

    .BeautyRight {
      width: 80%;

      /deep/ .el-input__inner {
        max-width: 200px;
      }

      /deep/ .el-form-item__label {
        color: #666666;
      }

      .weight {
        font-weight: 600;
      }

      .userName {
        width: 100%;
        height: 30px;
        margin-bottom: 20px;

        span:first-child {
          color: #333333;
          font-size: 22px;
          font-weight: 600;
          line-height: 19px;
        }

        img:nth-child(2) {
          width: 32px;
          height: 14px;
          margin: 0 10px;
        }

        p {
          display: inline-block;
          color: rgba(153, 153, 153, 1);
          font-size: 12px;
          line-height: 12px;
        }
      }

      /* 个人信息 */
      .userInfo {
        margin-bottom: 20px;

        .userInfoTitle {
          width: 100%;
          color: #333333;
          font-size: 16px;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .userInfoContent {
          width: 100%;
          border: 1px solid #f0f1f4;
          padding: 20px 52px 0;
        }

        .mask-label {
          display: inline-block;
          width: 200px;
          height: 40px;
          line-height: 40px;
          position: relative;
        }

        .mask-info {
          top: 1px;
          left: 2px;
          width: 174px;
          height: 38px;
          z-index: 10;
          text-indent: 14px;
          background: #fff;
          position: absolute;

          &.opacity {
            opacity: 0;
          }
        }
      }

      /* 关键数据 */
      .UserData {
        margin-bottom: 20px;

        .userDataTitle {
          width: 100%;
          color: #333333;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .userDataContent {
          width: 100%;
          border: 1px solid #f0f1f4;
          padding: 21px 0 30px;
          display: flex;
          flex-wrap: wrap;
          align-content: space-between;

          .userDataItem {
            height: 53px;
            text-align: center;
            display: flex;
            flex-wrap: wrap;
            align-content: space-between;
            justify-content: center;
            border-right: 1px solid #d5dadf;

            &.active {
              border: 0;
            }

            p {
              width: 100%;
              color: #333333;
              font-size: 18px;
            }

            span {
              color: #666666;
              font-size: 14px;
            }
          }
        }
      }

      /* 客户标签 */
      .UserLabel {
        margin-bottom: 20px;

        .userLabelTitle {
          width: 100%;
          color: #333333;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .userLabelContent {
          width: 100%;
          border: 1px solid #f0f1f4;
          border-radius: 4px;
          padding: 20px 30px 20px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;

          .userLabelItem {
            padding: 6px 15px;
            font-size: 12px;
            color: #666666;
            border: 1px solid #ced4da;
            margin-right: 15px;
            margin-bottom: 15px;
            border-radius: 17px;
          }
        }
      }

      /* 备注 */
      .Notes {
        margin-bottom: 40px;

        .notesTitle {
          width: 100%;
          color: #333333;
          font-size: 16px;
          margin-bottom: 8px;
        }
      }

      /* 底部按钮 */
      .buttons {
        width: 100%;
        height: auto;
        margin-top: 40px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
      }
    }
  }

  /deep/ .el-button--primary {
    background-color: #58c9f3;
    border: 0;
  }

  /deep/ .el-form-item__content {
    padding-left: 26px;
  }

  // 会员级别
  .send-type-tags {
    margin-left: 4px;
    border-radius: 12px;
    padding: 0px 3px;
    font-size: 10px !important;
    border: 1px solid #B2BBDC;
    background: #B2BBDC;
    color: #fff !important;
    line-height: 12px !important;
  }
</style>
