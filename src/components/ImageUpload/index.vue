<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :file-list="fileList"
      :on-preview="preview"
      :class="{disabled : fileComputed}"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :on-change="changeFile"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
    <el-dialog title="图片" :visible="showDialog" @close="showDialog=false">
      <img :src="imgUrl" style="width:100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKID0rVu52mIZbOwFJDuMYVEixxjHadR0KQH',
  SecretKey: 'f5GCuOdcR2NSGo68uQggcLp44sSnumPn'
})
export default {
  name: 'ImageUpload',
  data() {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: null,
      showPercent: false,
      percent: 0
    }
  },

  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 删除图片
    handleRemove(file) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 上传图片
    changeFile(file, fileList) {
      // console.log(file, this.fileList)
      // this.fileList = fileList.map(item => item)
      this.fileList = [file]
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeUpload(file) {
      const typeImg = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!typeImg.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false // 上传终止
      }
      // 检查文件大小 不能超过5M 5M 1M = 1024KB 1KB = 1024B
      const maxsize = 5 * 1024 * 1024
      if (file.size > maxsize) {
        this.$message.error('上传图片超过5M')
        return false
      }
      this.showPercent = true
      // 已经确定当前上传的就是当前的这个file了
      this.currentFileUid = file.uid
      // console.log(file)
      return true // 最后一定要return  true
    },
    // upload 事件 覆盖默认的上传行为，可以自定义上传的实现
    upload(params) {
      if (params.file) {
        cos.putObject({
          Bucket: 'lizhiguo-1313832867', // 存储桶
          Region: 'ap-beijing',
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 进度条
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        },
        (err, data) => {
        // data返回数据之后 应该如何处理
          console.log(err || data)
          // 此时说明文件上传成功  要获取成功的返回地址
          if (!err && data.statusCode === 200) {
            this.fileList = this.fileList.map(item => {
              // 就是判断 上传的这个文件 是不是这个文件
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: `https://${data.Location}`, upload: true }
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false // 隐藏进度条
              this.percent = 0 // 进度归0
            }, 2000)
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
