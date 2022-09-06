<template>
  <div class="upload-excel">
    <div class="btn-upload">
      <el-button
        :loading="loading"
        size="mini"
        type="primary"
        @click="handleUpload"
      >
        <!--  @click="handleUpload" 点击按钮时候 触发让用户去选择上传的事件 -->
        点击上传
      </el-button>
    </div>
    <!-- input 是一个表单控件 作用就是收集用户选择的 excal 文件 -->
    <input
      ref="excel-upload-input"
      class="excel-upload-input"
      type="file"
      accept=".xlsx, .xls"
      @change="handleClick"
    >
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <i class="el-icon-upload" />
      <span>将文件拖到此处</span>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      // 把接收到的header 和results放到excelData中传递给 onSuccess方法
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      // 找到input 元素 使得click事件触发 为了选择要上传的文件
      this.$refs['excel-upload-input'].click() // 也就是更改了input 的 change 的事件
    },
    handleClick(e) {
      const files = e.target.files// 获取input 中的 文件 file 数组
      const rawFile = files[0] // 获取了选择要上传的excel 文件
      if (!rawFile) return // 如果用户没有选择文件 那么就停止执行
      this.upload(rawFile)// 如果有文件就上传，调用 upload 方法
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // 点击上传的先把 input 的value 清空 这样就避免了 重复上传

      if (!this.beforeUpload) { // 要是在上传之前不做处理 就继续执行
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      // 等待读取文件的开始
      this.loading = true
      // promise异步编程 因为读取文件是一个耗时的操作，不能堵塞其他代码的执行
      // 因此我要把读文件的操作放在promise中
      return new Promise((resolve, reject) => {
        // 在这里用了两个东西:
        // FileReader是用来把excel中的内容读出来
        // XLSX插件用来把FileReader中读取的文件解析出来
        const reader = new FileReader()
        // 因为reader是FileReader的实例对象
        // 读文件需要等待 所以reade里面自带有一个onload事件
        // 代表的意思是等文件读取完成要干什么事
        reader.onload = e => {
          // e.target.result 是reader这个实例对象的获取读取完数据的一个属性
          // 这是官方规定的
          const data = e.target.result // data就是读取的excel的结果
          // 该内容是一个二进制数据 ，只有通过XLSX插件才可以解析
          const workbook = XLSX.read(data, { type: 'array' }) // workbook就是工作薄
          const firstSheetName = workbook.SheetNames[0] // 获取的第一个sheet的名字
          const worksheet = workbook.Sheets[firstSheetName]// 通过第一个sheet的名字来获取工作的sheet内容
          const header = this.getHeaderRow(worksheet)// 获取的是表头 也就是 姓名 手机号 入职日期 转正日期 工号 部门
          const results = XLSX.utils.sheet_to_json(worksheet)// 通过把单元格信息 转换为json 赋值给results
          // 把表头 和表中的内容传递给 generateData的实参数
          this.generateData({ header, results })
          // 读取文件结束
          this.loading = false
          // 把状态置为成功
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin-top: 100px;

  .excel-upload-input {
    display: none;
    z-index: -9999;
  }

  .btn-upload,
  .drop {
    border: 1px dashed #bbb;
    width: 350px;
    height: 160px;
    text-align: center;
    line-height: 160px;
  }

  .drop {
    line-height: 80px;
    color: #bbb;

    i {
      font-size: 60px;
      display: block;
    }
  }
}
</style>
