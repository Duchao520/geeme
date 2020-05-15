<template>
  <div class="root-root">
    <div class="con">
      <div class="release-time margin-bottom" v-if="worksType!=='WorkStatus'">
        <el-radio-group v-model="rakingType">
          <el-radio-button
            v-for="(item,index) in [{name:'员工榜单',value:'StaffRanking'},{name:'作品榜单',value:'WorkRanking'}]"
            :key="index"
            :label="item.value"
          >{{item.name}}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="first">
        <div class="release-time">
          <!-- <span v-if="currentEntry==='brand'">隶属门店：
            <el-select v-model="belongShop" placeholder="全部" class="select-input">
              <el-option :label="item.label" :value="item.id" v-for="(item, index) in belongShops" :key="index"></el-option>
            </el-select>
          </span> -->
          <span
          >{{worksType==='WorkStatus'?'发布':'统计'}}时间：</span>
          <el-radio-group v-model="time" @change="limitTime">
            <el-radio-button
              v-for="(item,index) in timeDays"
              :key="index"
              :label="item.value"
            >{{item.name}}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div>
          <el-date-picker
            class="date-picker"
            v-model="date_"
            type="datetimerange"
            unlink-panels
            range-separator="至"
            align="left"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="limitDate"
          ></el-date-picker>
        </div>
      </div>
      <div class="second" v-if="worksType==='WorkStatus' && tags.length">
        <div class="fixed-container">
          <!-- @click.native="getWorkDynamic" -->
          <separate-button-groups 
            label="id"
            name='name' 
            count="tagCount" 
            :list="tags" 
            v-model="billType"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import * as utils from "@/assets/js/utils";
  import * as axios from '@/util/axios'

  export default {
    props: {
      worksType: String,
      currentStatus: String,
      currentEntry: String
    },
    data() {
      return {
        utils: utils,
        timeLimit: 0 ,
        billType: -2,
        tag: null,
        date_: [],
        time: 0,
        timeDays: [
          {
            name: "全部",
            value: 0
          },
          {
            name: "近3天",
            value: -3
          },
          {
            name: "近7天",
            value: -7
          }
        ],
        belongShops: [],
        belongShop: null,
        tags: [],
        rakingType: "StaffRanking"
      };
    },
    computed: {
      params() {
        let begin, end;
        if (Array.isArray(this.timeLimit)) {
          end = this.timeLimit[1];
          begin = this.timeLimit[0];
        } else {
          end = utils.getZeroTime(1);
          console.log({"this.timeLimit":this.timeLimit});
          if (this.timeLimit === 0) {
            begin = "";
          } else {
            begin = utils.getZeroTime(this.timeLimit);
          }
        }
        return {
          begin,
          end,
          scope: this.billType
        };
      },
      currentInfo() {
        return this.$store.state.manage.currentInfo
      }
    },
    watch: {
      // 监听tags有无，兼容页面样式
      'tags'(val) {
        console.log(val)
        if (val.length) {
          this.$emit('hasTags')
        }
      },
      billType() {
        this.$emit("changeTime", this.params);
      },
      rakingType(rakingType) {
        this.date_ = []
        this.timeLimit = this.time = 0
        this.$emit("changeTableType", rakingType);
        this.$emit("changeTab");
      },
      worksType(value) {
        this.date_ = []
        this.timeLimit = this.time = 0
        value === 'WorkStatus' && this.getshopList()
        this.rakingType = value
        this.$emit("changeTab");
      }
    },
    mounted() {
      this.staffDynamicWorksCountInfo()
    },
    methods: {
      limitTime(time) {
        this.timeLimit = time;
        this.date_ = [];
        this.$emit("changeTime", this.params);
      },
      limitDate(time) {
        this.timeLimit = time;
        this.time = null
        this.$emit("changeTime", this.params);
      },
      staffDynamicWorksCountInfo() {
        let params = {};
        if (this.currentEntry === 'brand') {
          params = {
            brandId: this.currentInfo.brandId
          }
        } else {
          params = {
            storeId: this.currentInfo.shopId
          }
        }
        axios.post('getDynamicCountByTag', params).then((res) => {
          this.tags = res.staffDynamicCountInfoList ? res.staffDynamicCountInfoList : [];
        })
      },
      getshopList() {
        axios.get('findShopList/' + this.currentInfo.brandId).then((res) => {
          this.belongShops = [...res]
        })
      }
      // clearData() {
      //   this.date_ = null
      // }
    }
  };
</script>

<style lang="scss" scoped>
  @mixin button($color, $border, $bg) {
    background: $bg;
    color: $color;
    border: 1px solid $border;
    line-height: 26px;
    font-size: 12px;
    box-sizing: border-box;
    padding: 0 9px;
    border-radius: 3px;
    margin-right: 4px;
  }

  .select-input {
    /deep/ input {
      height: 36px;
    }
  }

  .root-root {
    .con {
      box-sizing: border-box;
      padding: 20px;
      background: #fff;
      border-radius: 4px;

      .first {
        display: flex;
        align-items: center;

        /deep/ .el-radio-button__inner {
          display: block;
          padding: 0 20px;
          line-height: 35px;
          font-size: 14px;
        }

        .date-picker {
          margin-left: 10px;
        }

        /deep/ .el-range-editor.el-input__inner {
          height: 36px;
        }
      }

      .margin-bottom {
        margin-bottom: 10px;
      }

      .release-time {
        span:first-child {
          margin-left: 0px;
        }

        span {
          color: #333333;
          font-size: 14px;
          margin-left: 10px;
        }

        /deep/ .el-radio-button.is-active {
          /deep/ .el-radio-button__inner {
            background: #58c9f3;
            border-color: #58c9f3;
          }
        }

        /deep/ .el-radio-button__inner {
          height: 35px;
          text-align: center;
          line-height: 35px;
          box-sizing: border-box;
          padding-top: 0;
          padding-bottom: 0;
        }

        /deep/ .el-input__inner {
          height: 36px;
          line-height: 36px;
        }
      }

      .second {
        margin-top: 15px;
        display: flex;
        align-items: center;
        /* 容器 - 以下代码是新加的 */
        height: 38px; 
        position: relative;
        .fixed-container {
          position: absolute;
          top: 0;
          z-index: 10;
          background: #fff;
          height: 38px;
          overflow: hidden;
          &:hover {
            height: auto;
            overflow: auto;
            // box-shadow: 2px 2px 2px #fff, -2px -2px 2px #fff, 2px -2px 2px #fff, -2px 2px 2px #fff;
          }
        }
        /* 容器 - 以上代码是新加的 */
      }
    }
  }
</style>
