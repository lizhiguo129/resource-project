<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- page-tools 是全局注册的组件 这里直接使用 -->
      <page-tools :show-before="true">
        <span slot="before">共166条记录</span>
        <template slot="after">
          <el-button size="small" type="warning">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <!-- sortable="" 这个属性是用来排序的 可以有点击升序降序的按钮 -->
          <el-table-column label="序号" sortable="" type="index" :index="indexMethods" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry" />
          <el-table-column label="账户状态" sortable="" prop="enableState" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employees'
export default {
  name: 'Employees',
  data() {
    return {
      list: [],
      page: {
        page: 1, // 当前页码
        size: 10, // 一页显示的数据条数
        total: 0 // 总数
      }
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
    },
    // 序号的事件 方法
    indexMethods(index) {
      return (this.page.page - 1) * this.page.size + index + 1
    },
    // 分页的数据 点击的事件 这里可以拿到最新的页码
    changePage(Newpage) {
      // Newpage 是参数为 当前页
      this.page.page = Newpage// 在点击的时候更新当前页 然后取重新请求数据
      this.getEmployeeList()// 调用接口 更新页面视图
    }
  }
}
</script>

<style>

</style>
