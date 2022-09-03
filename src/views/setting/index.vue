<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <!--  -->
        <el-tabs value="first">
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理" name="first">
            <el-row style="height:60px">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="">
              <el-table-column label="序号" width="120" />
              <el-table-column label="角色" width="240" />
              <el-table-column label="描述" />
              <el-table-column label="操作">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary">编辑</el-button>
                <el-button size="small" type="danger">分配权限</el-button>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination layout="prev,pager,next" />
            </el-row>
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息" name="second">
            <!-- 公司信息查询  -->
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
