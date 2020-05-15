<template>
  <div class="commission-config-wrapper">
    <div class="operation">
      <div class="select">
        <a-form layout="inline">
          <a-select placeholder="部分/分公司" style="width:140px;margin:0 10px 0 0;">
            <a-select-option value="china">杭州分公司</a-select-option>
          </a-select>
          <a-select placeholder="职务" style="width:140px;">
            <a-select-option value="china">职务A</a-select-option>
          </a-select>
        </a-form>
      </div>
      <div class="search">
        <span class="history">
          <i class="iconfont">&#xe6e5;</i>历史记录
        </span>
        <a-input-search placeholder="搜索员工姓名" style="width: 280px" enterButton />
      </div>
    </div>
    <a-table>
      <a-table-column title="员工姓名"></a-table-column>
      <a-table-column title="部门"></a-table-column>
      <a-table-column title="职务"></a-table-column>
      <a-table-column title="新购提成方案"></a-table-column>
      <a-table-column title="续费提成方案"></a-table-column>
    </a-table>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.commission-config-wrapper {
  height: 100%;
  padding: 25px 20px 0 20px;
  /* 通用表格 */
  .ant-table-content();
  .operation {
    display: flex;
    justify-content: space-between;
    .search {
      span.history {
        color: rgba(88, 201, 243, 1);
        font-size: 14px;
        cursor: pointer;
        margin: 0 10px 0 0;
        i {
          margin: 0 4px 0 0;
        }
      }
    }
  }
}
</style>