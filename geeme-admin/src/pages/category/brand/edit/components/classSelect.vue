<template>
  <div class="class-select-wrapper">
    <a-form-item
      :label="label"
      :required="required"
      :validate-status="status"
      :help="help"
      v-bind="layout">
      <div class="select-content">
        <div class="class-wrapper" v-for="item in list" :key="item.id">
          <button class="level-one" @click="toggle">
            <a-icon type="plus-square" />
            <a-checkbox :checked="item.checked" :indeterminate="item.indeterminate" @change="onChange(item)">{{item.name}}</a-checkbox>
          </button>
          <div class="level-two">
            <a-row>
              <a-col :span=6  v-for="i in item.subClass" :key="i.id">
                <a-checkbox :checked="i.checked" @change="onChange(i)">{{i.name}}</a-checkbox>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
    </a-form-item>
  </div>
</template>

<script>
import utils from '@/utils'
import { getProductClass } from "@/api/class";
export default {
  props: {
    name: String,
    label: String,
    required: Boolean,
    status: String,
    help: String,
    layout: {
      type: Object,
      default: () => ({ labelCol: { span: 3 }, wrapperCol: { span: 20 } })
    },
    initValue: Array,
  },
  data() {
    return {
      utils,
      list: [],
    }
  },
  watch: {
    initValue(val) {
      this.searchTree(this.list, this.init)
      this.$forceUpdate()
    }
  },
  mounted() {
    this.getProductClass();
  },
  // TODO: 此处代码可以再整理简化
  methods: {
    toggle() {
      /* 防止事件冒泡引起的问题 */
      if (event.target.className !== 'level-one') { return }
      const element = event.target.nextSibling
      if (element.style.maxHeight) {
        element.style.maxHeight = null
      } else {
        element.style.maxHeight = element.scrollHeight + 'px'
      }
    },
    async getProductClass(name) {
      const res = await getProductClass(name);
      this.list = res.data;
      this.searchTree(this.list, this.init)
    },
    searchTree(tree, f, prev=null) {
      for (let i of tree) {
        f.call(this, i, prev)
        const sub = i.subClass
        if (sub instanceof Array && sub.length > 0) {
          this.searchTree(sub, f, i)
        }
      }
    },
    onChange(data) {
      if (data.parentId === 0 && !data.checked) {
        this.checkAll(data, true, false)
      } else if (data.parentId === 0 && data.checked) {
       this.checkAll(data, false, false)
      } else if (data.parentId !== 0) {
        data.checked = !data.checked
        this.searchTree(this.list, this.check.bind(this, data))
      }
      const value = this.count()
      this.$emit('change', { name: this.name, value })
      this.$forceUpdate()
    },
    /* 只考虑两层的情况 */
    init(current, prev) {
      current.checked = false
      current.indeterminate = false
      if (this.initValue) {
        if (this.initValue.indexOf(current.id) > -1) {
          current.checked = true
          const result = this.checkStatus(prev.subClass) 
          if (result === prev.subClass.length) {
            prev.checked = true
            prev.indeterminate = false
          } else if (result > 0) {
            prev.checked = false
            prev.indeterminate = true
          }
        }
      }
    },
    /* 只考虑两层的情况 */
    checkAll(current, checked, indeterminate) {
      current['checked'] = checked
      current['indeterminate'] = indeterminate
      current.subClass.map(i => i['checked'] = checked)
    },
    /* 只考虑两层的情况 */
    check(data, current, prev) {
      const id = data.parentId
      if (current.id === id) {
        const result = this.checkStatus(current.subClass)
        if (result === 0) {
          current.checked = false
          current.indeterminate = false
        } else if (result === current.subClass.length) {
          current.checked = true
          current.indeterminate = false
        } else {
          current.checked = false
          current.indeterminate = true
        }
      }
    },
    checkStatus(current) {
      const result = current.filter(i => !!i.checked)
      return result.length
    },
    /* 统计 只考虑两层的情况 */
    count() {
      const queue = []
      this.searchTree(this.list, function(current, prev) {
        if (current.parentId !== 0 && current.checked) {
          queue.push(current.id)
        } 
      })
      return queue
    }
  }
};
</script>

<style lang="less" scoped>
.class-select-wrapper {
  .normal-form-item();
  .select-content {
    .common-scrollbar();
    overflow-y: scroll;
    width: 600px;
    height: 320px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;

    .class-wrapper {
      /* border-bottom: 1px solid #DCDFE6; */
      .level-one {
        width: 100%;
        height: 40px;
        text-align: left;
        background: #F4F5F7;
        padding: 0 0 0 17px;
        cursor: pointer;
        border-bottom: 1px solid #DCDFE6;
        i {
          font-size: 16px;
          margin: 0 6px 0 0;
          color: #DCDFE6;
          pointer-events: none;
        }
      }
      .level-two {
        background: #FFFFFF;
        padding: 0 0 0 64px;
        border-bottom: 1px solid #DCDFE6;
        transition: max-height 0.2s ease-out;
        overflow: hidden;
        max-height: 0;
        margin: -1px 0 0 0;
      }
    }
  }
}
</style>