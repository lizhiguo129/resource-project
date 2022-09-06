<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <!-- 下拉选择聘用方式 -->
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartments" />
        <!--  树状的结构 -->
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          :props="{ label: 'name' }"
          :default-expand-all="true"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { tranListToTreeData } from '@/utils'
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'// 定理的默认数据
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum,
      // 表单的数据
      formData: {
        username: '', // 姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职事件
        correctionTime: ''// 转正时间
      },
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 树状结构的显示与隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        // departmentName 的校验是 change 不能是 blur 因为 点击部门的时候就会校验
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 部门获得焦点触发事件
    async  getDepartments() {
      this.loading = true// 开启加载状态
      this.showTree = true // 让tree树状结构显示出来
      const { depts } = await getDepartments()// 请求组织架构接口 数据
      // 返回的 depts是数组 但不是树形
      this.treeData = tranListToTreeData(depts, '')// 将返回的数据经过提前定义好的 递归函数里面再赋值给数据
      this.loading = false// 关闭加载状态
    },
    // 点击的当前部门 事件 node-click 这里面有3个参数 看文档
    selectNode(node) {
      console.log(arguments)
      this.formData.departmentName = node.name // 将点击的当前节点 赋值给 formData.departmentName 里面 让v-model的值去使用
      this.showTree = false// 关闭 tree 组件
    },
    // 点击确定的事件
    async btnOK() {
      try {
        await this.$refs.addEmployee.validate()// 等待表单手动校验成功再执行下面的
        await addEmployee(this.formData)// 调用新增用户接口
        // this.$parent 可以直接调用到父组件的实例 实际上就是父组件this
        this.$parent.getEmployeeList()
        this.$parent.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 点击取消按钮
    btnCancel() {
      // 清空表单
      this.formData = {
        username: '', // 姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职事件
        correctionTime: ''// 转正时间
      }
      this.$refs.addEmployee.resetFields() // 清除检验校验结果
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>

</style>
