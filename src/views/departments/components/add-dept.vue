<template>
  <!-- 新增部门的弹层 dialog 为弹层组件-->
  <!-- visible 控制弹框的显示与隐藏 -->
  <el-dialog :title="formData.id?'编辑部门':'添加部门'" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <!-- label-width 代表输入框前面文字的宽度 -->
    <el-form ref="deptForm" label-width="120px" :rules="rules" :model="formData">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option v-for="item in peoples" :key="item.id" :value="item.username" :label="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽 slot="footer" 具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24  这里用6 -->
      <el-col :span="6">
        <!-- type="primary" 表示按钮的类型 颜色 -->
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="medium" @click="btnOK">确定</el-button>

      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDept',
  props: {
    showDialog: {
      type: Boolean,
      required: true,
      default: false
    },
    // 接收父组件传过来的数据 点击的当前组件
    currentnode: {
      type: Object,
      required: true,
      default: null
    }
  },
  data() {
    // 自定义校验规则 判断是不是已经存在这个部门
    const checkNameRepeat = async(rule, value, callback) => {
    // 在这个方法里面首先调用查询组织结构的数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式  item.pid === this.formData.pid 表示找到和自己同级的部门
        // item.id !== this.formData.id 去除自己以外
        isRepeat = depts.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id).some(item => item.name === value)
      } else {
        // 添加部门
        // 通过filter 可以筛选出 该节点下的所有子节点
        isRepeat = depts.filter(item => item.pid === this.currentnode.id)
          .some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`已经存在${value}了`)) : callback()
    }
    // 检查编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式 判断编码不能重复 需要排除自己 剩下的不能的所有的编码不能重复
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value)
        // 这里加一个 value不为空 因为我们的部门有可能没有code
      }
      // 这里加一个 value不为空 因为我们的部门有可能没有code
      isRepeat ? callback(new Error(`组织架构中已经存在这个${value}了`)) : callback()
    }
    return {
      peoples: [], // 存放员工信息的数组
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur', validator: checkNameRepeat
          }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur', validator: checkCodeRepeat
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  methods: {
    async  getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 点击确定
    btnOK() {
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          if (this.formData.id) {
            await updateDepartments(this.formData)
          } else {
            // 添加的部门需要传递的参数为 1）form表单的内容，
          // pid 是你当前点击部门的id  因为只有这样你才能判断他是点击部门的子级 树状结构就是这样渲染的
            await addDepartments({ ...this.formData, pid: this.currentnode.id })
          }
          // 通知父亲去再次调用接口 更新视图
          this.$emit('addDepts')
          // 子组件 update:固定写法 (update:props名称, 值)
          this.$emit('update:showDialog', false) // 触发事件
        }
      })
    },
    // 取消按钮
    btnCancel() {
      // 对该表单项进行重置，将其值重置为初始值并移除校验结果
      this.$refs.deptForm.resetFields()
      this.$emit('update:showDialog', false) // 关闭
      // 因为 resetFields 只能重置form 表单中的数据 编辑的时候有id 这里强制给空
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    // 获取单独部门的信息 进行信息回填 编辑部门
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style>

</style>
