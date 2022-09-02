<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- addDepts 表示子组件传递的事件 -->
        <terr-tools
          :tree-node="company"
          :is-root="false"
          @addDepts="addDepts"
        />
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <terr-tools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 新增弹层 由于弹框组件要用到当前的节点对象 这里传给子组件-->
    <add-dept :show-dialog="showDialog" :currentnode="currentnode" />
  </div>
</template>

<script>
import TerrTools from './components/tree-tools.vue'

import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import AddDept from './components/add-dept.vue'
export default {
  name: 'Departments', // 组件名和 components 不能一样
  components: {
    TerrTools,
    AddDept
  },
  data() {
    return {
      company: {}, // 存放根节点的数据
      departs: [], // 扁平化的数据
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showDialog: false,
      currentnode: {} // 当前节点对象
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '')
    },
    addDepts(node) {
      // 显示弹出层
      this.showDialog = true
      // 将点击的当前节点保存起来
      this.currentnode = node
    }
  }
}
</script>
<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>

