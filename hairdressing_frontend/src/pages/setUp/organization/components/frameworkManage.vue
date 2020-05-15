<template>
  <div class="organzation-fmk scrollbar">
    <div class="left-tree-box">
      <div class="headquarters-tree">
        <div class="tree-header" @click="coStatus = !coStatus">
          总部
          <i :class="{open: coStatus, close: !coStatus}"></i>
        </div>
        <div class="co-body scrollbar" v-if="coStatus">
          <geemeTree v-on:gm-tree="getClickedNode" :treeData='coData'></geemeTree>
        </div>
      </div>
      <div class="shops-tree">
        <div class="tree-header" @click="shopStatus = !shopStatus">
          门店
        <i :class="{open: shopStatus, close: !shopStatus}"></i>
        </div>
        <div class="shop-body scrollbar" v-if="shopStatus">
          <!-- 注意: className 和 v-on 指令需要同步 -->
          <geemeTree :className="'gm-shops-tree'" v-on:gm-shops-tree="getSelectedShop" :treeData='shopData'></geemeTree>
        </div>
      </div>
    </div>

    <div class="right-box">
      <div class="search-box">
        <g-search :placeholder='"请输入部门/门店名称"' v-on:search="handleSearch"></g-search>
      </div>
      <div class="right-main">
        <component :is="activeNode" :tags="activeTreeNode"></component>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/scrollbar.scss';
import geemeTree from '@/components/setUp/org-tree'
import HeadQ from './fmk_headquarter'
import Shop from './fmk_shop'
import Area from './fmk_area'
import { mapActions, mapState } from "vuex";
export default {
  name: 'org-fmk',
  data() {
    return{
      coData: [],
      shopData: [],
      coStatus: true,
      shopStatus: true,
      activeTreeNode: {}, // 左侧树的操作获取的数据， 渲染右边用
    }
  },
  created () {
    this.coData = [
      {
        name: '总部(12315)',
        tagName: '总部',
        desc: 'office',
        id: 1,
        list: [
          {
            name: '总裁办(15)',
            tagName: '总裁办',
            desc: 'office',
            id: 11,
            list: []
          },
          {
            name: '市场部(2333)',
            tagName: '市场部',
            desc: 'office',
            id: 21,
            list: [
              {
                name: '营销一部(6666)',
                tagName: '营销一部',
                desc: 'office',
                id: 211,
                list: []
              },
              {
                name: '营销二部(3344)',
                tagName: '营销二部',
                desc: 'office',
                id: 985,
                list: []
              }
            ]
          }
        ]
      }
    ]
    this.shopData = [
      {
        name: '中国(12315)',
        tagName: '中国',
        desc: 'country',
        id: '',
        list: [
          {
            name: '江苏省(5555)',
            tagName: '江苏省',
            desc: 'province',
            id: '',
            list: []
          },
          {
            name: '浙江省(6666)',
            tagName: '浙江省',
            desc: 'province',
            id: '',
            list: [
              {
                name: '杭州市(3344)',
                tagName: '杭州市',
                desc: 'city',
                id: '',
                list: [
                  {
                    name: '西湖区(1212)',
                    tagName: '西湖区',
                    desc: 'area',
                    id: '',
                    list: [
                      {
                        name: '西湖文化广场店(1212)',
                        tagName: '西湖文化广场店',
                        desc: 'shop',
                        id: 12121,
                        list: []
                      },
                      {
                        name: '银泰店(1223)',
                        tagName: '银泰店',
                        desc: 'shop',
                        id: 12366,
                        list: []
                      },
                    ]
                  },
                  {
                    name: '滨江区(1314)',
                    tagName: '滨江区',
                    desc: 'area',
                    id: '',
                    list: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
    this.activeTreeNode = {
      nodeId: this.coData[0].id,
      nodeName: this.coData[0].tagName,
      nodeDesc: 'office',
      nodeTag: 'HeadQ'
    }
  },
  methods: {
    getClickedNode(org) {
      console.log(org)
      this.activeTreeNode = org
    },
    getSelectedShop(shop) {
      console.log(shop)
      this.activeTreeNode = shop
    },
    handleSearch(keyword) {
      console.log(keyword)
    }
  },
  computed: {
    activeNode() {
      let tag = this.activeTreeNode.nodeTag
      return tag === 'Shop'?'Area':tag
    }
  },
  components: { geemeTree, HeadQ, Area, Shop }
}
</script>

<style scoped lang='scss'>
.organzation-fmk {
  margin-top: 10px;
  min-height: 720px;
  padding-bottom: 15px;
  // display: flex;
  // flex-direction: row;
  position: relative;
  .left-tree-box {
    position: absolute;
    margin-left: 30px;
    margin-right: 20px;
    width: 330px;
    min-width: 330px;
    .headquarters-tree {
      margin-bottom: 20px;
      .co-body {
        border: 1px solid #dee1e6;
        border-radius: 0 0 5px 5px;
        height: 182px;
        overflow: auto;
      }
    }
    .shops-tree {
      margin-bottom: 35px;
      .shop-body {
        border: 1px solid #dee1e6;
        border-radius: 0 0 5px 5px;
        height: 416px;
        overflow: auto;
      }
    }
  }
  .right-box {
    margin-left: 380px;
    // flex: 1;
    margin-right: 20px;
    &::before {
      content: '';
      display: table;
    }
    position: relative;
    .search-box {
      height: 35px;
      width: 280px;
      position: absolute;
      right: 0;
    }
    .right-main {
      margin-top: 60px;
    }
  }
  .tree-header {
    height: 26px;
    font-size: 14px;
    line-height: 26px;
    font-weight: 700;
    background: #dee1e6;
    text-indent: 8px;
    border-radius: 5px 5px 0 0;
    position: relative;
  }
  i {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-left: 1px solid #999;
    border-top: 1px solid #999;
    position: absolute;
    right: 12px;
    &.close {
      top: 12px;
      transform: rotate(45deg);
    }
    &.open {
      top: 8px;
      transform: rotate(225deg);
    }
  }
}
</style>
