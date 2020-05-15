<template>
  <G-FullPage :title="title" @back="back">
    <a-spin :spinning="detailLoading" tip="认证详情获取中...">
      <div class="brand-auth-content">

        <div class="inline">
          <!-- 品牌名称 -->
          <G-Detail-Item class="item" v-bind="form.brandName">
            <template>
              <span class="detail-text">{{form.brandName.value}}</span>
              <AuthTag :status="form.authenticateBrandStatus.value"/>
            </template>
          </G-Detail-Item>
          <!-- 所属行业 -->
          <G-Detail-Item class="item" v-bind="form.tradeName">
            <span class="detail-text">{{form.tradeName.value}}</span>
          </G-Detail-Item>
        </div>
        <!-- 申请时间 -->
        <G-Detail-Item class="item" v-bind="form.createTime">
          <span class="detail-text">{{form.createTime.value}}</span>
        </G-Detail-Item>

        <div class="inline">
          <!-- 申请人 -->
          <G-Detail-Item class="item" v-bind="form.userName">
            <span class="detail-text">{{form.userName.value}}</span>
          </G-Detail-Item>
          <!-- 联系方式 -->
          <G-Detail-Item class="item" v-bind="form.mobile">
            <span class="detail-text">{{form.mobile.value}}</span>
          </G-Detail-Item>
        </div>

        <div class="inline">
          <!-- 商家名称 -->
          <G-Detail-Item class="item" v-bind="form.companyName">
            <span class="detail-text">{{form.companyName.value}}</span>
          </G-Detail-Item>
          <!-- 统一信用代码 -->
          <G-Detail-Item class="item" v-bind="form.creditCode">
            <span class="detail-text">{{form.creditCode.value}}</span>
          </G-Detail-Item>
        </div>

        <!-- 法人代表姓名 -->
        <G-Detail-Item class="item" v-bind="form.legalPerson">
          <span class="detail-text">{{form.legalPerson.value}}</span>
        </G-Detail-Item>
        <!-- 营业执照 -->
        <G-Detail-Item class="item" v-bind="form.licenseImage">
          <img style="width: 106px;" :src="utils.imgFormatter(form.licenseImage.value)"
               @click='onPreview(form.licenseImage.value)'/>
        </G-Detail-Item>
        <!-- 法人身份证 正面-->
        <G-Detail-Item class="item" v-bind="form.identityCardFront">
          <img style="width: 140px;" :src="utils.imgFormatter(form.identityCardFront.value)"
               @click='onPreview(form.identityCardFront.value)'/>
        </G-Detail-Item>
        <!-- 法人身份证 反面-->
        <G-Detail-Item class="item" v-bind="form.identityCardBack">
          <img style="width: 140px;" :src="utils.imgFormatter(form.identityCardBack.value)"
               @click='onPreview(form.identityCardBack.value)'/>
        </G-Detail-Item>
        <!-- 商标证件-->
        <G-Detail-Item class="item" v-bind="form.logeCredentialsImage">
          <img style="width: 115px;" :src="utils.imgFormatter(form.logeCredentialsImage.value)"
               @click='onPreview(form.logeCredentialsImage.value)' v-if="form.logeCredentialsImage.value"/>
          <span v-else>无</span>
        </G-Detail-Item>
        <!-- 行业资质-->
        <G-Detail-Item class="item" v-bind="form.certificationImages">
          <template v-if="form.certificationImages.value && form.certificationImages.value.length>0">
            <img style="width: 110px;margin:0 10px 0 0;" v-for="item in form.certificationImages.value" :key="item"
                 :src="utils.imgFormatter(item)" @click='onPreview(item)'/>
          </template>
          <span v-else>无</span>
        </G-Detail-Item>
        <!-- 备注说明 -->
        <G-Detail-Item class="item" v-bind="form.remarks">
          <p class="detail-text">{{form.remarks.value}}</p>
        </G-Detail-Item>
        <!-- 认证时间 --审核通过 -->
        <G-Detail-Item class="item" label="认证时间" v-if="authStatus === 1">
          <p class="detail-text">{{form.verifyStopTime.value}}</p>
        </G-Detail-Item>
        <!-- 退回原因 --审核失败 -->
        <G-Detail-Item class="item" v-bind="form.verifyComment" v-if="authStatus === 3">
          <p class="detail-text">{{form.verifyComment.value}}</p>
        </G-Detail-Item>
        <!-- 退回时间 --审核失败 -->
        <G-Detail-Item class="item" label="退回时间" v-if="authStatus === 3">
          <p class="detail-text">{{form.verifyStopTime.value}}</p>
        </G-Detail-Item>
        <!-- 审核操作 --审核中 -->
        <G-Form-Item :required="false" @textAreaChange="setVerifyCommentValue" v-bind="verifyComment"
                     v-if="authStatus === 2" style="margin: 0 0 0 -32px;"></G-Form-Item>
        <a-row>
          <a-col :span="21" :offset="3">
            <a-button
              type="primary"
              @click="submit(1)"
              style="margin-right: 20px;"
              :loading="submitLoading"
              v-if="authStatus === 2">
              审核通过
            </a-button>
            <a-button
              @click="submit(0)"
              :loading="submitLoading"
              v-if="authStatus === 2">
              退回
            </a-button>
          </a-col>
        </a-row>
        <a-modal v-model="previewVisible" :footer="null" width='80%'>
          <img :src="utils.imgFormatter(previewSrc)" style="width:80%;display:block; margin: auto; margin-top: 50px;"/>
        </a-modal>
      </div>
    </a-spin>
  </G-FullPage>
