<template>
  <div class="dashboard-container">
    <!-- <page-tools :show-before="true">
      <span slot="before">吃完了</span>
      <template v-slot:after>
        <el-button>导入表格</el-button>
      </template>
    </page-tools> -->
    首页
    管理员： {{ name }}
    <image-upload /></div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
