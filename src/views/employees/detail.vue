<template>
  <!-- 用户详情的组件 -->
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              ref="userForm"
              label-width="120px"
              style="margin-left: 150px; margin-top: 30px"
              :model="userInfo"
              :rules="rules"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="passwordTwo">
                <el-input v-model="userInfo.passwordTwo" style="width: 300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- <user-info /> -->
            <component :is="userComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user' // 获取用户信息
import { saveUserDetailById } from '@/api/employees'
import userInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
//  用户详情的组件
export default {
  name: 'Detail',
  components: {
    userInfo,
    JobInfo
  },
  data() {
    return {
      userComponent: 'userInfo',
      userId: this.$route.params.id,
      // 是因为我们在跳转路由的时候给了路由用户id的参数 这样下面传递id的时候可以直接通过 this.userId 拿到数据
      userInfo: {
        username: '',
        passwordTwo: ''
        // 这里定义的 passwordTwo 的因为后台给的密码是加密的 我们要通过重新给 后台的 password 传递过去
      },
      // 检验规则
      rules: {
        username: [{
          required: true, message: '姓名不能为空', trigger: 'blur'
        }],
        passwordTwo: [{ required: true, message: '密码不能为空', trigger: 'blur' }, {
          min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    // 拿到员工信息 数据进行回写
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    // 点击保存触发的事件
    async  saveUser() {
      try {
        // 要进行手动进行表单验证
        await this.$refs.userForm.validate()
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.passwordTwo })
        // 通过后面的 passwordTwo 来替换掉前面的 password 然后传递给后台
        this.$store.dispatch('user/logout')
        this.$router.push('/login')
        this.$message.success('密码修改成功，请重新登录')
      } catch (error) {
        console.log(error)
      }
    }
  }

}
</script>

<style>
</style>
