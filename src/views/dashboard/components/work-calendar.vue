<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width: 120px" @change="dateChange">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item">{{ item }}</el-option>
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px" @change="dateChange">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item">{{ item }}</el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{ date, data }" class="content">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDate: null,
      yearList: []// 年份的数组
    }
  },
  created() {
    this.currentYear = new Date().getFullYear()
    this.currentMonth = new Date().getMonth() + 1
    this.yearList = Array.from(Array(11), (value, index) => this.currentYear + index - 5)
  },
  methods: {
    // 点击下拉框 就改变了 下拉框的 change 事件
    dateChange() {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`) // 以当前月的1号为起始
    },
    // 休息的字段 显示和隐藏
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    }
  }
}
</script>

<style scoped>
::v-deep .el-calendar-day{
  height:  auto;
 }
 ::v-deep .el-calendar-table__row td,
 ::v-deep .el-calendar-table tr td:first-child,
 ::v-deep .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 ::v-deep .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 ::v-deep .el-calendar__header {
   display: none
 }
</style>
