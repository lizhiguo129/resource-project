<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <terr-tools :tree-node="company" :is-root="false" />
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <terr-tools slot-scope="{data}" :tree-node="data" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import TerrTools from './components/tree-tools.vue'
export default {
  components: {
    TerrTools
  },
  data() {
    return {
      company: {}, // 存放根节点的数据
      departs: [], // 扁平化的数据
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人' }
      this.departs = result.depts
    }
  }
}

</script>
<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;

}
</style>