</template>

<script>
  import AuthTag from '../../components/authTag'
  import utils from '@/utils'
  import {authenticate, authenticateInfo} from '@/api/merchant'

  export default {
    components: {
      AuthTag,
    },
    data() {
      return {
        utils,
        previewVisible: false,
        previewSrc: '',
        title: '品牌认证',
        detailLoading: false,
        form: {
          brandName: {
            label: '品牌名称',
            value: null,
            layout: {label: 140, content: 300}
          },
          tradeName: {
            label: '所属行业',
            value: null,
            layout: {label: 100, content: 300}
          },
          authenticateBrandStatus: {
            value: null,
          },
          createTime: {
            label: '申请时间',
            value: null,
          },
          userName: {
            label: '申请人',
            value: null,
            layout: {label: 140, content: 300}
          },
          mobile: {
            label: '联系方式',
            value: null,
            layout: {label: 100, content: 300}
          },
          companyName: {
            label: '商家名称',
            value: null,
            layout: {label: 140, content: 300}
          },
          creditCode: {
            label: '统一信用代码',
            value: null,
            layout: {label: 100, content: 300}
          },
          legalPerson: {
            label: '法人代表姓名',
            value: null,
          },
          licenseImage: {
            label: '营业执照',
            value: null,
          },
          identityCardFront: {
            label: '法人身份证<br/>(正面)',
            value: null,
          },
          identityCardBack: {
            label: '法人身份证<br/>(反面)',
            value: null,
          },
          logeCredentialsImage: {
            label: '商标证件',
            value: null,
          },
          certificationImages: {
            label: '行业资质',
            value: null,
            layout: {label: 140, content: 800}
          },
          remarks: {
            label: '备注说明',
            value: null,
          },
          verifyComment: {
            label: '退回原因',
            value: null,
          },
          verifyStopTime: {
            value: null,
          },
        },
        verifyComment: {
          name: 'verifyComment',
          label: '退回原因',
          placeholder: '仅当退回时需要填写',
          value: '',
          initValue: '',
          kind: 'textarea',
          limit: 100,
        },
        submitLoading: false
      }
    },
    mounted() {
      this.queryAuthDetail(this.id)
    },
    computed: {
      authStatus() {
        return this.form.authenticateBrandStatus.value
      },
      id() {
        return this.$route.params.id
      }
    },
    methods: {
      back() {
        this.$router.push('/app/merchant/list')
      },
      async queryAuthDetail(id) {
        this.detailLoading = true
        try {
          const res = await authenticateInfo(id)
          this.initForm(res)
        } catch (e) {
          this.$message.error('未能查询到相关品牌认证信息')
          this.back()
        } finally {
          this.detailLoading = false
        }
      },
      initForm(data) {
        Object.keys(this.form).forEach(i => {
          this.form[i].value = data[i]
          // 保证行业资质字段必为数组，防止报错
          if (i === 'certificationImages' && data[i] !== '') {
            this.form[i].value = data[i].split(',')
          }
        })
      },
      async submit(result) {
        if (result === 0) {
          if (!this.verifyComment.value) {
            return this.$message.error('请填写退回原因！')
          }
        }
        const param = {};
        let res = {};
        param.brandId = this.id;
        param.verifyComment = this.verifyComment.value;
        param.verifyResult = result;
        this.submitLoading = true;
        try {
          res = await authenticate(param)
        } finally {
          this.submitLoading = false
        }
        if (res.success === true) {
          this.$message.success('操作成功');
          this.back()
        } else {
          this.$message.error('操作失败');
          return
        }
      },
      onPreview(url) {
        this.previewVisible = true;
        this.previewSrc = url;
      },
      setVerifyCommentValue(data) {
        this.verifyComment.value = data.value
      }
    },
  }
</script>

<style lang="less" scoped>
  .brand-auth-content {
    .common-scrollbar();
    padding: 40px 0 40px 0;
    overflow-y: auto;
    height: calc(100vh - 105px);

    .detail-item-wrapper {
      /deep/ .content {
        display: block;
      }
    }

    .detail-text {
      font-size: 14px;
      color: #333333;
      margin: 0 17px 0 0;
    }

    .item {
      margin: 0 0 20px 0;

      img {
        cursor: pointer;
      }
    }

    .inline {
      display: flex;
    }
  }
</style>
