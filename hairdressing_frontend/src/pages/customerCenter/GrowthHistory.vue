<template>
    <div class="pages-main-box scrollbar">
        <div class="pages-edit-container">
            <div class="growth-list">
                <emptyPage/>
            </div>
        </div>
    </div>
</template>
<script>
import emptyPage from '@/pages/emptyPageInShop'
export default {
    components: {
        emptyPage
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
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
.growth-list {
    max-width: 1440px;
    min-height: 100%;
    box-sizing: border-box;
    padding: 30px 10px;
    margin: 0 auto;
    background: #fff;
    border-radius: 6px;
}
</style>
