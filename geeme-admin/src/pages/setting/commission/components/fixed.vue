<template>
  <div class="fixed-commission-wrapper">
    <div class="title">
      <div style="padding:0 0 0 20px;width: 10.3%;">产品名称</div>
      <div style="padding:0 0 0 20px;width: 10.3%;">行业版本</div>
      <div style="padding:0 0 0 20px;width: 26.47%;">级别版本</div>
      <div style="padding:0 0 0 20px;width: 26.47%;">提成方式</div>
      <div style="padding:0 0 0 20px;width: 26.47%;">提成</div>
    </div>
    <div class="system-wrapper" v-for="item in content" :key="item.name">
      <div class="system">
        <span>{{item.name}}</span>
        <span class="setting">批量设置</span>
      </div>
      <div class="system-info">
        <div class="industry-wrapper" v-for="i in item.version" :key="i.name">
          <div class="industry">
            <span>{{item.name}}</span>
            <span class="setting">批量设置</span>
          </div>
          <div class="industey-info">
            <div class="version-wrapper" v-for="j in i.version" :key="j.name">
              <div class="version">
                <div style="flex: 1;padding: 0 0 0 20px;">{{j.name}}</div>
                <div style="flex: 1;">
                  <a-select :defaultValue="1" style="width: 100px;">
                    <a-select-option :value="1">固定提成</a-select-option>
                    <a-select-option :value="0">比例提成</a-select-option>
                  </a-select>
                </div>
                <div style="flex: 1;">
                  <a-input class="num" addonAfter="元" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: [
        {
          name: "商家系统",
          version: [
            {
              name: "丽人通用版",
              version: [
                {
                  name: "标准版"
                },
                {
                  name: "专业版"
                },
                {
                  name: "旗舰版"
                }
              ]
            },
            {
              name: "专业美容版",
              version: [
                {
                  name: "标准版"
                },
                {
                  name: "专业版"
                },
                {
                  name: "旗舰版"
                }
              ]
            },
            {
              name: "医院版",
              version: [
                {
                  name: "标准版"
                },
                {
                  name: "专业版"
                },
                {
                  name: "旗舰版"
                }
              ]
            }
          ]
        },
        {
          name: "供应商系统",
          version: [
            {
              name: "丽人通用版",
              version: [
                {
                  name: "标准版"
                },
                {
                  name: "专业版"
                },
                {
                  name: "旗舰版"
                }
              ]
            }
          ]
        }
      ]
    };
  }
};
</script>

<style lang="less" soped>
.fixed-commission-wrapper {
   /* 总体 */
    font-size: 14px;
    color: #333333;
  .title {
    height: 60px;
    display: flex;
    div {
      /* height: 100%; */
      line-height: 60px;
    }
  }
  .system-wrapper {
    display: flex;
    margin: -1px 0;
    .system {
      width: 10.3%;
      padding: 0 0 0 20px;
      border: 1px solid #f0f1f4;
      border-bottom: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .system-info {
      width: 89.7%;
      margin: 1px 0;
      .industry-wrapper {
        width: 100%;
        display: flex;
        margin: -1px 0;
        .industry {
          width: 11.5%;
          padding: 0 0 0 20px;
          border: 1px solid #f0f1f4;
          border-left: none;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .industey-info {
          width: 88.5%;
          margin: 1px 0;
          .version-wrapper {
            width: 100%;
            margin: -1px 0;
            .version {
              border: 1px solid #f0f1f4;
              border-left: none;
              display: flex;
              align-items: center;
              height: 60px;
            }
          }
        }
      }
    }
    &:last-child .system {
      border-bottom: 1px solid #f0f1f4;
    }
    .setting {
      color: rgba(88, 201, 243, 1);
      font-size: 12px;
      cursor: pointer;
    }
    .num {
      /deep/ .ant-input-group-addon {
        color: #ffffff;
        background: #d5dadf;
      }
      width: 100px;
    }
  }
}
</style>