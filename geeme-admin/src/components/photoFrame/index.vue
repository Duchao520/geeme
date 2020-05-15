<template>
  <div class="geeme-photo-frame-wrapper">
    <div class="photo-frame" :style="{background: background, width: width+'px', height: width+'px'}">
      <img :src="utils.imgFormatter(data.mediaKey)" @load="onload" v-show="loadDone"/>
      <div v-if="hasMask" class="mask" ref="mask" :class='{"showBlock":checkedList.length> 0 && checkedList.indexOf(data.id) != -1}' :style="{width: width+'px', height: width+'px'}">
        <a-checkbox v-if="checkable" class="check" :value="data.id"/>
        <i v-if="deleteable" class="iconfont delete" @click="del">&#xe676;</i>
        <i v-if="previewable" class="iconfont preview" @click="onPreview">&#xe704;</i>
      </div>
    </div>
    <div class="photo-title"><p v-if='!editNameInput'>{{data.name}}</p><a-input ref='input' :autoFocus='true' @blur='onBlur' v-else v-model='data.name'></a-input><a-icon v-if='!editNameInput' @click='editName' type="edit" /></div>

    <!-- preview -->
    <a-modal v-if="previewable" v-model="previewVisible" :footer="null" :width="modalWidth">
      <img :src="utils.imgFormatter(data.mediaKey)" :style="{width: previewWidth}" style="margin-top: 20px;"/>
    </a-modal>
  </div>
</template>

<script>
import utils from '@/utils'
import { modifyMediaName } from '@/api/materialBase'
export default {
  props: {
    /* 此处只考虑正方形相框 */
    width: {
      type: Number,
      default: 183
    },
    data: Object,
    checkable: {
      type: Boolean,
      default: true,
    },
    deleteable: {
      type: Boolean,
      default: true,
    },
    background: {
      type: String,
      default: '#F1F2F7'
    },
    previewable: {
      type: Boolean,
      default: false,
    },
    checkedList: Array
  },
  data() {
    return {
      utils,
      previewVisible: false,
      loadDone: false,
      naturalWidth: 0,
      naturalHeight: 0,
      editNameInput: false
    }
  },
  computed: {
    hasMask() {
      return this.checkable || this.deleteable || this.previewable
    },
    modalWidth() {
      if (this.naturalWidth < 1000) {
        return this.naturalWidth + 50
      } else {
        return 1050
      }
    },
    previewWidth() {
      if (this.naturalWidth < 1000) {
        return `${this.naturalWidth}px`
      } else {
        return '1000px'
      }
    },
  },
  methods: {
    onload(e) {
      const element = e.target
      this.naturalWidth = element.naturalWidth
      this.naturalHeight = element.naturalHeight
      const proportion = element.naturalWidth / element.naturalHeight
      if (proportion >= 1) {
        [element.style.width, element.style.height] = [`${this.width}px`, `${this.width/proportion}px`]
      } else {
        [element.style.width, element.style.height] = [`${this.width*proportion}px`, `${this.width}px`]
      }
      this.loadDone = true
    },
    onPreview() {
      this.previewVisible = true
    },
    //  @pressEnter='changeName'  enter提交会触发两次 因为enter提交之后隐藏输入框触发失去焦点事件
    async changeName() {
      let param = {
        id: this.data.id,
        name: this.data.name
      }
      let res = await modifyMediaName(param);
      if (res.code == 1200) {
        this.$message.success('修改成功');
        this.editNameInput = false;
      } else {
        this.$message.error(res.message);
      }
    },
    del() {
      this.$emit('click',[this.data.id])
    },
    editName() {
      this.editNameInput = true;
    },
    onBlur() {
      this.changeName();
    }
  }
}
</script>

<style lang="less" scoped>
.geeme-photo-frame-wrapper {
  .photo-frame {
    //width: 183px;
    //height: 183px;
    //background: #F1F2F7;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .mask {
      position: absolute;
      top: 0px;
      left: 0px;
      //width: 183px;
      //height: 183px;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      &.showBlock{
        display: block;
      }
      .check {
        position: absolute;
        top: 8px;
        left: 10px;
      }
      .delete {
        position: absolute;
        bottom: 10px;
        right: 10px;
        color: #BEC3C6;
        cursor: pointer;
      }
      .preview {
        cursor: pointer;
        color: #BEC3C6;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &:hover {
      .mask {
        display: block !important;
      }
    }
  }
  .photo-title {
    color: rgba(51, 51, 51, 1);
    font-size: 14px;
    text-align: center;
    margin: 10px 0 0 0;
    width: 183px;
    p{
      max-width: 150px;
      overflow: hidden;
      display: inline-block;
      padding-right: 5px;
      cursor: default;
    }
    i{
      transform: translateY(-5px);
      color:#58C9F3;
      cursor: pointer;
    }
  }
}

</style>