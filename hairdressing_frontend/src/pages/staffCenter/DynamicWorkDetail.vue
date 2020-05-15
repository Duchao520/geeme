<template>
  <div class="detail-root" v-loading="loading">
    <common-header
      title="作品动态详情"
      padding="0px"
      buttonText="关闭"
      width="1440px"
      @click="$router.go(-1)"
    ></common-header>
    <div class="detail-root-container">
      <div class="detail-con-warp">
        <div class="detail-con" ref="detailCon">
          <div class="common-con">
            <img class="img" :src="utils.formatPicImg(workDetail.headPortrait)" />
            <div class="con-detail">
              <div class="title">
                <div>
                  <p>{{workDetail.nickName}}</p>
                  <span>{{workDetail.createTime}}</span>
                </div>
                <button
                  v-if="currentEntry == 'brand'"
                  @click="setStaffDynamicWorksIsHotByIds(workDetail.id,!workDetail.hotS)"
                >{{workDetail.hotS?'取消热门':'热门推荐'}}</button>
              </div>
              <div class="other-con">
                <div class="imgs" v-if="workDetail.photos&&workDetail.photos.length>0">
                  <img
                    v-for="(item,index) in workDetail.photos"
                    preview="1"
                    style="cursor: pointer;"
                    :key="index"
                    :src="utils.formatPicImg(item)"
                  />
                </div>
                <span class="description">{{workDetail.description}}</span>
                <div class="tags-buttons">
                  <div class="tagsInfo">
                    <p class="tag" v-for="(item,index) in workDetail.tagNames" :key="index">{{item}}</p>
                  </div>
                  <div class="four-buttons">
                    <div class="button-number">
                      <i class="icon iconfont icon-icon_opus_share"></i>
                      <span>{{workDetail.shares}}</span>
                    </div>
                    <div class="button-number">
                      <i class="icon iconfont icon-icon_opus_good"></i>
                      <span>{{workDetail.thumbUp}}</span>
                    </div>
                    <div class="button-number">
                      <i class="icon iconfont icon-icon_opus_coll"></i>
                      <span>{{workDetail.collections}}</span>
                    </div>
                    <div class="button-number">
                      <i class="icon iconfont icon-icon_opus_comment"></i>
                      <span>{{workDetail.comments}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="title-box" v-if="commodity.length > 0">
            <span>|</span>
            <p>关联商品</p>
          </div>
          <div class="products">
            <div class="product" v-for="(item,index) in commodity" :key="index">
              <img :src="utils.formatPicImg(item.cycleImage,'style',70)" alt />
              <div class="text">
                <p :title="item.title">{{item.title}}</p>
                <span>￥{{item.shopPrice}}</span>
              </div>
            </div>
          </div>
          <div
            class="title-box"
            v-if="staffDynamicWorkComments && staffDynamicWorkComments.length>0"
          >
            <span>|</span>
            <p>评论</p>
          </div>
          <div class="common-con" v-for="(item,index) in staffDynamicWorkComments" :key="index">
            <img class="img" :src="utils.formatPicImg(item.headPortrait)" />
            <div class="con-detail">
              <div class="title">
                <div>
                  <p>{{item.name}}</p>
                  <span>{{item.createTime}}</span>
                </div>
                <div class="icon-button">
                  <i class="icon iconfont icon-icon_opus_good"></i>
                  <span class="span">{{item.thumbUp}}</span>
                </div>
              </div>
              <div class="other-con">
                <div class="description-wrap">
                  <p class="description">{{item.content}}</p>
                  <i
                    style="color:#BEC3C6"
                    class="icon iconfont icon-icon_operate_delete"
                    @click="staffDynamicWorksComments(item.id)"
                  ></i>
                </div>
                <div v-if="item.replyList&&item.replyList.length>0" class="replys">
                  <div
                    class="common-con"
                    :class="{'reply-border':!(index_===item.replyList.length-1)}"
                    style="font-size:12px"
                    v-for="(replyItem,index_) in item.replyList"
                    :key="index_"
                  >
                    <img class="img" :src="utils.formatPicImg(replyItem.headPortrait,'circle',50)" />
                    <div class="con-detail">
                      <div class="title">
                        <div>
                          <p>{{replyItem.fromName}}</p>
                          <span>{{replyItem.createTime}}</span>
                        </div>
                      </div>
                      <div class="other-con">
                        <div class="description-wrap">
                          <p class="description">
                            回复
                            <span style="color:#F52D56">{{` ${replyItem.toName} `}}</span>
                            {{replyItem.content}}
                          </p>
                          <i
                            style="color:#BEC3C6"
                            class="icon iconfont icon-icon_operate_delete"
                            @click="staffDynamicWorksReplies(replyItem.id)"
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="noData" v-if="noDynamicWorkComments">没有更多了</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "@/assets/js/interface";
import * as utils from "@/assets/js/utils";
import * as axios from "@/util/axios";
import { mapState } from "vuex";
import { setTimeout } from "timers";
export default {
  props: {},
  data() {
    return {
      utils: utils,
      workDetail: {},
      workId: "",
      pagesInfo: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      staffDynamicWorkComments: [],
      commodity: [],
      loading: false,
      noDynamicWorkComments: false
    };
  },
  mounted() {
    this.workId = this.$route.query.workId;
    this.staffDynamicWorksDetail();
    if (document.addEventListener) {
      document.addEventListener("mousewheel", this.scroll, false);
    } else {
      document.attachEvent("onmousewheel", this.scroll);
    }
  },
  computed: {
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  methods: {
    staffDynamicWorksDetail() {
      axios.get("/getDynamicDetail4Pc/" + this.workId).then(res => {
        this.staffDynamicWorksDetailRes(res);
      });
    },
    staffDynamicWorksDetailRes(res) {
      this.workDetail = res;
      let serviceInfoForDynamicList =
        res.serviceInfoForDynamicList &&
        res.serviceInfoForDynamicList.length > 0
          ? res.serviceInfoForDynamicList
          : [];
      let productInfoForDynamicList =
        res.productInfoForDynamicList &&
        res.productInfoForDynamicList.length > 0
          ? res.productInfoForDynamicList
          : [];
      // console.log(serviceInfoForDynamicList);
      // console.log(productInfoForDynamicList);
      this.commodity = [];
      // this.commodity.concat(serviceInfoForDynamicList,productInfoForDynamicList);
      this.commodity.push(
        ...serviceInfoForDynamicList,
        ...productInfoForDynamicList
      );
      //console.log(this.commodity)
      this.pagesInfo.currentPage = 1;
      this.getPcDynamicCommentListByDynamicId();
      this.$previewRefresh() // 解决图片放大功能可能失效
    },
    getPcDynamicCommentListByDynamicId() {
      let that = this;
      this.loading = true;
      let pageSize = this.pagesInfo.pageSize;
      let currentPage = this.pagesInfo.currentPage;
      let params = { pageSize, currentPage, dynamicId: this.workId };
      axios.post("/pcDynamicCommentListByDynamicId", params).then(res => {
        this.loading = false;
        if (currentPage == 1) {
          this.staffDynamicWorkComments = [];
        }
        this.staffDynamicWorkComments.push(...res.staffDynamicWorkCommentList);
        this.pagesInfo.total = res.total;
      });
    },
    setStaffDynamicWorksIsHotByIds(id, bool) {
      axios
        .put(api.setStaffDynamicWorksIsHotByIds.URL, {
          idList: [id],
          isHot: bool
        })
        .then(res => {
          this.setStaffDynamicWorksIsHotByIdsRes(res);
        });
    },
    setStaffDynamicWorksIsHotByIdsRes(res) {
      if (res.success) {
        this.$message({ type: "success", message: "操作成功" });
        this.staffDynamicWorksDetail();
      }
    },
    staffDynamicWorksComments(id) {
      axios.del(api.staffDynamicWorksComments.URL + id, {}).then(res => {
        this.pagesInfo.currentPage = 1;
        this.staffDynamicWorksDetail();
      });
    },
    staffDynamicWorksReplies(id) {
      let that = this;
      axios.del(api.staffDynamicWorksReplies.URL + id, {}).then(res => {
        that.staffDynamicWorksDetail();
      });
    },
    scroll() {
      if (this.pagesInfo.total > this.pagesInfo.pageSize) {
        let detailConWarp = document.getElementsByClassName(
          "detail-con-warp"
        )[0];
        let detailCon = document.getElementsByClassName("detail-con")[0];
        let detailConWarpH = detailConWarp.offsetHeight;
        let scrollTop = detailConWarp.scrollTop;
        let detailConH = detailCon.offsetHeight;
        let scrollButtom = detailConH - detailConWarpH - scrollTop;
        let totalPage = Math.ceil(
          this.pagesInfo.total / this.pagesInfo.pageSize
        );
        console.log(scrollButtom);
        if (scrollButtom <= 0) {
          if (!this.loading && this.pagesInfo.currentPage < totalPage) {
            this.pagesInfo.currentPage += 1;
            this.getPcDynamicCommentListByDynamicId();
          } else {
            this.noDynamicWorkComments = true;
            console.log("没有数据了");
          }
        } else {
          this.noDynamicWorkComments = false;
        }
      }
    },
    getScrollTop() {
      var scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop;
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin font($lineheight, $fontsize, $color) {
  line-height: $lineheight;
  font-size: $fontsize;
  color: $color;
}
@mixin button($lineheight, $fontsize, $color, $paddinglr, $background) {
  box-sizing: border-box;
  padding: 0 $paddinglr;
  font-size: $fontsize;
  line-height: $lineheight;
  background: $background;
  color: $color;
  height: 32px;
}

.detail-root {
  overflow: hidden;
  &-container {
    margin: 20px auto;
    max-width: 1440px;
    height: calc(100vh - 105px);
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    border-radius: 6px;
  }
  .detail-con-warp {
    width: 102%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    .detail-con {
      // width: 102%;
      box-sizing: border-box;
      margin: 15px 16%;
      border-radius: 8px;
      .common-con {
        box-sizing: border-box;
        margin-top: 20px;
        display: flex;
        border-bottom: 1px solid #eaeaea;
        padding-bottom: 10px;
        .img {
          width: 50px;
          height: 50px;
          display: block;
          border-radius: 50%;
        }
        .con-detail {
          box-sizing: border-box;
          padding-left: 7px;
          width: 100%;
          .icon-button {
            color: #333333;
            .span {
              color: #333333;
            }
          }
          .title {
            display: flex;
            justify-content: space-between;
            p {
              @include font(28px, 18px, #333333);
            }
            span {
              @include font(20px, 12px, #999999);
            }
            button {
              @include button(32px, 12px, #676868, 10px, #f4f5f7);
            }
          }
          .other-con {
            width: 100%;
            box-sizing: border-box;
            padding-top: 15px;
            font-size: 14px;
            line-height: 24px;
            color: #666666;
            .imgs {
              display: flex;
              box-sizing: border-box;
              padding-bottom: 15px;
              // width: 90px;
              img {
                display: inline-block;
                margin-right: 10px;
                width: auto;
                height: auto;
                object-fit: cover;
                // max-width: 90px;
                max-height: 90px;
              }
            }
            .description {
              @include font(24px, 14px, #666666);
              word-break: break-word;
            }
            .tags-buttons {
              display: flex;
              justify-content: space-between;
              .tagsInfo {
                display: flex;
                box-sizing: border-box;
                padding-top: 10px;
                .tag {
                  flex: 0 0 auto;
                  width: inherit;
                  line-height: 20px;
                  box-sizing: border-box;
                  padding: 0 15px;
                  border-radius: 11px;
                  line-height: 20px;
                  font-size: 12px;
                  color: #5a5a5a;
                  border: 1px solid #ebebeb;
                  margin-right: 10px;
                }
              }
              .four-buttons {
                display: flex;
                .button-number {
                  margin-right: 20px;
                  span {
                    margin-left: 4px;
                  }
                }
              }
            }
            .description-wrap {
              width: 100%;
              display: flex;
              box-sizing: border-box;
              padding-right: 15px;
              justify-content: space-between;
              i {
                box-sizing: border-box;
                padding-left: 22px;
              }
            }
          }
          .replys {
            background: #f7f7fa;
            border-radius: 4px;
            box-sizing: border-box;
            padding: 15px;
            .reply-border {
              border-bottom: 1px solid #eaeaea;
            }
            .description-wrap {
              padding-right: 0px;
            }
            .common-con {
              .img {
                width: 40px;
                height: 40px;
              }
              .con-detail {
                .title {
                  p {
                    font-size: 14px;
                  }
                }
                .description {
                  font-size: 12px;
                }
              }
            }
          }
        }
        .icon-icon_operate_delete {
          cursor: pointer;
        }
      }
      .title-box {
        display: flex;
        font-weight: 600;
        color: #333333;
        margin: 40px 0 20px;
        span {
          margin-right: 8px;
          font-weight: 900;
          margin-top: -2px;
        }
        p {
          font-size: 16px;
        }
      }
      .products {
        display: flex;
        flex-flow: row wrap;
        .product {
          flex: 0 0 300px;
          display: flex;
          box-sizing: border-box;
          padding: 10px 20px 10px 10px;
          border: 1px solid #ff6d61;
          border-radius: 5px;
          margin: 0 20px 20px 0;
          img {
            width: 70px;
            height: 70px;
            border-radius: 5px;
          }
          .text {
            box-sizing: border-box;
            padding-left: 8px;
            p {
              @include font(17px, 12px, #333333);
            }
            span {
              @include font(30px, 12px, #ff6d61);
            }
          }
        }
      }
      .noData {
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
    }
  }
}
</style>
