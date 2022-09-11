<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- page-tools 是全局注册的组件 这里直接使用 -->
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">批量导入</el-button>
          <el-button size="small" type="danger" @click="exportData">批量导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <!-- sortable="" 这个属性是用来排序的 可以有点击升序降序的按钮 -->
          <el-table-column label="序号" sortable="" type="index" :index="indexMethods" />
          <el-table-column label="姓名" sortable="" prop="username" align="center" />
          <el-table-column label="头像" align="center">
            <template slot-scope="{row}">
              <img
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
          <!--  表格的 formatter 属性 的方法  用来格式化内容 -->
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template v-slot="obj">
              {{ obj.row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <!-- 账户状态，可以用开关组件switch进行显示  -->
            <template v-slot="obj">
              <el-switch :value="obj.row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
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
        <el-dialog title="二维码" :visible.sync="showCodeDialog" @opened="showQrCode" @close="imgUrl=''">
          <el-row type="flex" justify="center">
            <canvas ref="myCanvas" />
          </el-row>
        </el-dialog>
      </el-card>
    </div>
    <!-- 新建员工弹层组件 -->
    <add-demployee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddDemployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  name: 'Employees',
  components: {
    AddDemployee
  },
  data() {
    return {
      showDialog: false,
      list: [],
      page: {
        page: 1, // 当前页码
        size: 10, // 一页显示的数据条数
        total: 0 // 总数

      },
      showCodeDialog: false// 二维码 弹层
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
    },
    // 表格的 formatter 属性 的方法  用来格式化内容
    // row代表的是一行的数据、column当前使用的列表、cellValue是一列的数据、index是索引
    formatEmployment(row, column, cellValue, index) {
      // find 找到符合条件的第一个对象 没有就返回 undefined
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知的'
    },
    // 删除员工
    async deleteEmployee(id) {
      try {
        await this.$confirm('你确定删除该部门吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delEmployee(id)// 调用删除接口
        this.getEmployeeList()// 重新获取数据 更新页面
        this.$message.success('删除员工成功')// 提示消息
      } catch (error) {
        console.log(error)
      }
    },
    // 点击导出按钮
    exportData() {
      // 定义的表头  就是为了 表头
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })// 获取全部的数据
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]// 复杂表头
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']// 合并单元格
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填 ['姓名','手机号','入职时间']
          data, // 具体数据 必填 为二维数组 [[],[],[]]
          filename: '员工信息表', // 表头
          bookType: 'xlsx', // 导出表的 类型
          multiHeader, // 复杂表头
          merges// 合并单元格
        })
      })
    },
    // 转化 二维数组的函数
    formatJson(headers, rows) {
      return rows.map(item => {
        // 这里的 item 后台返回的 全部数据 的一个个 对象
        return Object.keys(headers).map(key => {
          // 判断头部信息 里面 有没有 入职日期 和 转正日期 进行格式处理
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知的'
          }
          return item[headers[key]]
        })
      })
    },
    // 点击图片出来二维码事件
    showQrCode(url) {
      // url存在的情况下 才弹出层
      if (url) {
        console.log(1)
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        console.log(2)
        this.$message.warning('该用户还未上传头像')
      }
    }
  }
}
</script>

<style>

</style>
