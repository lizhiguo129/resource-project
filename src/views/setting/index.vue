<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <!--  -->
        <el-tabs value="first">
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理" name="first">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <!-- type="index"表示序号;align="center"是内容的对其方式;header-align="left"表示表头的对其方式-->
            <el-table border="" :data="list">
              <el-table-column label="序号" width="120" type="index" align="center" :index="indexMethods" />
              <el-table-column label="角色" width="240" prop="name" align="center" />
              <el-table-column label="描述" prop="description" align="center" header-align="left" />
              <el-table-column label="操作" align="center">
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
            <!-- @current-change是分页组件的默认事件 -->
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息" name="second">
            <!-- 公司信息  -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              :show-icon="true"
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
    <!-- 放置弹层 -->
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 权限的弹层 -->
    <el-dialog :visible="showpromDialog" title="分配权限" @close="btnPermCancel">
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Setting',
  data() {
    return {
      list: [],
      page: {
        page: 1, // 页码
        pagesize: 8, // 每页10条数据
        total: 0// 记录总数
      },
      showDialog: false, // 弹层
      formData: {
        // 存放公司信息的对象
      },
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      showpromDialog: false, // 控制权限弹出层
      permData: [], // 专门用来接收权限数据 树形数据
      defaultProps: {
        label: 'name'
      },
      roleId: null, // 用来记录分配角色的id
      selectCheck: []// 默认选中权限的数组
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 序号计算
    indexMethods(index) {
      // console.log(index, 'llllll')
      return (this.page.page - 1) * this.page.pagesize + index + 1
    },
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total// 后台返回的总记录数
      this.list = rows// 后台返回的列表
    },
    // 角色信息的方法
    changePage(Newpage) {
      // Newpage 是参数为 当前页
      this.page.page = Newpage// 在点击的时候更新当前页 然后取重新请求数据
      this.getRoleList()// 调用接口
    },
    // 调用公司信息的方法
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 删除用户的方法
    async deleteRole(id) {
      try {
        await this.$confirm('你确定删除角色吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await deleteRole(id)// 传入id 去删除
        this.changePage()// 重新加载数据
        this.$message.success('删除角色成功')
      } catch (err) {
        console.log(err)
      }
    },
    // 编辑部门的方法
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)// 获取单独的角色信息 赋值给我们定义好的对象
      this.showDialog = true // 显示弹层
    },
    // 确认按钮
    async btnOK() {
      try {
        // 这里的validate 里面要是不传递参数就会返回一个 promise 对象 所有就用了 await
        await this.$refs.roleForm.validate()
        // 如果roleForm 里面存在 id 就是编辑模式
        if (this.roleForm.id) {
        // 编辑模式
          await updateRole(this.roleForm)
        } else {
        // 新增
          await addRole(this.roleForm)
        }
        this.showDialog = false // 关闭弹层  =>  触发 el-dialog 的事件 close 事件
        this.getRoleList()// 更新视图
        this.$message.success('操作成功')// 提示用户
      } catch (error) {
        console.log(error)
      }
    },
    // 取消按钮
    btnCancel() {
      this.showDialog = false
      // 清空数据
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除检验
      this.$refs.roleForm.resetFields()
    },
    // 点击分配权限
    async assignPerm(id) {
      this.roleId = id // 将id存起来
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      const { permIds } = await getRoleDetail(id)
      this.showpromDialog = true
      this.selectCheck = permIds
    },
    // 点击权限弹层的确定
    async btnPermOK() {
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })// 调用控制权限的接口 传递选中的数据 和角色的id
      this.$message.success('分配权限成功')
      this.showpromDialog = false// 关闭弹层
    },
    // 点击权限弹层的取消
    btnPermCancel() {
      this.selectCheck = []// 情况数组
      this.showpromDialog = false// 关闭弹层
    }
  }
}
</script>

<style>

</style>
