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
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 新增弹层 由于弹框组件要用到当前的节点对象 这里传给子组件-->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :currentnode="currentnode" @addDepts="getDepartments" />
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
      showDialog: false, // 弹框的显示
      currentnode: {} // 当前节点对象
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      // 这里的id 是为了判断根节点添加的时候 没有验证，导致重复的一级部门没有被筛选出来 找不到id 这里给空 就可以
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '')
    },
    addDepts(node) {
      // 显示弹框
      this.showDialog = true
      // 将点击的当前节点保存起来
      this.currentnode = node
    },
    editDepts(node) {
      // 打开弹框
      this.showDialog = true
      // 点击的当前对象给赋值
      this.currentnode = node
      // 拿到子组件的实例 触发子组件的方法 将当前点击的部门信息的id 传回去
      this.$refs.addDept.getDepartDetail(node.id)
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

